import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDemo } from '@/contexts/DemoContext';
import { useDemoData } from '@/contexts/DemoDataContext';
import { supabase } from '@/lib/supabase';
import { getAllCurriculumModules } from '@/data/curriculumData';
import { LessonCompletion } from '@/types';

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
  const { profile, user } = useAuth();

  return useQuery({
    queryKey: ['classFund', profile?.id, user?.id],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return {
          balance: demoData.classFundBalance,
          transactions: demoData.transactions,
          goals: demoData.classGoals
        };
      }

      // For non-demo mode, use localStorage
      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);

      if (stored) {
        const data = JSON.parse(stored);
        return {
          balance: BigInt(data.balance || 0),
          transactions: data.transactions || [],
          goals: data.goals || []
        };
      }

      // Initialize with default values
      const defaultData = {
        balance: 0,
        transactions: [],
        goals: []
      };
      localStorage.setItem(`classFund_${storageKey}`, JSON.stringify(defaultData));
      return { balance: BigInt(0), transactions: [], goals: [] };
    },
  });
};

export const useAwardClassGems = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useMutation({
    mutationFn: async (params: { studentId?: string; amount: bigint | number; splitType?: string; description?: string; reason?: string }) => {
      console.log('💎 Awarding class CubCoins:', params);

      if (isDemoMode && demoData) {
        // In demo mode, use the demo context's awardStudent function
        // For now, just log - the demo context handles this
        console.log('Demo mode - award handled by demo context');
        return { success: true };
      }

      // Convert BigInt to number if needed
      const amountNumber = typeof params.amount === 'bigint' ? Number(params.amount) : params.amount;

      // Calculate split (70% to class fund, 30% to personal balance)
      const classAmount = Math.floor(amountNumber * 0.7);
      const personalAmount = amountNumber - classAmount;

      // Update class fund in localStorage
      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);
      const data = stored ? JSON.parse(stored) : { balance: 0, transactions: [], goals: [] };

      // Update class fund balance
      const newBalance = Number(data.balance || 0) + classAmount;

      // Add transaction
      const transaction = {
        id: Date.now(),
        amount: classAmount,
        reason: params.description || params.reason || 'Award',
        timestamp: new Date().toISOString(),
        type: 'award'
      };

      data.balance = newBalance;
      data.transactions = [transaction, ...(data.transactions || [])];

      localStorage.setItem(`classFund_${storageKey}`, JSON.stringify(data));
      console.log('💾 Updated class fund:', data);

      // Update student's personal balance in database if studentId provided and not whole class
      if (params.studentId && params.studentId !== '0' && personalAmount > 0) {
        console.log(`💰 Updating student ${params.studentId} balance by +${personalAmount}`);

        // Get current student data
        const { data: studentData, error: fetchError } = await supabase
          .from('students')
          .select('personal_balance, class_contribution')
          .eq('id', params.studentId)
          .single();

        if (fetchError) {
          console.error('⚠️ Error fetching student:', fetchError);
          throw fetchError;
        }

        // Update student balance
        const newPersonalBalance = Number(studentData.personal_balance || 0) + personalAmount;
        const newClassContribution = Number(studentData.class_contribution || 0) + classAmount;

        const { error: updateError } = await supabase
          .from('students')
          .update({
            personal_balance: newPersonalBalance,
            class_contribution: newClassContribution
          })
          .eq('id', params.studentId);

        if (updateError) {
          console.error('⚠️ Error updating student balance:', updateError);
          throw updateError;
        }

        console.log('✅ Updated student balance:', {
          personalBalance: newPersonalBalance,
          classContribution: newClassContribution
        });
      }

      return { success: true, newBalance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStats'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateClassBalance = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (params: { amount: number; reason: string; type: 'add' | 'subtract' | 'set' }) => {
      if (isDemoMode) {
        console.log('Demo mode - balance update not persisted');
        return { success: true };
      }

      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);
      const data = stored ? JSON.parse(stored) : { balance: 0, transactions: [], goals: [] };

      let newBalance = Number(data.balance || 0);

      if (params.type === 'add') {
        newBalance += params.amount;
      } else if (params.type === 'subtract') {
        newBalance -= params.amount;
      } else if (params.type === 'set') {
        newBalance = params.amount;
      }

      // Add transaction
      const transaction = {
        id: Date.now(),
        amount: params.type === 'set' ? params.amount - Number(data.balance || 0) : params.amount,
        reason: params.reason,
        timestamp: new Date().toISOString(),
        type: params.type === 'subtract' ? 'deduction' : 'adjustment'
      };

      data.balance = newBalance;
      data.transactions = [transaction, ...(data.transactions || [])];

      localStorage.setItem(`classFund_${storageKey}`, JSON.stringify(data));
      console.log('💾 Updated class balance:', data);

      return { success: true, newBalance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStats'] });
    },
  });
};

