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
      console.log('📚 Starting Monday lesson for week:', weekNumber);

      // Get the curriculum module for this week
      const modules = getAllCurriculumModules();
      const module = modules.find(m => Number(m.weekNumber) === Number(weekNumber));

      if (!module) {
        throw new Error(`No curriculum found for week ${weekNumber}`);
      }

      // Return the Monday lesson content with all required fields
      return {
        weekNumber: module.weekNumber,
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
        weekNumber: module.weekNumber,
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
    queryFn: async () => ({ completedWeeks: 0, totalWeeks: 36, currentWeek: 1 }),
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

// Teacher's Class Query
export const useGetTeacherClass = () => {
  const { user } = useAuth();
  const { isDemoMode } = useDemo();
  const demoData = isDemoMode ? useDemoData() : null;

  return useQuery({
    queryKey: ['teacherClass', user?.id],
    retry: false, // Don't retry on error, just return placeholder
    throwOnError: false, // Don't throw, return placeholder instead
    queryFn: async () => {
      console.log('🔍 useGetTeacherClass - Starting query', { isDemoMode, hasUser: !!user });

      // Return demo data in demo mode
      if (isDemoMode && demoData) {
        console.log('🎭 Returning demo class data');
        return {
          id: 'demo-class-id',
          teacher_id: user?.id || 'demo-user-id',
          class_name: 'Demo Class',
          school_year: '2024-2025',
          class_code: 'LIONS-2025',
          created_at: new Date().toISOString()
        };
      }

      if (!user) {
        console.log('❌ No user - returning null');
        return null;
      }

      console.log('📡 Querying Supabase for teacher class...');
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id)
        .maybeSingle();

      console.log('📊 Supabase response:', { hasData: !!data, hasError: !!error, data, error });

      // If there's an error OR no data, create a real class in the database
      if (error || !data) {
        if (error) {
          console.error('⚠️ Error loading teacher class (will create new class):', error);
        } else {
          console.log('📭 No class found - creating new class in database');
        }

        // Generate a consistent class code based on user ID
        const animals = ['LIONS', 'TIGERS', 'BEARS', 'EAGLES', 'SHARKS', 'WOLVES', 'PANDAS', 'DRAGONS'];
        // Use user ID to pick a consistent animal (same user = same animal)
        const userIdHash = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const animalIndex = userIdHash % animals.length;
        const selectedAnimal = animals[animalIndex];
        const currentYear = new Date().getFullYear();
        const classCode = `${selectedAnimal}-${currentYear}`;

        console.log('✨ Creating class with code:', classCode);

        // Try to insert the class into the database
        const { data: newClass, error: insertError } = await supabase
          .from('classes')
          .insert({
            teacher_id: user.id,
            class_name: 'My Class',
            school_year: `${currentYear}-${currentYear + 1}`,
            class_code: classCode
          })
          .select()
          .single();

        if (insertError) {
          console.error('⚠️ Failed to create class in database:', insertError);
          // Return placeholder if insert fails
          return {
            id: 'placeholder',
            teacher_id: user.id,
            class_name: 'My Class',
            school_year: `${currentYear}-${currentYear + 1}`,
            class_code: classCode,
            created_at: new Date().toISOString()
          };
        }

        console.log('✅ Class created successfully:', newClass);
        return newClass;
      }

      console.log('✅ Returning class data from database:', data);
      return data;
    },
    enabled: !!user,
  });
};
