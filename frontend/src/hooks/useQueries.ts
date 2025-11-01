import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDemo } from '@/contexts/DemoContext';
import { useDemoData } from '@/contexts/DemoDataContext';

// Re-export user profile queries
export { useGetUserProfile, useSaveUserProfile } from './useUserQueries';

// Authorization check
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

// ============================================================================
// STUB IMPLEMENTATIONS - These will be replaced with real Supabase queries
// ============================================================================

// Class Fund Queries
export const useGetClassFund = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['classFund'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return {
          balance: demoData.classFundBalance,
          transactions: demoData.transactions,
          goals: demoData.classGoals
        };
      }
      return { balance: 0 };
    },
  });
};

export const useAwardClassGems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { amount: number; reason: string }) => {
      console.log('Stub: Award class gems', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
    },
  });
};

// Class Goals Queries
export const useGetClassGoals = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['classGoals'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.classGoals;
      }
      return [];
    },
  });
};

export const useCreateClassGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Create class goal', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
    },
  });
};

// Activity Ticker Queries
export const useGetActivityTicker = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['activityTicker'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.activityTicker;
      }
      return [];
    },
  });
};

// Display Mode Queries
export const useGetDisplayMode = () => {
  return useQuery({
    queryKey: ['displayMode'],
    queryFn: async () => ({ mode: 'dashboard' }),
  });
};

// Lesson Content Queries
export const useGetActiveLessonContent = () => {
  return useQuery({
    queryKey: ['activeLessonContent'],
    queryFn: async () => null,
  });
};

// Voting Queries
export const useGetActiveVotingProposals = () => {
  return useQuery({
    queryKey: ['activeVotingProposals'],
    queryFn: async () => [],
  });
};

export const useCreateVotingProposal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Create voting proposal', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
};

export const useUpdateVoteCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Update vote count', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
};

export const useFinalizeVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Finalize vote', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
};

export const useValidateVoteTotals = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Validate vote totals', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
};

// Curriculum Queries
export const useGetCurriculumModules = () => {
  return useQuery({
    queryKey: ['curriculumModules'],
    queryFn: async () => [],
  });
};

export const useGetCurrentWeek = () => {
  return useQuery({
    queryKey: ['currentWeek'],
    queryFn: async () => ({ weekNumber: 1 }),
  });
};

export const useInitializeCurriculum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      console.log('Stub: Initialize curriculum');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumModules'] });
    },
  });
};

export const useStartMondayLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekNumber: any) => {
      console.log('Stub: Start Monday lesson', weekNumber);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
    },
  });
};

export const useStartFridayLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekNumber: any) => {
      console.log('Stub: Start Friday lesson', weekNumber);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
    },
  });
};

export const useSkipToWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekNumber: any) => {
      console.log('Stub: Skip to week', weekNumber);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
};

export const useRestartCurriculum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      console.log('Stub: Restart curriculum');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumModules'] });
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
};

export const useGetCurriculumProgress = () => {
  return useQuery({
    queryKey: ['curriculumProgress'],
    queryFn: async () => ({ completedWeeks: 0, totalWeeks: 36 }),
  });
};

// Achievements Queries
export const useGetClassAchievements = () => {
  return useQuery({
    queryKey: ['classAchievements'],
    queryFn: async () => [],
  });
};

// Rewards Queries
export const useGetRewardsCatalog = () => {
  return useQuery({
    queryKey: ['rewardsCatalog'],
    queryFn: async () => [],
  });
};

export const useAddReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Add reward', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
};

export const useUpdateRewardPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Update reward price', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
};

export const useBulkUpdateRewardPrices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Bulk update reward prices', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
};

// Preset Amounts & Reasons Queries
export const useGetPresetAmounts = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['presetAmounts'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.presetAmounts.map(n => Number(n));
      }
      return [5, 10, 20, 50];
    },
  });
};

export const useUpdatePresetAmounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amounts: any) => {
      console.log('Stub: Update preset amounts', amounts);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetAmounts'] });
    },
  });
};

export const useGetPresetReasons = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['presetReasons'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.presetReasons;
      }
      return [];
    },
  });
};

export const useAddCustomReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reason: any) => {
      console.log('Stub: Add custom reason', reason);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
};

export const useUpdateReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Update reason', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
};

export const useDeleteReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reasonId: any) => {
      console.log('Stub: Delete reason', reasonId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
};

// Student Queries
export const useGetLastAwardedStudents = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['lastAwardedStudents'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.lastAwardedStudents;
      }
      return [];
    },
  });
};

export const useUpdateStudentNotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Update student notes', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      console.log('Stub: Update student status', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Undo & Transaction Queries
export const useGetUndoTransaction = () => {
  return useQuery({
    queryKey: ['undoTransaction'],
    queryFn: async () => null,
  });
};

export const useUndoLastAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      console.log('Stub: Undo last award');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Weekly Stats Queries
export const useGetWeeklyStats = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.weeklyStats;
      }
      return { totalAwarded: 0, topEarners: [] };
    },
  });
};

// Approvals Queries
export const useListApprovals = () => {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => [],
  });
};
