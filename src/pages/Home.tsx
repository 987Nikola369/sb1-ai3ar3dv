import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { id: string }[];
  comments: { id: string }[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { profile } = useAuthStore();
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username, avatar_url),
        likes (id),
        comments (id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim()) return;

    const { error } = await supabase
      .from('posts')
      .insert([{ content: newPost, user_id: profile?.id }]);

    if (error) {
      console.error('Error creating post:', error);
      return;
    }

    setNewPost('');
    fetchPosts();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-lg p-4 mb-8 backdrop-blur-sm"
      >
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-700/50 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
            rows={3}
          />
          <div className="mt-4 flex justify-end">
            <motion.button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post
            </motion.button>
          </div>
        </form>
      </motion.div>

      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.profiles.username}</h3>
                <p className="text-sm text-gray-400">
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <p className="text-gray-200 mb-4">{post.content}</p>
            <div className="flex items-center space-x-6 text-gray-400">
              <button className="flex items-center space-x-2 hover:text-red-500">
                <Heart className="w-5 h-5" />
                <span>{post.likes.length}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}