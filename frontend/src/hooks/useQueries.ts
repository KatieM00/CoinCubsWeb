import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  UserRole, 
  AwardSplit, 
  ClassFund, 
  VotingProposal, 
  ContributionRecord, 
  ClassGoal,
  ClassAchievement,
  ChatMessage,
  SupportExample,
  Reward,
  BulkOperationLog,
  SemesterResetLog,
  UserApprovalInfo,
  DisplayMode,
  LessonContent,
  CurriculumProgress,
  CurriculumModule,
  QuickAward,
  UndoTransaction,
  ActivityTickerItem,
  VoteOption,
  WeeklyStats
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetClassFund() {
  const { actor, isFetching } = useActor();

  return useQuery<ClassFund>({
    queryKey: ['classFund'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClassFund();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });
}

export function useGetActiveVotingProposals() {
  const { actor, isFetching } = useActor();

  return useQuery<VotingProposal[]>({
    queryKey: ['activeVotingProposals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveVotingProposals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerPersonalBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['callerPersonalBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerPersonalBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerWeeklyContributions() {
  const { actor, isFetching } = useActor();

  return useQuery<ContributionRecord[]>({
    queryKey: ['callerWeeklyContributions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerWeeklyContributions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClassGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<ClassGoal[]>({
    queryKey: ['classGoals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClassGoals();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });
}

export function useGetClassAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<ClassAchievement[]>({
    queryKey: ['classAchievements'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClassAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApprovedChatMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['approvedChatMessages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getApprovedChatMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSupportExamples() {
  const { actor, isFetching } = useActor();

  return useQuery<SupportExample[]>({
    queryKey: ['supportExamples'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSupportExamples();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRewardsCatalog() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['rewardsCatalog'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewardsCatalog();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBulkOperationLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<BulkOperationLog[]>({
    queryKey: ['bulkOperationLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBulkOperationLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSemesterResetLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<SemesterResetLog[]>({
    queryKey: ['semesterResetLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSemesterResetLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDisplayMode() {
  const { actor, isFetching } = useActor();

  return useQuery<DisplayMode>({
    queryKey: ['displayMode'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDisplayMode();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });
}

export function useGetActiveLessonContent() {
  const { actor, isFetching } = useActor();

  return useQuery<LessonContent | null>({
    queryKey: ['activeLessonContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveLessonContent();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });
}

export function useGetActivityTicker() {
  const { actor, isFetching } = useActor();

  return useQuery<ActivityTickerItem[]>({
    queryKey: ['activityTicker'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActivityTicker();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1000,
  });
}

export function useGetCurriculumProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<CurriculumProgress>({
    queryKey: ['curriculumProgress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurriculumProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurriculumModules() {
  const { actor, isFetching } = useActor();

  return useQuery<CurriculumModule[]>({
    queryKey: ['curriculumModules'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurriculumModules();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentWeek() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['currentWeek'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentWeek();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLastAwardedStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<QuickAward[]>({
    queryKey: ['lastAwardedStudents'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLastAwardedStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUndoTransaction() {
  const { actor, isFetching } = useActor();

  return useQuery<UndoTransaction | null>({
    queryKey: ['undoTransaction'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUndoTransaction();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1000,
  });
}

export function useGetWeeklyStats() {
  const { actor, isFetching } = useActor();

  return useQuery<WeeklyStats>({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWeeklyStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetPresetAmounts() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['presetAmounts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPresetAmounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePresetAmounts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAmounts: bigint[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePresetAmounts(newAmounts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetAmounts'] });
    },
  });
}

export function useGetPresetReasons() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['presetReasons'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPresetReasons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomReason() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reason: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCustomReason(reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
}

export function useUpdateReason() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, newReason }: { index: bigint; newReason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReason(index, newReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
}

export function useDeleteReason() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReason(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presetReasons'] });
    },
  });
}

export function useInitializeCurriculum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeCurriculum();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumProgress'] });
      queryClient.invalidateQueries({ queryKey: ['curriculumModules'] });
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
}

export function useStartMondayLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekNumber: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startMondayLesson(weekNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
      queryClient.invalidateQueries({ queryKey: ['displayMode'] });
      queryClient.invalidateQueries({ queryKey: ['curriculumProgress'] });
    },
  });
}

export function useStartFridayLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekNumber: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startFridayLesson(weekNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
      queryClient.invalidateQueries({ queryKey: ['displayMode'] });
      queryClient.invalidateQueries({ queryKey: ['curriculumProgress'] });
    },
  });
}

export function useSkipToWeek() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekNumber: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.skipToWeek(weekNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumProgress'] });
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
}

export function useRestartCurriculum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.restartCurriculum();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumProgress'] });
      queryClient.invalidateQueries({ queryKey: ['curriculumModules'] });
      queryClient.invalidateQueries({ queryKey: ['currentWeek'] });
    },
  });
}

export function useSetDisplayMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mode: DisplayMode) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDisplayMode(mode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayMode'] });
    },
  });
}

export function useSetActiveLessonContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: LessonContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setActiveLessonContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
    },
  });
}

export function useClearActiveLessonContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearActiveLessonContent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLessonContent'] });
    },
  });
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useAwardClassGems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      amount,
      splitType,
      description,
    }: {
      studentId: bigint;
      amount: bigint;
      splitType: AwardSplit;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.awardCubCoins(studentId, amount, splitType, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
      queryClient.invalidateQueries({ queryKey: ['callerPersonalBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyContributions'] });
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
      queryClient.invalidateQueries({ queryKey: ['lastAwardedStudents'] });
      queryClient.invalidateQueries({ queryKey: ['undoTransaction'] });
      queryClient.invalidateQueries({ queryKey: ['activityTicker'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStats'] });
    },
  });
}

export function useUndoLastAward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.undoLastAward();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
      queryClient.invalidateQueries({ queryKey: ['callerPersonalBalance'] });
      queryClient.invalidateQueries({ queryKey: ['callerWeeklyContributions'] });
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
      queryClient.invalidateQueries({ queryKey: ['undoTransaction'] });
      queryClient.invalidateQueries({ queryKey: ['activityTicker'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStats'] });
    },
  });
}

export function useCreateVotingProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      amountRequested,
      prosCons,
      options,
    }: {
      title: string;
      description: string;
      amountRequested: bigint;
      prosCons: string;
      options: VoteOption[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVotingProposal(title, description, amountRequested, prosCons, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
}

export function useUpdateVoteCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, optionName, voteCount }: { proposalId: bigint; optionName: string; voteCount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVoteCount(proposalId, optionName, voteCount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
}

export function useValidateVoteTotals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateVoteTotals(proposalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
}

export function useCreateClassGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, targetAmount, description }: { name: string; targetAmount: bigint; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClassGoal(name, targetAmount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
      queryClient.invalidateQueries({ queryKey: ['classFund'] });
    },
  });
}

export function useFinalizeVote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.finalizeVote(proposalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
      queryClient.invalidateQueries({ queryKey: ['activityTicker'] });
    },
  });
}

export function useAddProposalComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, content }: { proposalId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProposalComment(proposalId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVotingProposals'] });
    },
  });
}

