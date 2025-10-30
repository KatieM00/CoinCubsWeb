import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, UserProfile } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

// Get current user's profile
export function useGetUserProfile() {
  const { user } = useSupabaseAuth();

  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist yet
          return null;
        }
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user,
  });
}

// Save/update user profile
export function useSaveUserProfile() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string; role: 'admin' | 'user' }) => {
      if (!user) throw new Error('No authenticated user');

      const profileData = {
        id: user.id,
        name: profile.name,
        role: profile.role,
        email: user.email || '',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) throw error;

      return data as UserProfile;
    },
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
