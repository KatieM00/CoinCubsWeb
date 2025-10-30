import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';

// Re-export user profile queries
export { useGetUserProfile, useSaveUserProfile } from './useUserQueries';

// Authorization check
export const useIsCallerAdmin = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['isCallerAdmin', profile?.id],
    queryFn: async () => {
      return profile?.role === 'teacher';
    },
    enabled: !!profile
  });
};

// TODO: Add other query hooks as needed for:
// - Student accounts
// - Class funds
// - Rewards
// - Voting proposals
// - Goals and achievements
// - Chat messages
// - Curriculum
// etc.
