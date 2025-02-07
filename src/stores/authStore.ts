import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'coach' | 'super_user';
}

interface AuthState {
  session: any | null;
  profile: Profile | null;
  setSession: (session: any) => void;
  setProfile: (profile: Profile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
  if (session?.user.id) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          useAuthStore.getState().setProfile(data as Profile);
        }
      });
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
  if (session?.user.id) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          useAuthStore.getState().setProfile(data as Profile);
        }
      });
  } else {
    useAuthStore.getState().setProfile(null);
  }
});