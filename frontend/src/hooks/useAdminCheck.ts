import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { useDemo } from '@/contexts/DemoContext';

export const useIsCallerAdmin = () => {
  const { profile } = useAuth();
  const { isDemoMode } = useDemo();

  return useQuery({
    queryKey: ['isCallerAdmin', profile?.id],
    queryFn: async () => {
      // In demo mode, always return true for teacher role
      if (isDemoMode) {
        return profile?.role === 'teacher';
      }
      return profile?.role === 'teacher';
    },
    enabled: !!profile // Profile will exist in demo mode thanks to useAuth update
  });
};
