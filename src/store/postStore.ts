import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_url?: string;
  likes_count: number;
  comments_count: number;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (content: string, mediaFile?: File) => Promise<void>;
  fetchPosts: () => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  commentOnPost: (postId: string, userId: string, content: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  createPost: async (content: string, mediaFile?: File) => {
    try {
      set({ loading: true, error: null });
      
      let mediaUrl;
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;
        mediaUrl = uploadData.path;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content,
            media_url: mediaUrl,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        posts: [data, ...state.posts],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create post', loading: false });
    }
  },

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      set({ posts: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch posts', loading: false });
    }
  },

  likePost: async (postId: string, userId: string) => {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (!post) throw new Error('Post not found');

      // Insert like
      const { error: likeError } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);

      if (likeError) throw likeError;

      // Create notification for post owner
      if (post.user_id !== userId) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: post.user_id,
            sender_id: userId,
            type: 'like',
            post_id: postId
          }]);
      }

      await get().fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  },

  commentOnPost: async (postId: string, userId: string, content: string) => {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (!post) throw new Error('Post not found');

      // Insert comment
      const { error: commentError } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          content
        }]);

      if (commentError) throw commentError;

      // Create notification for post owner
      if (post.user_id !== userId) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: post.user_id,
            sender_id: userId,
            type: 'comment',
            post_id: postId
          }]);
      }

      await get().fetchPosts();
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  }
}));