export function useAddGoalComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, content }: { goalId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGoalComment(goalId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classGoals'] });
    },
  });
}

export function useAddClassAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, icon }: { name: string; description: string; icon: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addClassAchievement(name, description, icon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classAchievements'] });
    },
  });
}

export function usePostChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postChatMessage(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedChatMessages'] });
    },
  });
}

export function useApproveChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveChatMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedChatMessages'] });
    },
  });
}

export function useAddSupportExample() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (description: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSupportExample(description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportExamples'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateStudentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, isActive }: { studentId: Principal; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Update student status:', studentId.toString(), isActive);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useUpdateStudentNotes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, notes }: { studentId: Principal; notes: string }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('Update student notes:', studentId.toString(), notes);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useAddReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, cost, description }: { name: string; cost: bigint; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReward(name, cost, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
}

export function useUpdateRewardPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardId, newCost }: { rewardId: bigint; newCost: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRewardPrice(rewardId, newCost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
}

export function useBulkUpdateRewardPrices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ percentageChange, isIncrease }: { percentageChange: bigint; isIncrease: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUpdateRewardPrices(percentageChange, isIncrease);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsCatalog'] });
    },
  });
}

export function useAddBulkOperationLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ operationType, details }: { operationType: string; details: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBulkOperationLog(operationType, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulkOperationLogs'] });
    },
  });
}

export function useAddSemesterResetLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resetType, details }: { resetType: string; details: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSemesterResetLog(resetType, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesterResetLogs'] });
    },
  });
}
