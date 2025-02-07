import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Heart, MessageCircle, Bookmark, Image as ImageIcon, Film, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  likes_count: number;
  comments_count: number;
  user: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export default function Feed() {
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, avatar_url, full_name),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(pageParam * 20, (pageParam + 1) * 20 - 1);

      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.length === 20 ? pages.length : undefined;
    }
  });

  const createPost = useMutation({
    mutationFn: async ({ content, mediaFile }: { content: string; mediaFile?: File }) => {
      let mediaUrl = '';
      let mediaType = '';

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;
        mediaUrl = uploadData.path;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content,
            user_id: user?.id,
            media_url: mediaUrl,
            media_type: mediaType
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPostContent('');
      setSelectedMedia(null);
    }
  });

  const toggleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: user?.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('File size too large. Maximum size is 50MB.');
        return;
      }
      setSelectedMedia(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedMedia) return;

    try {
      await createPost.mutateAsync({
        content: newPostContent,
        mediaFile: selectedMedia || undefined
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (status === 'error') {
    return <div className="text-red-500 p-8">Error loading posts</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {user && (
        <form onSubmit={handleSubmit} className="bg-background-light backdrop-blur-sm rounded-xl p-4 space-y-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share something with the community..."
            className="w-full bg-background rounded-lg p-3 min-h-[100px] text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaSelect}
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-background hover:bg-background-lighter transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Media</span>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={(!newPostContent.trim() && !selectedMedia) || createPost.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {createPost.isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
          
          {selectedMedia && (
            <div className="relative inline-block">
              {selectedMedia.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedMedia)}
                  alt="Selected media"
                  className="max-h-48 rounded-lg"
                />
              ) : (
                <video
                  src={URL.createObjectURL(selectedMedia)}
                  className="max-h-48 rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </form>
      )}

      <div className="space-y-6">
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.map((post: Post) => (
              <article key={post.id} className="bg-background-light backdrop-blur-sm rounded-xl p-4 space-y-4 transition-all hover:shadow-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.username}`}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.user.full_name}</h3>
                    <p className="text-sm text-gray-400">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <p className="text-gray-100">{post.content}</p>

                {post.media_url && (
                  <div className="rounded-lg overflow-hidden">
                    {post.media_type === 'image' ? (
                      <img
                        src={`${supabase.storage.from('post-media').getPublicUrl(post.media_url).data.publicUrl}`}
                        alt="Post media"
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={`${supabase.storage.from('post-media').getPublicUrl(post.media_url).data.publicUrl}`}
                        className="w-full h-auto"
                        controls
                        preload="metadata"
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-6 text-gray-400">
                  <button
                    onClick={() => toggleLike.mutate({ postId: post.id, isLiked: post.is_liked || false })}
                    className={`flex items-center space-x-2 transition-colors ${post.is_liked ? 'text-red-500' : 'hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span>{post.likes_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </article>
            ))}
          </React.Fragment>
        ))}
      </div>

      {isFetchingNextPage ? (
        <div className="text-center p-4">Loading more posts...</div>
      ) : hasNextPage ? (
        <div ref={ref} className="text-center p-4">
          Load more posts
        </div>
      ) : (
        <div className="text-center p-4 text-gray-400">No more posts</div>
      )}
    </div>
  );
}