// Class Goals Queries
export const useGetClassGoals = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;
  const { profile, user } = useAuth();

  return useQuery({
    queryKey: ['classGoals', profile?.id, user?.id],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.classGoals;
      }

      // Read from classFund storage
      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);

      if (stored) {
        const data = JSON.parse(stored);
        return data.goals || [];
      }

      return [];
    },
  });
};

export const useCreateClassGoal = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (params: { name: string; description: string; targetAmount: bigint | number }) => {
      if (isDemoMode) {
        console.log('Demo mode - goal creation not persisted');
        return { success: true };
      }

      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);
      const data = stored ? JSON.parse(stored) : { balance: 0, transactions: [], goals: [] };

      const newGoal = {
        id: Date.now().toString(),
        name: params.name,
        description: params.description,
        targetAmount: typeof params.targetAmount === 'bigint' ? Number(params.targetAmount) : params.targetAmount,
        currentAmount: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      data.goals = [...(data.goals || []), newGoal];
      localStorage.setItem(`classFund_${storageKey}`, JSON.stringify(data));
      console.log('✅ Created goal:', newGoal);

      return { success: true, goal: newGoal };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
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
    queryFn: async () => 'dashboard',
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
    queryFn: async () => {
      // Return the curriculum data
      return getAllCurriculumModules();
    },
  });
};

export const useGetCurrentWeek = () => {
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['currentWeek', profile?.id, user?.id],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return { weekNumber: Number(demoData.currentWeek) };
      }

      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`currentWeek_${storageKey}`);

      if (stored) {
        return JSON.parse(stored);
      }

      // Default to week 1
      const defaultWeek = { weekNumber: 1 };
      localStorage.setItem(`currentWeek_${storageKey}`, JSON.stringify(defaultWeek));
      return defaultWeek;
    },
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
      console.log('📚 Starting Monday lesson for week:', weekNumber);

      // Get the curriculum module for this week
      const modules = getAllCurriculumModules();
      const module = modules.find(m => Number(m.weekNumber) === Number(weekNumber));

      if (!module) {
        throw new Error(`No curriculum found for week ${weekNumber}`);
      }

      // Return the Monday lesson content with all required fields
      return {
        weekNumber: Number(module.weekNumber),
        moduleName: module.moduleName,
        weekTopic: module.moduleName, // Map moduleName to weekTopic
        dayType: 'monday',
        title: module.mondayLesson.title,
        teacherScript: module.mondayLesson.teacherScript,
        discussionPrompt: module.mondayLesson.discussionQuestions.join(' '), // Combine questions into prompt
        discussionQuestions: module.mondayLesson.discussionQuestions,
        activities: module.mondayLesson.activities,
        learningObjectives: module.learningObjectives,
        votingOptions: [], // Monday lessons don't have voting options
      };
    },
    onSuccess: (lessonData) => {
      console.log('✅ Monday lesson started, setting active lesson content:', lessonData);
      // Set the active lesson content in the cache
      queryClient.setQueryData(['activeLessonContent'], lessonData);
      // Set display mode to lessonMode
      queryClient.setQueryData(['displayMode'], 'lessonMode');
    },
  });
};

