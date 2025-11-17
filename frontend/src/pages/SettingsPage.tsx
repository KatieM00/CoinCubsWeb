// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
// DO NOT import useAuth or useGetUserProfile directly - they cause circular dependency issues with the bundler
// Profile is passed as a prop from the parent component (App.tsx)
import { useIsCallerAdmin, useGetClassFund, useGetRewardsCatalog, useAddReward, useUpdateRewardPrice, useCreateClassGoal, useGetPresetAmounts, useUpdatePresetAmounts, useGetTeacherClass, useGetStudents, useAddStudent, useUpdateClassBalance, useUpdateStudent, useCreateTeacherClass, useUpdateTeacherClass, useGetClassGoals, useUpdateProfile, useDeleteStudent } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import CubCoinIcon from '@/assets/CubCoin.png';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type SettingsSection = 'classroom' | 'funds' | 'students' | 'parents' | 'account';

// Props interface - profile is passed from parent to avoid circular dependency
interface SettingsPageProps {
  profile?: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
);

export default function SettingsPage({ profile }: SettingsPageProps) {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: rewards, isLoading: rewardsLoading } = useGetRewardsCatalog();
  const { data: presetAmounts } = useGetPresetAmounts();
  const { data: teacherClass } = useGetTeacherClass();
  const { data: students, isLoading: studentsLoading } = useGetStudents(teacherClass?.id);
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();
  const addStudent = useAddStudent();
  const updateClassBalance = useUpdateClassBalance();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const addReward = useAddReward();
  const updateRewardPrice = useUpdateRewardPrice();
  const createGoal = useCreateClassGoal();
  const updatePresets = useUpdatePresetAmounts();
  const createTeacherClass = useCreateTeacherClass();
  const updateTeacherClass = useUpdateTeacherClass();
  const updateProfile = useUpdateProfile();

  const [activeSection, setActiveSection] = useState<SettingsSection>('classroom');

  // Classroom section states
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [editClassName, setEditClassName] = useState('');
  const [editClassSize, setEditClassSize] = useState('');
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editSchoolYear, setEditSchoolYear] = useState('');
  const [semesterResetOpen, setSemesterResetOpen] = useState(false);

  // Funds section states
  const [editBalanceOpen, setEditBalanceOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [editPresetsOpen, setEditPresetsOpen] = useState(false);
  const [editablePresets, setEditablePresets] = useState<string[]>(() => []);
  const [splitRatio, setSplitRatio] = useState(() => ({ class: '70', personal: '30' }));

  // Weekly Salary states
  const [weeklySalaryOpen, setWeeklySalaryOpen] = useState(false);
  const [weeklySalaryEnabled, setWeeklySalaryEnabled] = useState(false);
  const [weeklySalaryAmount, setWeeklySalaryAmount] = useState('30');
  const [weeklySalaryDay, setWeeklySalaryDay] = useState('monday');
  const [nextPaymentDate, setNextPaymentDate] = useState(() => {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday.toLocaleDateString('en-GB');
  });

  // Goals section states
  const [createGoalOpen, setCreateGoalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [addRewardOpen, setAddRewardOpen] = useState(false);
  const [rewardName, setRewardName] = useState('');
  const [rewardCost, setRewardCost] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [editRewardOpen, setEditRewardOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<bigint | null>(null);

  // Students section states
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [studentBalance, setStudentBalance] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [studentActive, setStudentActive] = useState(true);
  const [studentParentName, setStudentParentName] = useState('');
  const [showAllBalances, setShowAllBalances] = useState(false);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(() => new Set());
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [bankStatementOpen, setBankStatementOpen] = useState(false);
  const [selectedBankStudent, setSelectedBankStudent] = useState<{ id: string; name: string; balance: number } | null>(null);

  // Parents section states
  const [sendLetterOpen, setSendLetterOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  // Account Admin section states
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountTeacherName, setAccountTeacherName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // Populate account fields from profile on load
  useEffect(() => {
    if (profile) {
      setAccountTeacherName(profile.full_name || '');
      setAccountEmail(profile.email || '');
    }
  }, [profile]);

  // Derive studentsList from students data - MUST be defined before any useEffect that uses it
  const studentsList = students || [];

  // Initialize all student balances as hidden by default
  useEffect(() => {
    if (studentsList.length > 0) {
      setHiddenBalances(new Set(studentsList.map(s => s.id)));
    }
  }, [studentsList.length]);

  // Enable weekly salary by default in demo mode
  useEffect(() => {
    if (isDemoMode) {
      setWeeklySalaryEnabled(true);
      setWeeklySalaryAmount('30');
      setWeeklySalaryDay('monday');
    }
  }, [isDemoMode]);

  const formatCubCoins = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return num.toLocaleString();
  };

  // Transaction history - currently returns empty, will be populated by awards and shop purchases
  // TODO: Connect to actual transaction storage (localStorage or Supabase)
  const getStudentTransactions = (studentId: string) => {
    // For now, return empty array - transactions will be recorded when:
    // 1. Awards are given from QuickAwardPage
    // 2. Purchases are made from Shop
    return [] as { date: string; reference: string; amount: number; type: 'earned' | 'spent'; balanceAfter: number }[];
  };

  // Handler functions
  const handleCreateClass = async () => {
    if (!editClassName.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    try {
      if (teacherClass) {
        await updateTeacherClass.mutateAsync({
          classId: teacherClass.id,
          className: editClassName,
          schoolYear: editSchoolYear,
        });
        toast.success('Class information updated!');
      } else {
        const result = await createTeacherClass.mutateAsync({
          className: editClassName,
          schoolYear: editSchoolYear,
        });
        toast.success(`Class created! Your class code is: ${result.classCode}`, {
          duration: 5000,
        });
      }
      setIsEditingClass(false);
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class information');
    }
  };

  const handleEditBalance = async () => {
    if (!balanceAmount) {
      toast.error('Please enter an amount');
      return;
    }
    try {
      await updateClassBalance.mutateAsync({
        amount: Number(balanceAmount),
        reason: balanceReason || 'Manual balance adjustment',
        type: 'set'
      });
      toast.success('Balance updated successfully!');
      setEditBalanceOpen(false);
      setBalanceAmount('');
      setBalanceReason('');
    } catch (error) {
      toast.error('Failed to update balance');
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

  const handleCreateGoal = async () => {
    if (!goalName || !goalTarget) {
      toast.error('Please fill in goal name and target amount');
      return;
    }
    try {
      await createGoal.mutateAsync({
        name: goalName,
        targetAmount: BigInt(goalTarget),
        description: goalDescription
      });
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

  const handleAddReward = async () => {
    if (!rewardName || !rewardCost) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await addReward.mutateAsync({
        name: rewardName,
        cost: BigInt(rewardCost),
        description: rewardDescription
      });
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
      await updateRewardPrice.mutateAsync({
        rewardId: selectedRewardId,
        newCost: BigInt(rewardCost)
      });
      toast.success('Reward price updated successfully!');
      setEditRewardOpen(false);
      setSelectedRewardId(null);
      setRewardCost('');
    } catch (error) {
      toast.error('Failed to update reward price');
      console.error(error);
    }
  };

  const handleAddStudent = async () => {
    if (!studentFirstName || !studentSurname) {
      toast.error('Please enter student name');
      return;
    }
    try {
      await addStudent.mutateAsync({
        name: `${studentFirstName} ${studentSurname}`,
        balance: studentBalance ? Number(studentBalance) : 0
      });
      toast.success('Student added successfully!');
      setAddStudentOpen(false);
      setStudentFirstName('');
      setStudentSurname('');
      setStudentBalance('');
    } catch (error) {
      toast.error('Failed to add student');
      console.error(error);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    try {
      await updateStudent.mutateAsync({
        studentId: selectedStudent,
        name: `${studentFirstName} ${studentSurname}`,
        personalBalance: studentBalance ? Number(studentBalance) : undefined,
        notes: studentNotes,
        isActive: studentActive
      });
      toast.success('Student updated successfully!');
      setEditStudentOpen(false);
      setSelectedStudent(null);
      setStudentFirstName('');
      setStudentSurname('');
      setStudentBalance('');
      setStudentNotes('');
      setStudentActive(true);
    } catch (error) {
      toast.error('Failed to update student');
      console.error(error);
    }
  };

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('first') || lines[0].toLowerCase().includes('name') ? 1 : 0;

      let successCount = 0;
      let errorCount = 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 2) {
          errorCount++;
          continue;
        }

        const firstName = parts[0];
        const surname = parts[1];
        const balance = parts[2] ? parseInt(parts[2]) : 0;

        try {
          await addStudent.mutateAsync({
            name: `${firstName} ${surname}`,
            balance: isNaN(balance) ? 0 : balance
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to add student: ${firstName} ${surname}`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} student(s)!`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} student(s)`);
      }

      // Reset the file input
      if (csvInputRef.current) {
        csvInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to parse CSV file');
      console.error(error);
    }
  };

  const toggleBalance = (studentId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(studentId)) {
      newHidden.delete(studentId);
    } else {
      newHidden.add(studentId);
    }
    setHiddenBalances(newHidden);
  };

  const toggleAllBalances = () => {
    if (showAllBalances) {
      // Hide all
      setHiddenBalances(new Set(studentsList.map(s => s.id)));
      setShowAllBalances(false);
    } else {
      // Show all
      setHiddenBalances(new Set());
      setShowAllBalances(true);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudent.mutateAsync(studentToDelete.id);
      toast.success(`${studentToDelete.name} has been removed`);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete student');
      console.error(error);
    }
  };

  const handleSaveAccountInfo = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: accountTeacherName,
      });
      toast.success('Account information updated!');
      setIsEditingAccount(false);
    } catch (error) {
      toast.error('Failed to update account information');
      console.error(error);
    }
  };

  if (adminLoading || fundLoading || goalsLoading || rewardsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
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

  const totalClassCubCoins = classFund?.balance || BigInt(0);
  const activeGoals = classGoals?.filter((goal: any) => goal.isActive) || [];
  const primaryGoal = activeGoals[0];
  // studentsList is now defined earlier (before useEffect that uses it) to avoid TDZ error

  const sidebarItems = [
    { id: 'classroom' as SettingsSection, label: 'Classroom', icon: Icon },
    { id: 'funds' as SettingsSection, label: 'Funds and Goals', icon: Icon },
    { id: 'students' as SettingsSection, label: 'Students', icon: Icon },
    { id: 'parents' as SettingsSection, label: 'Parents', icon: Icon },
    { id: 'account' as SettingsSection, label: 'Account Admin', icon: Icon },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-100 to-gray-100 border-slate-300 shadow-xl">
        <CardHeader className="text-center py-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">⚙️ Settings</CardTitle>
          <CardDescription className="text-base text-slate-700">
            Administrative controls and class management
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Interface with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation - Desktop */}
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
                          ? 'bg-[#E8C391]/30 text-[#3E2723] font-semibold'
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

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-[1200px]">
          {/* CLASSROOM SECTION */}
          {activeSection === 'classroom' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">About</CardTitle>
                  <CardDescription className="text-sm">Your classroom information</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Class Name</Label>
                      <div className="text-base">{teacherClass?.class_name || 'Not set'}</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Class Size</Label>
                      <div className="text-base">{studentsList.length} students</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Teacher Name</Label>
                      <div className="text-base">{profile?.full_name || 'Not set'}</div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">School Year</Label>
                      <div className="text-base">{teacherClass?.school_year || 'Not set'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Class Code</CardTitle>
                      <CardDescription className="text-sm">Share this code with parents</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditClassName(teacherClass?.class_name || '');
                        setEditSchoolYear(teacherClass?.school_year || '');
                        setIsEditingClass(true);
                      }}
                      className="gap-2"
                    >
                      {teacherClass ? 'Edit Class' : 'Create Class'}
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-2 pt-4">
                  {teacherClass?.class_code ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-amber-900 tracking-wider text-center font-mono">
                          {teacherClass.class_code}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(teacherClass.class_code);
                          toast.success('Class code copied to clipboard!');
                        }}
                        className="gap-2"
                      >
                        Copy
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-muted border-2 border-dashed rounded-lg p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        No class yet - click "Create Class" above to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-900 text-xl">Danger Zone</CardTitle>
                  <CardDescription className="text-sm">Irreversible actions - use with caution</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50 h-9"
                    onClick={() => setSemesterResetOpen(true)}
                  >
                    <Icon className="w-4 h-4" />
                    Reset Semester
                  </Button>
                  <Button variant="outline" className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50 h-9">
                    <Icon className="w-4 h-4" />
                    Archive Class
                  </Button>
                  <Button variant="destructive" className="w-full gap-2 h-9">
                    <Icon className="w-4 h-4" />
                    Delete Class
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FUNDS AND GOALS SECTION */}
          {activeSection === 'funds' && (
            <div className="space-y-6">
              {/* Funds Card */}
              <Card className="border-amber-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Funds</CardTitle>
                      <CardDescription className="text-sm">Manage class fund and settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Preset Amount Buttons</Label>
                    <Dialog open={editPresetsOpen} onOpenChange={(open) => {
                      setEditPresetsOpen(open);
                      if (open && presetAmounts) {
                        setEditablePresets(presetAmounts.map(a => a.toString()));
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                          <Icon className="w-3 h-3" />
                          Edit Presets
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Preset Amounts</DialogTitle>
                          <DialogDescription>Adjust the preset award amounts</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          {editablePresets.map((preset, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Label className="text-sm w-20">Amount {index + 1}</Label>
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
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditPresetsOpen(false)} size="sm">Cancel</Button>
                          <Button onClick={handleUpdatePresets} disabled={updatePresets.isPending} size="sm">
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

                  <Separator />

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Split Ratio (Class Fund / Personal)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={splitRatio.class}
                        onChange={(e) => setSplitRatio({ ...splitRatio, class: e.target.value })}
                        className="w-20 h-9"
                      />
                      <span className="text-muted-foreground text-sm">/</span>
                      <Input
                        type="number"
                        value={splitRatio.personal}
                        onChange={(e) => setSplitRatio({ ...splitRatio, personal: e.target.value })}
                        className="w-20 h-9"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      <Button size="sm" variant="outline">Save</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Current Balance</Label>
                      <div className="text-2xl font-bold text-amber-900">{formatCubCoins(totalClassCubCoins)} CubCoins</div>
                    </div>
                    <Dialog open={editBalanceOpen} onOpenChange={setEditBalanceOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Icon className="w-4 h-4" />
                          Edit Balance
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Class Fund Balance</DialogTitle>
                          <DialogDescription>Set the class fund balance</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="balanceAmount" className="text-sm">New Balance</Label>
                            <Input
                              id="balanceAmount"
                              type="number"
                              placeholder="Enter amount"
                              value={balanceAmount}
                              onChange={(e) => setBalanceAmount(e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="balanceReason" className="text-sm">Reason (Optional)</Label>
                            <Input
                              id="balanceReason"
                              placeholder="Why are you changing the balance?"
                              value={balanceReason}
                              onChange={(e) => setBalanceReason(e.target.value)}
                              className="h-9"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditBalanceOpen(false)} size="sm">Cancel</Button>
                          <Button onClick={handleEditBalance} disabled={updateClassBalance.isPending} size="sm">
                            {updateClassBalance.isPending ? 'Updating...' : 'Update Balance'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Weekly Salary Section */}
                  <div className="pt-4 border-t border-[#E8C391]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-base">Weekly Salary</h4>
                        <p className="text-xs text-muted-foreground">Automatic weekly income for the class fund</p>
                      </div>
                      <Dialog open={weeklySalaryOpen} onOpenChange={setWeeklySalaryOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-2 h-9">
                            💰 Configure Weekly Salary
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Weekly Salary Settings</DialogTitle>
                            <DialogDescription>
                              Reward students with a regular 'salary' for consistent classroom participation and attendance
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#FFF8E7] rounded-lg">
                              <div>
                                <Label htmlFor="salaryEnabled" className="font-semibold">Enable Weekly Salary</Label>
                                <p className="text-xs text-muted-foreground">Automatically add funds to class balance each week</p>
                              </div>
                              <input
                                id="salaryEnabled"
                                type="checkbox"
                                checked={weeklySalaryEnabled}
                                onChange={(e) => setWeeklySalaryEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="salaryAmount">Amount (CubCoins)</Label>
                              <Input
                                id="salaryAmount"
                                type="number"
                                placeholder="30"
                                value={weeklySalaryAmount}
                                onChange={(e) => setWeeklySalaryAmount(e.target.value)}
                                disabled={!weeklySalaryEnabled}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="salaryDay">Pay Day</Label>
                              <Select value={weeklySalaryDay} onValueChange={setWeeklySalaryDay} disabled={!weeklySalaryEnabled}>
                                <SelectTrigger id="salaryDay">
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monday">Monday</SelectItem>
                                  <SelectItem value="tuesday">Tuesday</SelectItem>
                                  <SelectItem value="wednesday">Wednesday</SelectItem>
                                  <SelectItem value="thursday">Thursday</SelectItem>
                                  <SelectItem value="friday">Friday</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setWeeklySalaryOpen(false)} size="sm">Cancel</Button>
                            <Button
                              onClick={() => {
                                toast.success(`Weekly salary ${weeklySalaryEnabled ? 'enabled' : 'disabled'}${weeklySalaryEnabled ? `: ${weeklySalaryAmount} CC every ${weeklySalaryDay.charAt(0).toUpperCase() + weeklySalaryDay.slice(1)}` : ''}`);
                                setWeeklySalaryOpen(false);
                              }}
                              size="sm"
                            >
                              Save Settings
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {weeklySalaryEnabled ? (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Amount:</span> {weeklySalaryAmount} CC every {weeklySalaryDay.charAt(0).toUpperCase() + weeklySalaryDay.slice(1)}</p>
                          <p><span className="font-medium">Next payment:</span> {nextPaymentDate}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setWeeklySalaryOpen(true)}>
                            ✏️ Edit Settings
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                            onClick={() => {
                              setWeeklySalaryEnabled(false);
                              toast.info('Weekly salary paused');
                            }}
                          >
                            ⏸️ Pause Salary
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-muted-foreground">Weekly salary is not enabled. Click "Configure Weekly Salary" to set up automatic weekly income for your class.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Goals Card */}
              <Card className="border-[#E8C391]">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Goals</CardTitle>
                      <CardDescription className="text-sm">Active class goal and rewards</CardDescription>
                    </div>
                    <Dialog open={createGoalOpen} onOpenChange={setCreateGoalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 h-9">
                          <Icon className="w-4 h-4" />
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
                            <Label htmlFor="goalName">Goal Name</Label>
                            <Input
                              id="goalName"
                              placeholder="e.g., Class Pizza Party"
                              value={goalName}
                              onChange={(e) => setGoalName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="goalTarget">Target Amount (CubCoins)</Label>
                            <Input
                              id="goalTarget"
                              type="number"
                              placeholder="e.g., 500"
                              value={goalTarget}
                              onChange={(e) => setGoalTarget(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="goalDescription">Description (Optional)</Label>
                            <Input
                              id="goalDescription"
                              placeholder="Describe the goal..."
                              value={goalDescription}
                              onChange={(e) => setGoalDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateGoalOpen(false)} size="sm">Cancel</Button>
                          <Button onClick={handleCreateGoal} disabled={createGoal.isPending} size="sm">
                            {createGoal.isPending ? 'Creating...' : 'Create Goal'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  {primaryGoal ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{primaryGoal.name}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{primaryGoal.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">{formatCubCoins(primaryGoal.targetAmount)} CubCoins</Badge>
                        <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                          <Icon className="w-3 h-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4 text-sm">No active goal</p>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Reward Categories</Label>
                    <Dialog open={addRewardOpen} onOpenChange={setAddRewardOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-2 h-8 text-xs">
                          <Icon className="w-3 h-3" />
                          Add New Reward
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Reward</DialogTitle>
                          <DialogDescription>Create a new reward for students</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="rewardName">Reward Name</Label>
                            <Input
                              id="rewardName"
                              placeholder="e.g., Extra Recess"
                              value={rewardName}
                              onChange={(e) => setRewardName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="rewardCost">Cost (CubCoins)</Label>
                            <Input
                              id="rewardCost"
                              type="number"
                              placeholder="Enter cost"
                              value={rewardCost}
                              onChange={(e) => setRewardCost(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="rewardDescription">Description</Label>
                            <Input
                              id="rewardDescription"
                              placeholder="Describe the reward..."
                              value={rewardDescription}
                              onChange={(e) => setRewardDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAddRewardOpen(false)} size="sm">Cancel</Button>
                          <Button onClick={handleAddReward} disabled={addReward.isPending} size="sm">
                            {addReward.isPending ? 'Adding...' : 'Add Reward'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {rewards && rewards.length > 0 ? (
                      rewards.map((reward: any) => (
                        <div key={Number(reward.id)} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{reward.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{formatCubCoins(reward.cost)} CubCoins</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 h-7 px-2 text-xs"
                              onClick={() => {
                                setSelectedRewardId(reward.id);
                                setRewardCost(reward.cost.toString());
                                setEditRewardOpen(true);
                              }}
                            >
                              <Icon className="w-3 h-3" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4 text-sm">No rewards yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STUDENTS SECTION */}
          {activeSection === 'students' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Student Management</CardTitle>
                      <CardDescription className="text-sm">{studentsList.length} students in class</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 h-9">
                              <Icon className="w-4 h-4" />
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
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                placeholder="Enter first name"
                                value={studentFirstName}
                                onChange={(e) => setStudentFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="surname">Surname</Label>
                              <Input
                                id="surname"
                                placeholder="Enter surname"
                                value={studentSurname}
                                onChange={(e) => setStudentSurname(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="initialBalance">Initial Balance (Optional)</Label>
                              <Input
                                id="initialBalance"
                                type="number"
                                placeholder="0"
                                value={studentBalance}
                                onChange={(e) => setStudentBalance(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddStudentOpen(false)} size="sm">Cancel</Button>
                            <Button onClick={handleAddStudent} disabled={addStudent.isPending} size="sm">
                              {addStudent.isPending ? 'Adding...' : 'Add Student'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <input
                        type="file"
                        ref={csvInputRef}
                        accept=".csv"
                        onChange={handleCSVImport}
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9"
                        onClick={() => csvInputRef.current?.click()}
                      >
                        <Icon className="w-4 h-4" />
                        Import CSV
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 h-9">
                        <Icon className="w-4 h-4" />
                        Export
                      </Button>
                      </div>
                      <Button
                        variant={isRemoveMode ? "default" : "outline"}
                        size="sm"
                        className="gap-2 h-7 text-xs"
                        onClick={() => setIsRemoveMode(!isRemoveMode)}
                      >
                        <Icon className="w-3 h-3" />
                        {isRemoveMode ? 'Done Removing' : 'Remove Student'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAllBalances}
                      className="gap-2 h-8"
                    >
                      {showAllBalances ? 'Hide All Balances' : 'Show All Balances'}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isRemoveMode && <TableHead className="w-12"></TableHead>}
                        <TableHead>First Name</TableHead>
                        <TableHead>Surname</TableHead>
                        <TableHead>CubCoin Balance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsLoading ? (
                        <TableRow>
                          <TableCell colSpan={isRemoveMode ? 5 : 4} className="text-center text-muted-foreground h-20">Loading students...</TableCell>
                        </TableRow>
                      ) : studentsList.length > 0 ? (
                        studentsList.map((student: any) => {
                          const nameParts = student.name.split(' ');
                          const firstName = nameParts[0] || '';
                          const surname = nameParts.slice(1).join(' ') || '';
                          const isBalanceHidden = hiddenBalances.has(student.id);
                          return (
                            <TableRow key={student.id}>
                              {isRemoveMode && (
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setStudentToDelete({ id: student.id, name: student.name });
                                      setDeleteConfirmOpen(true);
                                    }}
                                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Icon className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              )}
                              <TableCell>{firstName}</TableCell>
                              <TableCell>{surname}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {isBalanceHidden ? (
                                    <span className="text-muted-foreground">•••</span>
                                  ) : (
                                    <Badge variant="secondary">{student.personalBalance || 0} CubCoins</Badge>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleBalance(student.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Icon className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedStudent(student.id);
                                      setStudentFirstName(firstName);
                                      setStudentSurname(surname);
                                      setStudentBalance(student.personalBalance?.toString() || '');
                                      setStudentNotes(student.notes || '');
                                      setStudentActive(student.isActive);
                                      setStudentParentName('');
                                      setEditStudentOpen(true);
                                    }}
                                  >
                                    <Icon className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => {
                                      setSelectedBankStudent({
                                        id: student.id,
                                        name: student.name,
                                        balance: student.personalBalance
                                      });
                                      setBankStatementOpen(true);
                                    }}
                                  >
                                    <Icon className="w-3 h-3 mr-1" />
                                    Enter Bank
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isRemoveMode ? 5 : 4} className="text-center text-muted-foreground h-20">No students yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PARENTS SECTION */}
          {activeSection === 'parents' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Parents</CardTitle>
                      <CardDescription className="text-sm">Manage parent communications</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Icon className="w-4 h-4" />
                      Send Class Letter
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Full Name</TableHead>
                        <TableHead>Parent Full Name</TableHead>
                        <TableHead>Meal Type</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsList.length > 0 ? (
                        studentsList.map((student: any) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-muted-foreground">Not linked</TableCell>
                            <TableCell>
                              <Select defaultValue="packed">
                                <SelectTrigger className="h-8 w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="free">Free School Meals</SelectItem>
                                  <SelectItem value="packed">Packed Lunch</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Checkbox defaultChecked />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Icon className="w-3 h-3 mr-1" />
                                Send Letter
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground h-20">No students yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ACCOUNT ADMIN SECTION */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Account Admin</CardTitle>
                      <CardDescription className="text-sm">Manage your account settings</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant={isEditingAccount ? 'default' : 'outline'}
                      onClick={() => {
                        if (isEditingAccount) {
                          handleSaveAccountInfo();
                        } else {
                          setIsEditingAccount(true);
                        }
                      }}
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? 'Saving...' : isEditingAccount ? 'Save' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Teacher Name</Label>
                    {isEditingAccount ? (
                      <Input
                        value={accountTeacherName}
                        onChange={(e) => setAccountTeacherName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="text-base">{accountTeacherName || 'Not set'}</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Class Name</Label>
                    <div className="text-base">{teacherClass?.class_name || 'Not set'}</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Class Size</Label>
                    <div className="text-base">{studentsList.length} students</div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Sign in Email</Label>
                    {isEditingAccount ? (
                      <Input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="text-base">{accountEmail || 'Not set'}</div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setChangePasswordOpen(true)}>
                      <Icon className="w-4 h-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 border-red-300 text-red-700 hover:bg-red-50" onClick={() => setDeleteAccountOpen(true)}>
                      <Icon className="w-4 h-4" />
                      Delete Account
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Icon className="w-4 h-4" />
                      Transfer Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={isEditingClass} onOpenChange={setIsEditingClass}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{teacherClass ? 'Edit Class Information' : 'Create Your Class'}</DialogTitle>
            <DialogDescription>
              {teacherClass
                ? 'Update your classroom details'
                : 'Set up your classroom. A unique class code will be generated for parents to join.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name *</Label>
              <Input
                id="className"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                placeholder="e.g., Mrs. Smith's 3rd Grade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolYear">School Year</Label>
              <Input
                id="schoolYear"
                value={editSchoolYear}
                onChange={(e) => setEditSchoolYear(e.target.value)}
                placeholder="e.g., 2024-2025"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingClass(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateClass}
              disabled={createTeacherClass.isPending || updateTeacherClass.isPending}
            >
              {createTeacherClass.isPending || updateTeacherClass.isPending
                ? 'Saving...'
                : teacherClass
                ? 'Save Changes'
                : 'Create Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editStudentOpen} onOpenChange={setEditStudentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="editFirstName">First Name</Label>
              <Input
                id="editFirstName"
                placeholder="First name"
                value={studentFirstName}
                onChange={(e) => setStudentFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editSurname">Surname</Label>
              <Input
                id="editSurname"
                placeholder="Surname"
                value={studentSurname}
                onChange={(e) => setStudentSurname(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editParentName">Parent Name</Label>
              <Input
                id="editParentName"
                placeholder="Parent full name"
                value={studentParentName}
                onChange={(e) => setStudentParentName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editStudentNotes">Private Notes</Label>
              <Input
                id="editStudentNotes"
                placeholder="Add private notes..."
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="studentActiveEdit"
                checked={studentActive}
                onCheckedChange={(checked) => setStudentActive(checked as boolean)}
              />
              <Label htmlFor="studentActiveEdit">Student is active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStudentOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleEditStudent} disabled={updateStudent.isPending} size="sm">
              {updateStudent.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{studentToDelete?.name}</strong> from the class? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              disabled={deleteStudent.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteStudent.isPending ? 'Deleting...' : 'Delete Student'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Reward Dialog */}
      <Dialog open={editRewardOpen} onOpenChange={setEditRewardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reward Price</DialogTitle>
            <DialogDescription>Update the cost of this reward</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="editRewardCost">New Cost (CubCoins)</Label>
              <Input
                id="editRewardCost"
                type="number"
                placeholder="Enter new cost"
                value={rewardCost}
                onChange={(e) => setRewardCost(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRewardOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleEditReward} disabled={updateRewardPrice.isPending} size="sm">
              {updateRewardPrice.isPending ? 'Updating...' : 'Update Price'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Semester Reset Dialog */}
      <AlertDialog open={semesterResetOpen} onOpenChange={setSemesterResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Semester?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset class funds and balances for the new semester. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              toast.success('Semester reset completed!');
              setSemesterResetOpen(false);
            }}>
              Reset Semester
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <AlertDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Password change functionality coming soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bank Statement Dialog */}
      <Dialog open={bankStatementOpen} onOpenChange={setBankStatementOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl">
              Bank Statement - {selectedBankStudent?.name}
            </DialogTitle>
            <DialogDescription>
              Transaction history and current balance
            </DialogDescription>
          </DialogHeader>
          {selectedBankStudent && (
            <div className="flex flex-col flex-1 min-h-0 space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center flex-shrink-0">
                <div className="text-sm text-muted-foreground">Current Balance</div>
                <div className="text-3xl font-bold text-primary">
                  {selectedBankStudent.balance} CC
                </div>
              </div>
              <ScrollArea className="h-[350px]">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getStudentTransactions(selectedBankStudent.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No transactions yet. Transactions will appear here when CubCoins are awarded or spent in the shop.
                          </TableCell>
                        </TableRow>
                      ) : (
                        getStudentTransactions(selectedBankStudent.id).map((tx, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-sm">{tx.date}</TableCell>
                            <TableCell>{tx.reference}</TableCell>
                            <TableCell className={`text-right font-medium ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'earned' ? '+' : ''}{tx.amount} CC
                            </TableCell>
                            <TableCell className="text-right font-mono">{tx.balanceAfter} CC</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
