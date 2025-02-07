import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            className="glassmorphism rounded-xl p-4 hover:bg-background-lighter transition-colors"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt={user.username}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-white truncate max-w-full">
                  {user.name || user.username}
                </h3>
                <p className="text-sm text-gray-400 truncate max-w-full">
                  @{user.username}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No users found matching your search.
        </div>
      )}
    </div>
  );
}