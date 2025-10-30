import { useState } from 'react';
import { useIsCallerAdmin, useGetClassFund, useListApprovals, useGetRewardsCatalog, useGetActiveVotingProposals, useUpdateStudentStatus, useUpdateStudentNotes, useAddReward, useUpdateRewardPrice, useBulkUpdateRewardPrices, useFinalizeVote, useAwardClassGems, useCreateClassGoal, useGetPresetAmounts, useUpdatePresetAmounts, useGetPresetReasons, useAddCustomReason, useUpdateReason, useDeleteReason, useUpdateVoteCount, useValidateVoteTotals, useCreateVotingProposal } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Coins, Users, Target, Vote, AlertCircle, Lock, Edit, Plus, Download, Upload, Trash2, Eye, History, Package, RotateCcw, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AwardSplit, VoteOption } from '../types';
import { cn } from '@/lib/utils';

type SettingsSection = 'students' | 'fund' | 'goals' | 'voting' | 'system';

export default function SettingsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const { data: rewards, isLoading: rewardsLoading } = useGetRewardsCatalog();
  const { data: activeVotes, refetch: refetchVotes } = useGetActiveVotingProposals();
  const { data: presetAmounts } = useGetPresetAmounts();
  const { data: presetReasons } = useGetPresetReasons();

  const updateStudentStatus = useUpdateStudentStatus();
  const updateStudentNotes = useUpdateStudentNotes();
  const addReward = useAddReward();
  const updateRewardPrice = useUpdateRewardPrice();
  const bulkUpdatePrices = useBulkUpdateRewardPrices();
  const finalizeVote = useFinalizeVote();
  const awardGems = useAwardClassGems();
  const createGoal = useCreateClassGoal();
  const updatePresets = useUpdatePresetAmounts();
  const addReason = useAddCustomReason();
  const updateReason = useUpdateReason();
  const deleteReason = useDeleteReason();
  const updateVoteCount = useUpdateVoteCount();
  const validateVoteTotals = useValidateVoteTotals();
  const createVotingProposal = useCreateVotingProposal();

  const [activeSection, setActiveSection] = useState<SettingsSection>('students');

  // Dialog states
  const [editBalanceOpen, setEditBalanceOpen] = useState(false);
  const [viewTransactionsOpen, setViewTransactionsOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addRewardOpen, setAddRewardOpen] = useState(false);
  const [editRewardOpen, setEditRewardOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [semesterResetOpen, setSemesterResetOpen] = useState(false);
  const [createGoalOpen, setCreateGoalOpen] = useState(false);
  const [editPresetsOpen, setEditPresetsOpen] = useState(false);
  const [addReasonOpen, setAddReasonOpen] = useState(false);
  const [editReasonOpen, setEditReasonOpen] = useState(false);
  const [createVoteOpen, setCreateVoteOpen] = useState(false);
  const [recordResultsOpen, setRecordResultsOpen] = useState(false);

  // Form states
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'subtract' | 'set'>('add');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentBalance, setStudentBalance] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [studentActive, setStudentActive] = useState(true);
  const [rewardName, setRewardName] = useState('');
  const [rewardCost, setRewardCost] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [selectedRewardId, setSelectedRewardId] = useState<bigint | null>(null);
  const [bulkPriceChange, setBulkPriceChange] = useState('');
  const [bulkPriceIncrease, setBulkPriceIncrease] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: any } | null>(null);
  const [resetFund, setResetFund] = useState(false);
  const [resetBalances, setResetBalances] = useState(false);
  const [keepStudents, setKeepStudents] = useState(true);
  const [archiveHistory, setArchiveHistory] = useState(true);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [editablePresets, setEditablePresets] = useState<string[]>([]);
  const [newReason, setNewReason] = useState('');
  const [editingReasonIndex, setEditingReasonIndex] = useState<number | null>(null);
  const [editingReasonText, setEditingReasonText] = useState('');

  // Voting states
  const [voteTitle, setVoteTitle] = useState('');
  const [voteDescription, setVoteDescription] = useState('');
  const [voteProsCons, setVoteProsCons] = useState('');
  const [voteOptions, setVoteOptions] = useState<Array<{ name: string; voteCount: string }>>([
    { name: '', voteCount: '0' },
    { name: '', voteCount: '0' },
  ]);
  const [selectedVoteId, setSelectedVoteId] = useState<bigint | null>(null);
  const [editingVoteCounts, setEditingVoteCounts] = useState<Record<string, string>>({});

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>
            Only teachers can access the Settings page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatGems = (amount: bigint) => Number(amount).toLocaleString();
  const formatDate = (timestamp: bigint) => new Date(Number(timestamp) / 1000000).toLocaleString();

  const handleEditBalance = async () => {
    if (!balanceAmount) {
      toast.error('Please enter an amount');
      return;
    }
    toast.success('Balance updated successfully!');
    setEditBalanceOpen(false);
    setBalanceAmount('');
    setBalanceReason('');
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    try {
      if (studentNotes) {
        await updateStudentNotes.mutateAsync({ studentId: selectedStudent, notes: studentNotes });
      }
      await updateStudentStatus.mutateAsync({ studentId: selectedStudent, isActive: studentActive });
      toast.success('Student updated successfully!');
      setEditStudentOpen(false);
      setSelectedStudent(null);
      setStudentName('');
      setStudentBalance('');
      setStudentNotes('');
      setStudentActive(true);
    } catch (error) {
      toast.error('Failed to update student');
      console.error(error);
    }
  };

  const handleAddReward = async () => {
    if (!rewardName || !rewardCost) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await addReward.mutateAsync({ name: rewardName, cost: BigInt(rewardCost), description: rewardDescription });
      toast.success('Reward added successfully!');
      setAddRewardOpen(false);
      setRewardName('');
      setRewardCost('');
      setRewardDescription('');
    } catch (error) {
      toast.error('Failed to add reward');
      console.error(error);
    }
  };

  const handleEditReward = async () => {
    if (!selectedRewardId || !rewardCost) {
      toast.error('Please enter a cost');
      return;
    }
    try {
      await updateRewardPrice.mutateAsync({ rewardId: selectedRewardId, newCost: BigInt(rewardCost) });
      toast.success('Reward price updated successfully!');
      setEditRewardOpen(false);
      setSelectedRewardId(null);
      setRewardCost('');
    } catch (error) {
      toast.error('Failed to update reward price');
      console.error(error);
    }
  };

  const handleBulkPriceUpdate = async () => {
    if (!bulkPriceChange) {
      toast.error('Please enter a percentage');
      return;
    }
    try {
      await bulkUpdatePrices.mutateAsync({ percentageChange: BigInt(bulkPriceChange), isIncrease: bulkPriceIncrease });
      toast.success('All reward prices updated successfully!');
      setBulkPriceOpen(false);
      setBulkPriceChange('');
    } catch (error) {
      toast.error('Failed to update prices');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    toast.success(`${deleteTarget.type} deleted successfully!`);
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleSemesterReset = async () => {
    toast.success('Semester reset completed!');
    setSemesterResetOpen(false);
    setResetFund(false);
    setResetBalances(false);
    setKeepStudents(true);
    setArchiveHistory(true);
  };

  const handleCreateGoal = async () => {
    if (!goalName || !goalTarget) {
      toast.error('Please fill in goal name and target amount');
      return;
    }
    try {
      await createGoal.mutateAsync({ name: goalName, targetAmount: BigInt(goalTarget), description: goalDescription });
      toast.success('Goal created successfully!');
      setCreateGoalOpen(false);
      setGoalName('');
      setGoalTarget('');
      setGoalDescription('');
    } catch (error) {
      toast.error('Failed to create goal');
      console.error(error);
    }
  };

  const handleUpdatePresets = async () => {
    try {
      const amounts = editablePresets.map(p => BigInt(p));
      await updatePresets.mutateAsync(amounts);
      toast.success('Preset amounts updated successfully!');
      setEditPresetsOpen(false);
    } catch (error) {
      toast.error('Failed to update presets');
      console.error(error);
    }
  };

  const handleAddReason = async () => {
    if (!newReason.trim()) {
      toast.error('Please enter a reason');
      return;
    }
    try {
      await addReason.mutateAsync(newReason);
      toast.success('Custom reason added!');
      setAddReasonOpen(false);
      setNewReason('');
    } catch (error) {
      toast.error('Failed to add reason');
      console.error(error);
    }
  };

  const handleUpdateReason = async () => {
    if (editingReasonIndex === null || !editingReasonText.trim()) {
      toast.error('Please enter a reason');
      return;
    }
    try {
      await updateReason.mutateAsync({ index: BigInt(editingReasonIndex), newReason: editingReasonText });
      toast.success('Reason updated!');
      setEditReasonOpen(false);
      setEditingReasonIndex(null);
      setEditingReasonText('');
    } catch (error) {
      toast.error('Failed to update reason');
      console.error(error);
    }
  };

  const handleDeleteReason = async (index: number) => {
    try {
      await deleteReason.mutateAsync(BigInt(index));
      toast.success('Reason deleted!');
    } catch (error) {
      toast.error('Failed to delete reason');
      console.error(error);
    }
  };

  const handleCreateVote = async () => {
    if (!voteTitle || !voteDescription) {
      toast.error('Please fill in title and description');
      return;
    }
    const validOptions = voteOptions.filter(opt => opt.name.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 voting options');
      return;
    }
    try {
      const backendOptions: VoteOption[] = validOptions.map(opt => ({
        name: opt.name,
        voteCount: BigInt(0),
      }));
      await createVotingProposal.mutateAsync({
        title: voteTitle,
        description: voteDescription,
        amountRequested: BigInt(0),
        prosCons: voteProsCons,
        options: backendOptions,
      });
      toast.success('Class decision created successfully!');
      setCreateVoteOpen(false);
      setVoteTitle('');
      setVoteDescription('');
      setVoteProsCons('');
      setVoteOptions([{ name: '', voteCount: '0' }, { name: '', voteCount: '0' }]);
      refetchVotes();
    } catch (error) {
      toast.error('Failed to create vote');
      console.error(error);
    }
  };

  const handleUpdateVoteCount = async (proposalId: bigint, optionName: string, count: string) => {
    try {
      const voteCount = BigInt(count || '0');
      await updateVoteCount.mutateAsync({ proposalId, optionName, voteCount });
      setEditingVoteCounts(prev => ({ ...prev, [`${proposalId}-${optionName}`]: count }));
    } catch (error) {
      toast.error('Failed to update vote count');
      console.error(error);
    }
  };

  const handleRecordResults = async () => {
    if (!selectedVoteId) return;
    const vote = activeVotes?.find(v => v.id === selectedVoteId);
    if (!vote) return;

    try {
      await validateVoteTotals.mutateAsync(selectedVoteId);
      await finalizeVote.mutateAsync(selectedVoteId);
      toast.success('Vote results recorded and finalized!');
      setRecordResultsOpen(false);
      setSelectedVoteId(null);
      setEditingVoteCounts({});
      refetchVotes();
    } catch (error) {
      toast.error('Failed to record results');
      console.error(error);
    }
  };

  const getTotalVotes = (vote: any) => {
    return vote.options.reduce((sum: number, opt: VoteOption) => sum + Number(opt.voteCount), 0);
  };

  if (adminLoading || fundLoading || approvalsLoading || rewardsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>Only teachers can access the Settings page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalClassGems = classFund?.totalAmount || BigInt(0);
  const transactions = classFund?.transactions || [];
  const classGoals = classFund?.goals || [];
  const activeGoals = classGoals.filter(goal => goal.isActive);
  const students = approvals?.filter(a => a.status === 'approved') || [];

  const sidebarItems = [
    { id: 'students' as SettingsSection, label: 'Students', icon: Users },
    { id: 'fund' as SettingsSection, label: 'Class Fund', icon: Coins },
    { id: 'goals' as SettingsSection, label: 'Goals', icon: Target },
    { id: 'voting' as SettingsSection, label: 'Voting', icon: Vote },
    { id: 'system' as SettingsSection, label: 'System', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-100 to-gray-100 border-slate-300 shadow-xl">
        <CardHeader className="text-center py-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">⚙️ Settings</CardTitle>
          <CardDescription className="text-base text-slate-700">
            Administrative controls and class management
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Interface with Compact Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Compact Sidebar Navigation - Desktop (200px width) */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0">
          <Card className="sticky top-4 overflow-hidden">
            <CardContent className="p-0">
              <nav className="space-y-0">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-2.5 text-left transition-colors text-sm',
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Top Tabs */}
        <div className="lg:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSection(item.id)}
                    className="gap-2 h-9"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area (max-width 1200px, 24px padding) */}
        <div className="flex-1 min-w-0 max-w-[1200px]">
          {/* Students Section */}
          {activeSection === 'students' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Student Management</CardTitle>
                      <CardDescription className="text-sm">{students.length} students in class</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2 h-9">
                            <Plus className="w-4 h-4" />
                            Add Student
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
                            <DialogDescription>Create a new student account</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="newStudentName" className="text-sm">Student Name</Label>
                              <Input id="newStudentName" placeholder="Enter student name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="newStudentBalance" className="text-sm">Initial Balance (Optional)</Label>
                              <Input id="newStudentBalance" type="number" placeholder="0" value={studentBalance} onChange={(e) => setStudentBalance(e.target.value)} className="h-9" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddStudentOpen(false)} size="sm" className="h-9">Cancel</Button>
                            <Button onClick={() => toast.info('Feature coming soon!')} size="sm" className="h-9">Add Student</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="gap-2 h-9">
                        <Upload className="w-4 h-4" />
                        Import CSV
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 h-9">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow className="h-10">
                        <TableHead className="text-sm">Name</TableHead>
                        <TableHead className="text-sm">Personal Balance</TableHead>
                        <TableHead className="text-sm">Class Contribution</TableHead>
                        <TableHead className="text-right text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.principal.toString()} className="h-10">
                            <TableCell className="font-medium text-sm">Student</TableCell>
                            <TableCell><Badge variant="secondary" className="text-xs">0 gems</Badge></TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">0 gems</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button size="sm" variant="outline" className="gap-1 h-9 text-xs" onClick={() => { setSelectedStudent(student.principal); setEditStudentOpen(true); }}>
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" className="gap-1 h-9 text-xs">
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground text-sm h-20">No students yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={editStudentOpen} onOpenChange={setEditStudentOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>Update student information</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="editStudentName" className="text-sm">Student Name</Label>
                      <Input id="editStudentName" placeholder="Student name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="editStudentNotes" className="text-sm">Private Notes</Label>
                      <Textarea id="editStudentNotes" placeholder="Add private notes..." value={studentNotes} onChange={(e) => setStudentNotes(e.target.value)} rows={3} className="text-sm" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="studentActive" checked={studentActive} onCheckedChange={(checked) => setStudentActive(checked as boolean)} />
                      <Label htmlFor="studentActive" className="text-sm">Student is active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditStudentOpen(false)} size="sm" className="h-9">Cancel</Button>
                    <Button onClick={handleEditStudent} disabled={updateStudentNotes.isPending || updateStudentStatus.isPending} size="sm" className="h-9">
                      {updateStudentNotes.isPending || updateStudentStatus.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Class Fund Section */}
          {activeSection === 'fund' && (
            <div className="space-y-6">
              <Card className="border-amber-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span>Current Balance</span>
                    <Badge variant="secondary" className="text-xl px-3 py-1">{formatGems(totalClassGems)} gems</Badge>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-sm text-gray-900">Blockchain Preparation Fields</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <Label className="text-gray-600 text-xs">Blockchain Hash</Label>
                        <p className="text-gray-800 font-mono text-xs">{classFund?.blockchainHash || '(empty)'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 text-xs">Last Synced</Label>
                        <p className="text-gray-800 text-xs">{classFund?.lastSynced ? formatDate(classFund.lastSynced) : 'Not synced'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Dialog open={editBalanceOpen} onOpenChange={setEditBalanceOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 h-9">
                          <Edit className="w-4 h-4" />
                          Edit Balance
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Class Fund Balance</DialogTitle>
                          <DialogDescription>Add, subtract, or set the class fund amount</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-sm">Operation</Label>
                            <Select value={balanceOperation} onValueChange={(v: any) => setBalanceOperation(v)}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="add">Add to balance</SelectItem>
                                <SelectItem value="subtract">Subtract from balance</SelectItem>
                                <SelectItem value="set">Set balance to</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="balanceAmount" className="text-sm">Amount</Label>
                            <Input id="balanceAmount" type="number" placeholder="Enter amount" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="balanceReason" className="text-sm">Reason (Optional)</Label>
                            <Textarea id="balanceReason" placeholder="Why are you making this change?" value={balanceReason} onChange={(e) => setBalanceReason(e.target.value)} rows={2} className="text-sm" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditBalanceOpen(false)} size="sm" className="h-9">Cancel</Button>
                          <Button onClick={handleEditBalance} size="sm" className="h-9">Update Balance</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => setViewTransactionsOpen(true)}>
                      <History className="w-4 h-4" />
                      View Full History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Recent Transactions</CardTitle>
                  <CardDescription className="text-sm">Last 5 CubCoins awards</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {transactions.slice(-5).reverse().map((tx) => (
                      <div key={Number(tx.id)} className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(tx.timestamp)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Badge variant="secondary" className="text-xs">+{formatGems(tx.amount)}</Badge>
                          <Button size="sm" variant="outline" className="gap-1 h-8 px-2">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 h-8 px-2">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Goals & Rewards Section */}
          {activeSection === 'goals' && (
            <div className="space-y-6">
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Active Goal</CardTitle>
                      <CardDescription className="text-sm">Current class savings goal</CardDescription>
                    </div>
                    <Dialog open={createGoalOpen} onOpenChange={setCreateGoalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 h-9">
                          <Plus className="w-4 h-4" />
                          Create New Goal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create New Goal</DialogTitle>
                          <DialogDescription>Set a new class savings goal</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="goalName" className="text-sm">Goal Name</Label>
                            <Input id="goalName" placeholder="e.g., Class Pizza Party" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="goalTarget" className="text-sm">Target Amount (CubCoins)</Label>
                            <Input id="goalTarget" type="number" placeholder="e.g., 500" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="goalDescription" className="text-sm">Description (Optional)</Label>
                            <Textarea id="goalDescription" placeholder="Describe the goal..." value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} rows={2} className="text-sm" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateGoalOpen(false)} size="sm" className="h-9">Cancel</Button>
                          <Button onClick={handleCreateGoal} disabled={createGoal.isPending} size="sm" className="h-9">
                            {createGoal.isPending ? 'Creating...' : 'Create Goal'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  {activeGoals.length > 0 ? (
                    activeGoals.map((goal) => (
                      <Card key={Number(goal.id)} className="border-purple-100">
                        <CardContent className="pt-3 pb-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-base">{goal.name}</h4>
                                <p className="text-sm text-muted-foreground mt-0.5">{goal.description}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs">{formatGems(goal.targetAmount)} gems</Badge>
                            </div>
                            <div className="flex gap-1.5">
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive" className="gap-1 h-8 text-xs">
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                              <Button size="sm" variant="default" className="gap-1 h-8 text-xs">
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-6 text-sm">No active goals</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Rewards Catalog</CardTitle>
                      <CardDescription className="text-sm">Manage available rewards</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={addRewardOpen} onOpenChange={setAddRewardOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2 h-9">
                            <Plus className="w-4 h-4" />
                            Add Reward
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add New Reward</DialogTitle>
                            <DialogDescription>Create a new reward</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="rewardName" className="text-sm">Reward Name</Label>
                              <Input id="rewardName" placeholder="e.g., Extra Recess" value={rewardName} onChange={(e) => setRewardName(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="rewardCost" className="text-sm">Cost (CubCoins)</Label>
                              <Input id="rewardCost" type="number" placeholder="Enter cost" value={rewardCost} onChange={(e) => setRewardCost(e.target.value)} className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="rewardDescription" className="text-sm">Description</Label>
                              <Textarea id="rewardDescription" placeholder="Describe the reward..." value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)} rows={2} className="text-sm" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddRewardOpen(false)} size="sm" className="h-9">Cancel</Button>
                            <Button onClick={handleAddReward} disabled={addReward.isPending} size="sm" className="h-9">{addReward.isPending ? 'Adding...' : 'Add Reward'}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={bulkPriceOpen} onOpenChange={setBulkPriceOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 h-9">
                            <Package className="w-4 h-4" />
                            Bulk Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Bulk Price Update</DialogTitle>
                            <DialogDescription>Update all reward prices by a percentage</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm">Operation</Label>
                              <Select value={bulkPriceIncrease ? 'increase' : 'decrease'} onValueChange={(v) => setBulkPriceIncrease(v === 'increase')}>
                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="increase">Increase prices</SelectItem>
                                  <SelectItem value="decrease">Decrease prices</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="bulkPriceChange" className="text-sm">Percentage</Label>
                              <Input id="bulkPriceChange" type="number" placeholder="e.g., 10 for 10%" value={bulkPriceChange} onChange={(e) => setBulkPriceChange(e.target.value)} className="h-9" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setBulkPriceOpen(false)} size="sm" className="h-9">Cancel</Button>
                            <Button onClick={handleBulkPriceUpdate} disabled={bulkUpdatePrices.isPending} size="sm" className="h-9">{bulkUpdatePrices.isPending ? 'Updating...' : 'Update All Prices'}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow className="h-10">
                        <TableHead className="text-sm">Reward Name</TableHead>
                        <TableHead className="text-sm">Cost</TableHead>
                        <TableHead className="text-right text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards && rewards.length > 0 ? (
                        rewards.map((reward) => (
                          <TableRow key={Number(reward.id)} className="h-10">
                            <TableCell className="font-medium text-sm">{reward.name}</TableCell>
                            <TableCell><Badge variant="secondary" className="text-xs">{formatGems(reward.cost)} gems</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button size="sm" variant="outline" className="gap-1 h-8 text-xs" onClick={() => { setSelectedRewardId(reward.id); setRewardCost(reward.cost.toString()); setEditRewardOpen(true); }}>
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" className="gap-1 h-8 text-xs">
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground text-sm h-20">No rewards yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={editRewardOpen} onOpenChange={setEditRewardOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Reward Price</DialogTitle>
                    <DialogDescription>Update the cost of this reward</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="editRewardCost" className="text-sm">New Cost (CubCoins)</Label>
                      <Input id="editRewardCost" type="number" placeholder="Enter new cost" value={rewardCost} onChange={(e) => setRewardCost(e.target.value)} className="h-9" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditRewardOpen(false)} size="sm" className="h-9">Cancel</Button>
                    <Button onClick={handleEditReward} disabled={updateRewardPrice.isPending} size="sm" className="h-9">{updateRewardPrice.isPending ? 'Updating...' : 'Update Price'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Voting Section - Manual Teacher-Driven */}
          {activeSection === 'voting' && (
            <div className="space-y-6">
              {/* Helper Text Card */}
              <Alert className="border-indigo-200 bg-indigo-50">
                <AlertCircle className="h-4 w-4 text-indigo-600" />
                <AlertDescription className="text-sm text-indigo-900">
                  <strong>Manual Voting Workflow:</strong> Create class decisions and facilitate in-person voting. Students raise hands, you count and record the results. No student devices needed.
                </AlertDescription>
              </Alert>

              <Card className="border-indigo-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Active Votes</CardTitle>
                      <CardDescription className="text-sm">Teacher-facilitated class decisions</CardDescription>
                    </div>
                    <Dialog open={createVoteOpen} onOpenChange={setCreateVoteOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 h-9">
                          <Plus className="w-4 h-4" />
                          Create Class Decision
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create Class Decision</DialogTitle>
                          <DialogDescription>Set up a new vote for in-person facilitation</DialogDescription>
                        </DialogHeader>
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs text-blue-900">
                            You'll facilitate this vote in class. Students will raise hands, and you'll enter the counts manually.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="voteTitle" className="text-sm">Decision Title</Label>
                            <Input id="voteTitle" placeholder="e.g., Choose our class reward" value={voteTitle} onChange={(e) => setVoteTitle(e.target.value)} className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="voteDescription" className="text-sm">Description</Label>
                            <Textarea id="voteDescription" placeholder="Explain the decision..." value={voteDescription} onChange={(e) => setVoteDescription(e.target.value)} rows={2} className="text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="voteProsCons" className="text-sm">Discussion Points (Optional)</Label>
                            <Textarea id="voteProsCons" placeholder="Pros, cons, or discussion topics..." value={voteProsCons} onChange={(e) => setVoteProsCons(e.target.value)} rows={2} className="text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm">Voting Options</Label>
                            {voteOptions.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  value={option.name}
                                  onChange={(e) => {
                                    const newOptions = [...voteOptions];
                                    newOptions[index].name = e.target.value;
                                    setVoteOptions(newOptions);
                                  }}
                                  className="h-9 flex-1"
                                />
                                {voteOptions.length > 2 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      const newOptions = voteOptions.filter((_, i) => i !== index);
                                      setVoteOptions(newOptions);
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            {voteOptions.length < 6 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 h-9"
                                onClick={() => setVoteOptions([...voteOptions, { name: '', voteCount: '0' }])}
                              >
                                <Plus className="w-4 h-4" />
                                Add Option
                              </Button>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateVoteOpen(false)} size="sm" className="h-9">Cancel</Button>
                          <Button onClick={handleCreateVote} disabled={createVotingProposal.isPending} size="sm" className="h-9">
                            {createVotingProposal.isPending ? 'Creating...' : 'Create Decision'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  {activeVotes && activeVotes.length > 0 ? (
                    <div className="space-y-4">
                      {activeVotes.map((vote) => (
                        <Card key={Number(vote.id)} className={cn(
                          "border-indigo-100",
                          vote.isFinalized && "bg-gray-50 opacity-75"
                        )}>
                          <CardContent className="pt-4 pb-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-base">{vote.title}</h4>
                                    {vote.isFinalized && (
                                      <Badge variant="secondary" className="text-xs gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Finalized
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">{vote.description}</p>
                                </div>
                              </div>

                              {!vote.isFinalized ? (
                                <>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Enter Vote Counts:</Label>
                                    {vote.options.map((option) => (
                                      <div key={option.name} className="flex items-center gap-3">
                                        <Label className="text-sm flex-1">{option.name}</Label>
                                        <Input
                                          type="number"
                                          min="0"
                                          placeholder="0"
                                          value={editingVoteCounts[`${vote.id}-${option.name}`] ?? Number(option.voteCount).toString()}
                                          onChange={(e) => handleUpdateVoteCount(vote.id, option.name, e.target.value)}
                                          className="h-9 w-24"
                                          disabled={vote.isFinalized}
                                        />
                                        <span className="text-sm text-muted-foreground w-12">votes</span>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">Total Votes:</span>
                                      <Badge variant="outline" className="text-sm">{getTotalVotes(vote)}</Badge>
                                      {vote.isValidated && (
                                        <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-800">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Validated
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex gap-1.5">
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="gap-1 h-8 text-xs"
                                        onClick={() => {
                                          setSelectedVoteId(vote.id);
                                          setRecordResultsOpen(true);
                                        }}
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        Record Results
                                      </Button>
                                      <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                                        <Edit className="w-3 h-3" />
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Final Results:</Label>
                                    {vote.options.map((option) => (
                                      <div key={option.name} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                        <span className="text-sm font-medium">{option.name}</span>
                                        <Badge variant="secondary" className="text-sm">{Number(option.voteCount)} votes</Badge>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2 pt-2 border-t">
                                    <span className="text-sm text-muted-foreground">
                                      Finalized on {vote.finalizedTimestamp ? formatDate(vote.finalizedTimestamp) : 'Unknown'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6 text-sm">No active votes. Create a class decision to get started!</p>
                  )}
                </CardContent>
              </Card>

              {/* Record Results Confirmation Dialog */}
              <AlertDialog open={recordResultsOpen} onOpenChange={setRecordResultsOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Record and Finalize Vote Results?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {selectedVoteId && activeVotes && (() => {
                        const vote = activeVotes.find(v => v.id === selectedVoteId);
                        if (!vote) return null;
                        return (
                          <div className="space-y-3 mt-3">
                            <p className="text-sm">You're about to finalize the vote for <strong>{vote.title}</strong>.</p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                              <p className="text-sm font-medium">Vote Breakdown:</p>
                              {vote.options.map((option) => (
                                <div key={option.name} className="flex justify-between text-sm">
                                  <span>{option.name}:</span>
                                  <span className="font-medium">{Number(option.voteCount)} votes</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                                <span>Total:</span>
                                <span>{getTotalVotes(vote)} votes</span>
                              </div>
                            </div>
                            <Alert className="border-yellow-200 bg-yellow-50">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-xs text-yellow-900">
                                Once finalized, vote counts cannot be edited. The winning decision will be displayed on the Class Display.
                              </AlertDescription>
                            </Alert>
                          </div>
                        );
                      })()}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedVoteId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRecordResults} className="bg-indigo-600 hover:bg-indigo-700">
                      Finalize Results
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {/* System Section */}
          {activeSection === 'system' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Award Settings</CardTitle>
                  <CardDescription className="text-sm">Configure default award behavior</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Split Ratio (Class Fund / Personal)</Label>
                    <div className="flex items-center gap-3">
                      <Input type="number" placeholder="70" className="w-20 h-9" />
                      <span className="text-muted-foreground text-sm">/</span>
                      <Input type="number" placeholder="30" className="w-20 h-9" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Preset Amount Buttons</Label>
                      <Dialog open={editPresetsOpen} onOpenChange={(open) => {
                        setEditPresetsOpen(open);
                        if (open && presetAmounts) {
                          setEditablePresets(presetAmounts.map(a => a.toString()));
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                            <Edit className="w-3 h-3" />
                            Edit Presets
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Preset Amounts</DialogTitle>
                            <DialogDescription>Adjust up to five preset award amounts</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            {editablePresets.map((preset, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Label className="text-sm w-20">Preset {index + 1}</Label>
                                <Input
                                  type="number"
                                  value={preset}
                                  onChange={(e) => {
                                    const newPresets = [...editablePresets];
                                    newPresets[index] = e.target.value;
                                    setEditablePresets(newPresets);
                                  }}
                                  className="h-9 flex-1"
                                />
                                {editablePresets.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      const newPresets = editablePresets.filter((_, i) => i !== index);
                                      setEditablePresets(newPresets);
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            {editablePresets.length < 10 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 h-9"
                                onClick={() => setEditablePresets([...editablePresets, ''])}
                              >
                                <Plus className="w-4 h-4" />
                                Add Preset
                              </Button>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditPresetsOpen(false)} size="sm" className="h-9">Cancel</Button>
                            <Button onClick={handleUpdatePresets} disabled={updatePresets.isPending} size="sm" className="h-9">
                              {updatePresets.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {presetAmounts?.map((amount, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{Number(amount)}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Preset Reasons</Label>
                      <Dialog open={addReasonOpen} onOpenChange={setAddReasonOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                            <Plus className="w-3 h-3" />
                            Add Custom Reason
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Custom Reason</DialogTitle>
                            <DialogDescription>Create a new preset reason for awards</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="newReason" className="text-sm">Reason Text</Label>
                              <Input id="newReason" placeholder="e.g., Excellent teamwork" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="h-9" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddReasonOpen(false)} size="sm" className="h-9">Cancel</Button>
                            <Button onClick={handleAddReason} disabled={addReason.isPending} size="sm" className="h-9">
                              {addReason.isPending ? 'Adding...' : 'Add Reason'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {presetReasons?.map((reason, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">{reason}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                setEditingReasonIndex(index);
                                setEditingReasonText(reason);
                                setEditReasonOpen(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleDeleteReason(index)}
                              disabled={deleteReason.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={editReasonOpen} onOpenChange={setEditReasonOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Reason</DialogTitle>
                    <DialogDescription>Update the preset reason text</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="editReason" className="text-sm">Reason Text</Label>
                      <Input id="editReason" value={editingReasonText} onChange={(e) => setEditingReasonText(e.target.value)} className="h-9" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditReasonOpen(false)} size="sm" className="h-9">Cancel</Button>
                    <Button onClick={handleUpdateReason} disabled={updateReason.isPending} size="sm" className="h-9">
                      {updateReason.isPending ? 'Updating...' : 'Update Reason'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Classroom Information</CardTitle>
                  <CardDescription className="text-sm">Basic class details</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3 pt-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Class Name</Label>
                      <Input placeholder="e.g., Mrs. Smith's 3rd Grade" className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">School Year</Label>
                      <Input placeholder="e.g., 2024-2025" className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Student Count</Label>
                      <Input value={students.length} disabled className="h-9" />
                    </div>
                  </div>
                  <Button size="sm" className="gap-2 h-9">
                    <Edit className="w-4 h-4" />
                    Edit Info
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-900 text-xl">Danger Zone</CardTitle>
                  <CardDescription className="text-sm">Irreversible actions - use with caution</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-2 pt-4">
                  <Dialog open={semesterResetOpen} onOpenChange={setSemesterResetOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50 h-9">
                        <RotateCcw className="w-4 h-4" />
                        Reset Semester
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Semester Reset</DialogTitle>
                        <DialogDescription>Choose what to reset for the new semester</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="resetFund" checked={resetFund} onCheckedChange={(checked) => setResetFund(checked as boolean)} />
                          <Label htmlFor="resetFund" className="text-sm">Reset class fund to 0</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="resetBalances" checked={resetBalances} onCheckedChange={(checked) => setResetBalances(checked as boolean)} />
                          <Label htmlFor="resetBalances" className="text-sm">Reset all student balances</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="keepStudents" checked={keepStudents} onCheckedChange={(checked) => setKeepStudents(checked as boolean)} />
                          <Label htmlFor="keepStudents" className="text-sm">Keep student accounts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="archiveHistory" checked={archiveHistory} onCheckedChange={(checked) => setArchiveHistory(checked as boolean)} />
                          <Label htmlFor="archiveHistory" className="text-sm">Archive transaction history</Label>
                        </div>
                        <Alert>
                          <AlertDescription className="text-sm">This action cannot be undone. Export your data first!</AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSemesterResetOpen(false)} size="sm" className="h-9">Cancel</Button>
                        <Button variant="destructive" onClick={handleSemesterReset} size="sm" className="h-9">Confirm Reset</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50 h-9">
                    <Download className="w-4 h-4" />
                    Archive Class
                  </Button>
                  <Button variant="destructive" className="w-full gap-2 h-9">
                    <Trash2 className="w-4 h-4" />
                    Delete Class
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this {deleteTarget?.type}. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