export const useStartFridayLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekNumber: any) => {
      console.log('📚 Starting Friday lesson for week:', weekNumber);

      // Get the curriculum module for this week
      const modules = getAllCurriculumModules();
      const module = modules.find(m => Number(m.weekNumber) === Number(weekNumber));

      if (!module) {
        throw new Error(`No curriculum found for week ${weekNumber}`);
      }

      // Return the Friday lesson content with all required fields
      return {
        weekNumber: Number(module.weekNumber),
        moduleName: module.moduleName,
        weekTopic: module.moduleName, // Map moduleName to weekTopic
        dayType: 'friday',
        title: module.fridayLesson.title,
        teacherScript: module.fridayLesson.teacherScript,
        discussionPrompt: module.fridayLesson.discussionQuestions.join(' '), // Combine questions into prompt
        discussionQuestions: module.fridayLesson.discussionQuestions,
        activities: module.fridayLesson.activities,
        learningObjectives: module.learningObjectives,
        votingOptions: [], // Will be populated separately for voting lessons
      };
    },
    onSuccess: (lessonData) => {
      console.log('✅ Friday lesson started, setting active lesson content:', lessonData);
      // Set the active lesson content in the cache
      queryClient.setQueryData(['activeLessonContent'], lessonData);
      // Set display mode to lessonMode
      queryClient.setQueryData(['displayMode'], 'lessonMode');
    },
  });
};

export const useEndLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      console.log('🎓 Ending lesson and returning to dashboard');
      return { success: true };
    },
    onSuccess: () => {
      console.log('✅ Lesson ended, clearing active lesson content and returning to dashboard');
      // Clear the active lesson content
      queryClient.setQueryData(['activeLessonContent'], null);
      // Set display mode back to dashboard
      queryClient.setQueryData(['displayMode'], 'dashboard');
    },
  });
};

