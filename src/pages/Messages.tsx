import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Send, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  media_url?: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

interface ChatUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

export default function Messages() {
  const { user } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .neq('id', user?.id);

        if (error) throw error;
        setChatUsers(data || []);
      } catch (error) {
        console.error('Error fetching chat users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!sender_id(username, avatar_url)
          `)
          .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('INSERT', (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedUser, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedMedia) return;
    if (!user || !selectedUser) return;

    try {
      let mediaUrl;
      if (selectedMedia) {
        const fileExt = selectedMedia.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-media')
          .upload(fileName, selectedMedia);

        if (uploadError) throw uploadError;
        mediaUrl = uploadData.path;
      }

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: user.id,
            receiver_id: selectedUser.id,
            media_url: mediaUrl
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      setSelectedMedia(null);
    } catch (error) {
      console.error('Error sending message:', error);
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
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-4 h-full gap-4">
        {/* Users List */}
        <div className="col-span-1 glassmorphism rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {chatUsers.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-background-lighter transition-colors ${
                  selectedUser?.id === chatUser.id ? 'bg-background-lighter' : ''
                }`}
              >
                <img
                  src={chatUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${chatUser.username}`}
                  alt={chatUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium text-white">{chatUser.full_name}</p>
                  <p className="text-sm text-gray-400">@{chatUser.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 glassmorphism rounded-xl flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center space-x-3">
                <img
                  src={selectedUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.username}`}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-white">{selectedUser.full_name}</h2>
                  <p className="text-sm text-gray-400">@{selectedUser.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.sender_id === user?.id ? 'bg-primary' : 'bg-background-lighter'} rounded-lg p-3`}>
                      {message.content && (
                        <p className="text-white">{message.content}</p>
                      )}
                      {message.media_url && (
                        <div className="mt-2">
                          {message.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                              src={`${supabase.storage.from('message-media').getPublicUrl(message.media_url).data.publicUrl}`}
                              alt="Message media"
                              className="rounded-lg max-h-48 w-auto"
                            />
                          ) : (
                            <video
                              src={`${supabase.storage.from('message-media').getPublicUrl(message.media_url).data.publicUrl}`}
                              controls
                              className="rounded-lg max-h-48 w-auto"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => document.getElementById('message-media-input')?.click()}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ImageIcon className="h-6 w-6" />
                  </button>
                  <input
                    id="message-media-input"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedMedia}
                    className="bg-primary p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {selectedMedia && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      {selectedMedia.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(selectedMedia)}
                          alt="Selected media"
                          className="h-20 rounded-lg"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(selectedMedia)}
                          className="h-20 rounded-lg"
                          controls
                        />
                      )}
                      <button
                        onClick={() => setSelectedMedia(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}