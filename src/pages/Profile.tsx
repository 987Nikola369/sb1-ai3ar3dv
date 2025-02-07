import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  age: number;
  team: string;
  position: string;
  is_parent: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background-light rounded-lg shadow-lg overflow-hidden">
        <div className="h-32 bg-primary"></div>
        <div className="px-6 py-4">
          <div className="relative">
            <img
              src={profile?.avatar_url || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-background absolute -top-12"
            />
          </div>
          <div className="mt-16">
            <h1 className="text-2xl font-bold">{profile?.full_name || 'New User'}</h1>
            <p className="text-gray-300">@{profile?.username || 'username'}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold">Team</h3>
              <p className="text-gray-300">{profile?.team || 'Not set'}</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold">Position</h3>
              <p className="text-gray-300">{profile?.position || 'Not set'}</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold">Age</h3>
              <p className="text-gray-300">{profile?.age || 'Not set'}</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold">Account Type</h3>
              <p className="text-gray-300">{profile?.is_parent ? 'Parent' : 'Player'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}