// Lesson Completion Queries
export const useGetLessonCompletions = () => {
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useQuery({
    queryKey: ['lessonCompletions', profile?.id, user?.id],
    queryFn: async () => {
      // Use profile ID if available, otherwise fall back to user ID
      const storageKey = profile?.id || user?.id || 'demo';
      console.log('📚 Loading lesson completions with key:', `lessonCompletions_${storageKey}`);

      // For now, return from localStorage
      // TODO: Replace with Supabase query when backend is ready
      const stored = localStorage.getItem(`lessonCompletions_${storageKey}`);
      const completions = stored ? JSON.parse(stored) : [];
      console.log('📚 Loaded completions:', completions);
      return completions;
    },
    enabled: !!(profile || user || isDemoMode),
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();

  return useMutation({
    mutationFn: async (params: { weekNumber: number; dayType: 'monday' | 'friday'; notes: string }) => {
      // Use profile ID if available, otherwise fall back to user ID
      const storageKey = profile?.id || user?.id || 'demo';
      console.log('✅ Marking lesson as complete with key:', `lessonCompletions_${storageKey}`, params);

      const completion: LessonCompletion = {
        weekNumber: params.weekNumber,
        dayType: params.dayType,
        completedAt: new Date().toISOString(),
        notes: params.notes,
        teacherId: storageKey,
      };

      // For now, store in localStorage
      // TODO: Replace with Supabase mutation when backend is ready
      const stored = localStorage.getItem(`lessonCompletions_${storageKey}`);
      const completions: LessonCompletion[] = stored ? JSON.parse(stored) : [];
      console.log('📚 Current completions before adding:', completions);

      // Remove any existing completion for this lesson
      const filtered = completions.filter(
        c => !(c.weekNumber === params.weekNumber && c.dayType === params.dayType)
      );

      // Add new completion
      filtered.push(completion);
      console.log('📚 Saving updated completions:', filtered);
      localStorage.setItem(`lessonCompletions_${storageKey}`, JSON.stringify(filtered));

      return completion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonCompletions'] });
    },
  });
};

export const useUpdateLessonNotes = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();

  return useMutation({
    mutationFn: async (params: { weekNumber: number; dayType: 'monday' | 'friday'; notes: string }) => {
      // Use profile ID if available, otherwise fall back to user ID
      const storageKey = profile?.id || user?.id || 'demo';
      console.log('📝 Updating lesson notes with key:', `lessonCompletions_${storageKey}`, params);

      // For now, update in localStorage
      // TODO: Replace with Supabase mutation when backend is ready
      const stored = localStorage.getItem(`lessonCompletions_${storageKey}`);
      const completions: LessonCompletion[] = stored ? JSON.parse(stored) : [];

      const completion = completions.find(
        c => c.weekNumber === params.weekNumber && c.dayType === params.dayType
      );

      if (completion) {
        completion.notes = params.notes;
        console.log('📝 Saving updated notes:', completions);
        localStorage.setItem(`lessonCompletions_${storageKey}`, JSON.stringify(completions));
      } else {
        console.warn('⚠️ Completion not found for week', params.weekNumber, params.dayType);
      }

      return completion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonCompletions'] });
    },
  });
};

export const useSkipToWeek = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (weekNumber: any) => {
      if (isDemoMode) {
        console.log('Demo mode - week skip not persisted');
        return { success: true };
      }

      const storageKey = profile?.id || user?.id || 'default';
      const newWeek = { weekNumber: Number(weekNumber) };
      localStorage.setItem(`currentWeek_${storageKey}`, JSON.stringify(newWeek));
      console.log(`✅ Skipped to week ${weekNumber}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
};

export const useRestartCurriculum = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async () => {
      if (isDemoMode) {
        console.log('Demo mode - curriculum restart not persisted');
        return { success: true };
      }

      const storageKey = profile?.id || user?.id || 'default';

      // Reset current week to 1
      const defaultWeek = { weekNumber: 1 };
      localStorage.setItem(`currentWeek_${storageKey}`, JSON.stringify(defaultWeek));

      // Optionally clear lesson completions (uncomment if desired)
      // localStorage.removeItem(`lessonCompletions_${storageKey}`);

      console.log('✅ Curriculum restarted to week 1');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumModules'] });
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
      queryClient.invalidateQueries({ queryKey: ['lessonCompletions'] });
    },
  });
};

export const useGetCurriculumProgress = () => {
  const { profile, user } = useAuth();

  return useQuery({
    queryKey: ['curriculumProgress', profile?.id, user?.id],
    queryFn: async () => {
      const storageKey = profile?.id || user?.id || 'default';

      // Get current week
      const weekStored = localStorage.getItem(`currentWeek_${storageKey}`);
      const currentWeek = weekStored ? JSON.parse(weekStored).weekNumber : 1;

      // Get completed lessons
      const completionsStored = localStorage.getItem(`lessonCompletions_${storageKey}`);
      const completions = completionsStored ? JSON.parse(completionsStored) : [];

      // Count unique completed weeks
      const completedWeeks = new Set(completions.map((c: any) => c.weekNumber)).size;

      return {
        completedWeeks,
        totalWeeks: 36, // Total curriculum weeks
        currentWeek
      };
    },
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
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useQuery({
    queryKey: ['rewardsCatalog', profile?.id, user?.id],
    queryFn: async () => {
      if (isDemoMode) {
        // Return empty for demo mode for now
        return [];
      }

      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`rewards_${storageKey}`);

      if (stored) {
        return JSON.parse(stored);
      }

      // Initialize with some default rewards
      const defaultRewards = [
        { id: '1', name: 'Extra Recess', cost: 100, description: '5 minutes extra recess time', isActive: true },
        { id: '2', name: 'Homework Pass', cost: 150, description: 'Skip one homework assignment', isActive: true },
        { id: '3', name: 'Lunch with Teacher', cost: 200, description: 'Have lunch in the classroom', isActive: true },
      ];

      localStorage.setItem(`rewards_${storageKey}`, JSON.stringify(defaultRewards));
      return defaultRewards;
    },
  });
};

export const useAddReward = () => {
  const queryClient = useQueryClient();
  const { profile, user } = useAuth();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (params: { name: string; cost: bigint | number; description?: string }) => {
      if (isDemoMode) {
        console.log('Demo mode - reward addition not persisted');
        return { success: true };
      }

      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`rewards_${storageKey}`);
      const rewards = stored ? JSON.parse(stored) : [];

      const newReward = {
        id: Date.now().toString(),
        name: params.name,
        cost: typeof params.cost === 'bigint' ? Number(params.cost) : params.cost,
        description: params.description || '',
        isActive: true
      };

      rewards.push(newReward);
      localStorage.setItem(`rewards_${storageKey}`, JSON.stringify(rewards));
      console.log('✅ Added reward:', newReward);

      return { success: true, reward: newReward };
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

// Create Teacher Class Mutation
export const useCreateTeacherClass = () => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({ className, schoolYear }: { className: string; schoolYear: string }) => {
      if (!profile || profile.role !== 'teacher') {
        throw new Error('Only teachers can create classes');
      }

      if (!user) {
        throw new Error('No authenticated user');
      }

      // Generate class code
      const adjectives = ['LIONS', 'TIGERS', 'BEARS', 'EAGLES', 'DRAGONS', 'PANDAS', 'WOLVES'];
      const year = new Date().getFullYear();
      const random = adjectives[Math.floor(Math.random() * adjectives.length)];
      const classCode = `${random}-${year}`;

      console.log('📝 Creating class:', { className, schoolYear, classCode, profileId: profile.id, userId: user.id });

      const { data, error } = await supabase
        .from('classes')
        .insert({
          user_id: user.id,
          teacher_profile_id: profile.id,
          class_name: className,
          class_code: classCode,
          school_year: schoolYear || null
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating class:', error);
        throw error;
      }

      console.log('✅ Class created successfully:', data);
      return { ...data, classCode }; // Include classCode in return for toast message
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherClass'] });
    },
  });
};

// Update Teacher Class Mutation
export const useUpdateTeacherClass = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({ classId, className, schoolYear }: { classId: string; className: string; schoolYear: string }) => {
      if (!profile || profile.role !== 'teacher') {
        throw new Error('Only teachers can update classes');
      }

      console.log('📝 Updating class:', { classId, className, schoolYear });

      const { data, error } = await supabase
        .from('classes')
        .update({
          class_name: className,
          school_year: schoolYear || null
        })
        .eq('id', classId)
        .eq('teacher_profile_id', profile.id) // Ensure teacher owns this class
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating class:', error);
        throw error;
      }

      console.log('✅ Class updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherClass'] });
    },
  });
};

// Student Queries
export const useGetStudents = () => {
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;
  const { data: teacherClass } = useGetTeacherClass();

  return useQuery({
    queryKey: ['students', teacherClass?.id],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.students;
      }

      if (!teacherClass?.id) {
        console.log('❌ No class found - returning empty students list');
        return [];
      }

      console.log('📡 Querying Supabase for students in class:', teacherClass.id);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', teacherClass.id)
        .eq('is_active', true)
        .order('student_name');

      if (error) {
        console.error('⚠️ Error loading students:', error);
        return [];
      }

      console.log('✅ Loaded students from database:', data);

      // Transform to match expected format and convert BigInt to Number
      return (data || []).map(student => ({
        id: student.id,
        name: student.student_name,
        personalBalance: Number(student.personal_balance),
        classContribution: Number(student.class_contribution),
        isActive: student.is_active,
        notes: student.notes || ''
      }));
    },
    enabled: !!teacherClass?.id,
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { isDemoMode } = useDemo();
  const { data: teacherClass } = useGetTeacherClass();

  return useMutation({
    mutationFn: async (params: { name: string; balance?: number }) => {
      if (isDemoMode) {
        console.log('Demo mode - student addition not persisted');
        return { success: true };
      }

      if (!teacherClass?.id) {
        throw new Error('No class found');
      }

      const { data, error } = await supabase
        .from('students')
        .insert({
          class_id: teacherClass.id,
          student_name: params.name,
          personal_balance: params.balance || 0,
          class_contribution: 0,
          is_active: true,
          notes: ''
        })
        .select()
        .single();

      if (error) {
        console.error('⚠️ Error adding student:', error);
        throw error;
      }

      console.log('✅ Added student to database:', data);
      // Convert BigInt to Number
      const studentData = data ? {
        ...data,
        personal_balance: Number(data.personal_balance),
        class_contribution: Number(data.class_contribution)
      } : data;
      return { success: true, student: studentData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

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

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (params: { studentId: string; name?: string; personalBalance?: number; classContribution?: number; notes?: string; isActive?: boolean }) => {
      if (isDemoMode) {
        console.log('Demo mode - student update not persisted');
        return { success: true };
      }

      // Build update object with only provided fields
      const updateData: any = {};
      if (params.name !== undefined) updateData.student_name = params.name;
      if (params.personalBalance !== undefined) updateData.personal_balance = params.personalBalance;
      if (params.classContribution !== undefined) updateData.class_contribution = params.classContribution;
      if (params.notes !== undefined) updateData.notes = params.notes;
      if (params.isActive !== undefined) updateData.is_active = params.isActive;

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', params.studentId)
        .select()
        .single();

      if (error) {
        console.error('⚠️ Error updating student:', error);
        throw error;
      }

      console.log('✅ Updated student in database:', data);
      // Convert BigInt to Number
      const studentData = data ? {
        ...data,
        personal_balance: Number(data.personal_balance),
        class_contribution: Number(data.class_contribution)
      } : data;
      return { success: true, student: studentData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudentNotes = () => {
  const updateStudent = useUpdateStudent();
  return useMutation({
    mutationFn: async (params: { studentId: string; notes: string }) => {
      return updateStudent.mutateAsync({ studentId: params.studentId, notes: params.notes });
    },
    onSuccess: () => {
      // Already handled by useUpdateStudent
    },
  });
};

export const useUpdateStudentStatus = () => {
  const updateStudent = useUpdateStudent();
  return useMutation({
    mutationFn: async (params: { studentId: string; isActive: boolean }) => {
      return updateStudent.mutateAsync({ studentId: params.studentId, isActive: params.isActive });
    },
    onSuccess: () => {
      // Already handled by useUpdateStudent
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { isDemoMode } = useDemo();

  return useMutation({
    mutationFn: async (studentId: string) => {
      if (isDemoMode) {
        console.log('Demo mode - student deletion not persisted');
        return { success: true };
      }

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('⚠️ Error deleting student:', error);
        throw error;
      }

      console.log('✅ Deleted student from database');
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
  const { profile, user } = useAuth();

  return useQuery({
    queryKey: ['weeklyStats', profile?.id, user?.id],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.weeklyStats;
      }

      // For non-demo mode, read from localStorage
      const storageKey = profile?.id || user?.id || 'default';
      const stored = localStorage.getItem(`classFund_${storageKey}`);
      const data = stored ? JSON.parse(stored) : { balance: 0, transactions: [], goals: [] };

      // Return demo-compatible structure with actual balance
      return {
        classFundBalance: BigInt(data.balance || 0),
        studentsContributed: BigInt(18), // TODO: Calculate from actual student data
        totalStudents: BigInt(24), // TODO: Get from actual student list
        totalCubCoinsEarned: BigInt(data.balance || 0) // Use balance as total earned for now
      };
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

// Teacher's Class Query
export const useGetTeacherClass = () => {
  const { profile } = useAuth();
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['teacherClass', profile?.id],
    retry: false, // Don't retry on error, just return placeholder
    throwOnError: false, // Don't throw, return placeholder instead
    queryFn: async () => {
      console.log('🔍 useGetTeacherClass - Starting query', { isDemoMode, hasProfile: !!profile });

      // Return demo data in demo mode
      if (isDemoMode && demoData) {
        console.log('🎭 Returning demo class data');
        return {
          id: 'demo-class-id',
          teacher_profile_id: profile?.id || 'demo-profile-id',
          class_name: 'Demo Class',
          school_year: '2024-2025',
          class_code: 'LIONS-2025',
          created_at: new Date().toISOString()
        };
      }

      if (!profile || profile.role !== 'teacher') {
        console.log('❌ No teacher profile - returning null');
        return null;
      }

      console.log('📡 Querying Supabase for teacher class...');
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_profile_id', profile.id)
        .maybeSingle();

      console.log('📊 Supabase response:', { hasData: !!data, hasError: !!error, data, error });

      // If there's an error OR no data, return null (user should create class via RoleSelection)
      if (error || !data) {
        if (error) {
          console.error('⚠️ Error loading teacher class:', error);
        } else {
          console.log('📭 No class found - user should create one via RoleSelection');
        }
        return null;
      }

      console.log('✅ Returning class data from database:', data);
      return data;
    },
    enabled: !!profile && profile.role === 'teacher',
  });
};

// Parent Enrollment Queries

// Get parent's enrolled children
export const useGetParentChildren = () => {
  const { profile } = useAuth();
  const { isDemoMode } = useDemo();

  return useQuery({
    queryKey: ['parentChildren', profile?.id],
    queryFn: async () => {
      if (isDemoMode) {
        return [
          {
            id: 'demo-enrollment-1',
            parent_profile_id: profile?.id || 'demo-profile-id',
            class_id: 'demo-class-id',
            child_first_name: 'Emma',
            child_last_name: 'Johnson',
            child_dob: '2015-03-15',
            class_name: 'Mrs. Smith\'s Class',
            class_code: 'LIONS-2025',
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-enrollment-2',
            parent_profile_id: profile?.id || 'demo-profile-id',
            class_id: 'demo-class-id-2',
            child_first_name: 'Liam',
            child_last_name: 'Johnson',
            child_dob: '2017-08-22',
            class_name: 'Mr. Davis\'s Class',
            class_code: 'TIGERS-2025',
            created_at: new Date().toISOString()
          }
        ];
      }

      if (!profile || profile.role !== 'parent') {
        return [];
      }

      const { data, error } = await supabase
        .from('parent_class_enrollments')
        .select(`
          *,
          classes:class_id (
            class_name,
            class_code
          )
        `)
        .eq('parent_profile_id', profile.id);

      if (error) {
        console.error('Error loading parent children:', error);
        throw error;
      }

      return data?.map(enrollment => ({
        id: enrollment.id,
        parent_profile_id: enrollment.parent_profile_id,
        class_id: enrollment.class_id,
        child_first_name: enrollment.child_first_name,
        child_last_name: enrollment.child_last_name,
        child_dob: enrollment.child_dob,
        class_name: enrollment.classes?.class_name || 'Unknown Class',
        class_code: enrollment.classes?.class_code || '',
        created_at: enrollment.created_at
      })) || [];
    },
    enabled: !!profile && profile.role === 'parent',
  });
};

// Validate class code
export const useValidateClassCode = () => {
  return useMutation({
    mutationFn: async (classCode: string) => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name, class_code')
        .eq('class_code', classCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error validating class code:', error);
        throw new Error('Failed to validate class code');
      }

      if (!data) {
        throw new Error('Invalid class code');
      }

      return data;
    },
  });
};

// Add child enrollment
export const useAddChildEnrollment = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      classId,
      firstName,
      lastName,
      dateOfBirth
    }: {
      classId: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
    }) => {
      if (!profile || profile.role !== 'parent') {
        throw new Error('Must be logged in as parent');
      }

      const { data, error } = await supabase
        .from('parent_class_enrollments')
        .insert({
          parent_profile_id: profile.id,
          parent_id: profile.user_id,
          class_id: classId,
          child_first_name: firstName,
          child_last_name: lastName,
          child_dob: dateOfBirth,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding child enrollment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentChildren'] });
    },
  });
};

// Update parent profile
// Generic profile update hook - works for both teachers and parents
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { profile, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async ({
      fullName,
      phone
    }: {
      fullName?: string;
      phone?: string;
    }) => {
      if (!profile) {
        throw new Error('Must be logged in');
      }

      const updates: any = {};
      if (fullName !== undefined) updates.full_name = fullName;
      if (phone !== undefined) updates.phone = phone;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .eq('role', profile.role)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Deprecated: Use useUpdateProfile instead
export const useUpdateParentProfile = useUpdateProfile;

// Notification Preferences (stored in profiles table or separate notification_preferences table)
export const useGetNotificationPreferences = () => {
  const { profile } = useAuth();
  const { isDemoMode } = useDemo();

  return useQuery({
    queryKey: ['notificationPreferences', profile?.id],
    queryFn: async () => {
      if (isDemoMode) {
        return {
          email_notifications: true,
          sms_notifications: true,
          achievement_notifications: true,
          form_notifications: true,
        };
      }

      if (!profile) {
        return null;
      }

      // Try to get from profiles table first (if columns exist)
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications, sms_notifications, achievement_notifications, form_notifications')
        .eq('id', profile.id)
        .eq('role', profile.role)
        .maybeSingle();

      if (error) {
        console.error('Error loading notification preferences:', error);
        // Return defaults if error
        return {
          email_notifications: true,
          sms_notifications: true,
          achievement_notifications: true,
          form_notifications: true,
        };
      }

      return data || {
        email_notifications: true,
        sms_notifications: true,
        achievement_notifications: true,
        form_notifications: true,
      };
    },
    enabled: !!profile,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      emailNotifications,
      smsNotifications,
      achievementNotifications,
      formNotifications,
    }: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      achievementNotifications?: boolean;
      formNotifications?: boolean;
    }) => {
      if (!profile) {
        throw new Error('Must be logged in');
      }

      const updates: any = {};
      if (emailNotifications !== undefined) updates.email_notifications = emailNotifications;
      if (smsNotifications !== undefined) updates.sms_notifications = smsNotifications;
      if (achievementNotifications !== undefined) updates.achievement_notifications = achievementNotifications;
      if (formNotifications !== undefined) updates.form_notifications = formNotifications;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .eq('role', profile.role)
        .select()
        .single();

      if (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
};
