import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Image as ImageIcon, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
  likes: number;
  comments: number;
  media_url?: string;
}

export default function Home() {
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement post creation
    setNewPost('');
    setSelectedMedia(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <div className="glassmorphism rounded-xl p-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with the team..."
          className="w-full bg-background/50 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          rows={3}
        />
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => document.getElementById('file-input')?.click()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ImageIcon className="h-5 w-5" />
            <span>Add Media</span>
          </button>
          <input
            id="file-input"
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

      {/* Posts Feed */}
      <div className="space-y-6">
        {/* Example Post */}
        <article className="glassmorphism rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=JD`}
              alt="John Doe"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-white">John Doe</h3>
              <p className="text-sm text-gray-400">
                {format(new Date(), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <p className="text-gray-100">This is an example post content.</p>

          <div className="flex items-center space-x-6 text-gray-400">
            <button className="flex items-center space-x-2 hover:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>0</span>
            </button>

            <button className="flex items-center space-x-2 hover:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>0</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}