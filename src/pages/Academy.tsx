import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Image as ImageIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

interface AcademyPost {
  id: string;
  content: string;
  created_at: string;
  media_url?: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export default function Academy() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<AcademyPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
        
      if (!error && data) {
        setIsStaff(['super_user', 'coach'].includes(data.role));
      }
    };

    checkUserRole();
  }, [user]);

  useEffect(() => {
    const fetchAcademyPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .eq('is_academy_post', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchAcademyPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedMedia) return;

    try {
      let mediaUrl;
      if (selectedMedia) {
        const fileExt = selectedMedia.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, selectedMedia);

        if (uploadError) throw uploadError;
        mediaUrl = uploadData.path;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: newPost,
            media_url: mediaUrl,
            user_id: user?.id,
            is_academy_post: true
          }
        ])
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setPosts([data, ...posts]);
      setNewPost('');
      setSelectedMedia(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {isStaff && (
        <div className="glassmorphism rounded-xl p-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share an academy announcement..."
            className="w-full bg-background/50 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            rows={3}
          />
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => document.getElementById('academy-file-input')?.click()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Add Media</span>
            </button>
            <input
              id="academy-file-input"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
            />
            
            <button
              onClick={handlePostSubmit}
              disabled={!newPost.trim() && !selectedMedia}
              className="bg-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Post</span>
              <Send className="h-4 w-4" />
            </button>
          </div>

          {selectedMedia && (
            <div className="mt-4">
              {selectedMedia.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedMedia)}
                  alt="Selected media"
                  className="max-h-48 rounded-lg object-cover"
                />
              ) : (
                <video
                  src={URL.createObjectURL(selectedMedia)}
                  className="max-h-48 rounded-lg"
                  controls
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="glassmorphism rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.username}`}
                alt={post.user.username}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-white">{post.user.username}</h3>
                <p className="text-sm text-gray-400">
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <p className="text-gray-100">{post.content}</p>

            {post.media_url && (
              <div className="rounded-lg overflow-hidden">
                {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
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
          </article>
        ))}
      </div>
    </div>
  );
}