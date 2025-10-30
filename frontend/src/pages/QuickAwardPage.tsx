import { useState, useEffect, useRef } from 'react';
import { useGetClassFund, useAwardClassGems, useGetClassGoals, useIsCallerAdmin, useGetLastAwardedStudents, useGetUndoTransaction, useUndoLastAward, useGetWeeklyStats } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, TrendingUp, Users, Undo2, CheckCircle2, Trophy, Coins, TrendingUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AwardSplit } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuickAwardPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();
  const { data: lastAwardedStudents } = useGetLastAwardedStudents();
  const { data: undoTransaction } = useGetUndoTransaction();
  const { data: weeklyStats, isLoading: statsLoading } = useGetWeeklyStats();
  const awardCubCoins = useAwardClassGems();
  const undoAward = useUndoLastAward();

  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isWholeClass, setIsWholeClass] = useState(false);
  const [awardAmount, setAwardAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [awardReason, setAwardReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastAwardedName, setLastAwardedName] = useState('');
  const [showUndoButton, setShowUndoButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock student list
  const mockStudents = [
    { id: '1', name: 'Emma Johnson' },
    { id: '2', name: 'Liam Smith' },
    { id: '3', name: 'Olivia Brown' },
    { id: '4', name: 'Noah Davis' },
    { id: '5', name: 'Ava Wilson' },
    { id: '6', name: 'Ethan Martinez' },
    { id: '7', name: 'Sophia Anderson' },
    { id: '8', name: 'Mason Taylor' },
  ];

  useEffect(() => {
    if (undoTransaction) {
      setShowUndoButton(true);
      const timer = setTimeout(() => {
        setShowUndoButton(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowUndoButton(false);
    }
  }, [undoTransaction]);

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const formatCubCoins = (amount: bigint) => Number(amount).toLocaleString();

  const handleQuickAward = async () => {
    const finalAmount = customAmount || awardAmount;
    
    if ((!selectedStudent && !isWholeClass) || !finalAmount || !awardReason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const amount = BigInt(finalAmount);
      const splitType = isWholeClass ? 'allToClassFund' : 'defaultSplit';

      await awardCubCoins.mutateAsync({
        studentId: isWholeClass ? '0' : selectedStudent,
        amount,
        splitType,
        description: awardReason,
      });

      const awardedName = isWholeClass 
        ? 'Whole class' 
        : mockStudents.find(s => s.id === selectedStudent)?.name || 'Student';
      setLastAwardedName(awardedName);
      setShowConfirmation(true);

      setSelectedStudent('');
      setIsWholeClass(false);
      setCustomAmount('');
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to award CubCoins');
      console.error(error);
    }
  };

  const handleUndoAward = async () => {
    try {
      await undoAward.mutateAsync();
      toast.success('Last award undone successfully!');
      setShowConfirmation(false);
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        toast.error('Undo window has expired (10 seconds)');
      } else {
        toast.error('Failed to undo award');
      }
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const finalAmount = customAmount || awardAmount;
    if (e.key === 'Enter' && (selectedStudent || isWholeClass) && finalAmount && awardReason) {
      e.preventDefault();
      handleQuickAward();
    } else if (e.key === 'Escape') {
      setSelectedStudent('');
      setIsWholeClass(false);
      setAwardAmount('');
      setCustomAmount('');
      setAwardReason('');
    }
  };

  const setPresetAmount = (amount: number) => {
    setAwardAmount(amount.toString());
    setCustomAmount('');
  };

  const handleQuickSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    setIsWholeClass(false);
  };

  const handleWholeClassClick = () => {
    setIsWholeClass(true);
    setSelectedStudent('');
  };

  const calculateSplit = () => {
    const finalAmount = customAmount || awardAmount;
    if (!finalAmount) return null;
    
    const amount = Number(finalAmount);
    
    if (isWholeClass) {
      return {
        classAmount: amount,
        personalAmount: 0,
        studentName: 'Whole Class',
        isWholeClass: true,
      };
    }
    
    const classAmount = Math.floor(amount * 0.7);
    const personalAmount = amount - classAmount;
    const studentName = mockStudents.find(s => s.id === selectedStudent)?.name || 'student';
    
    return { classAmount, personalAmount, studentName, isWholeClass: false };
  };

  if (adminLoading || fundLoading || goalsLoading) {
    return (
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-2xl space-y-4 md:space-y-6">
        <Skeleton className="h-32 md:h-48 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertDescription>
            Only teachers can access the Quick Award page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalCubCoins = classFund?.totalAmount || BigInt(0);
  const activeGoals = classGoals?.filter(goal => goal.isActive) || [];
  const primaryGoal = activeGoals[0];

  const presetReasons = [
    'Helped classmate',
    'Great work',
    'Perfect homework',
    'Good behavior',
    'Class participation',
  ];

  const split = calculateSplit();

  return (
    <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8 max-w-2xl space-y-4 md:space-y-6 pb-8">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 shadow-xl">
        <CardHeader className="text-center py-4 md:py-6">
          <CardTitle className="text-2xl md:text-3xl font-bold text-indigo-900">⚡ Quick Award</CardTitle>
          <CardDescription className="text-base md:text-lg text-indigo-800">
            Fast, mobile-friendly award interface
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Award Form Card */}
      <Card className="border-amber-300 shadow-xl">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl">Award CubCoins</CardTitle>
              <CardDescription className="text-sm md:text-base">70% to class fund, 30% to student</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-5" onKeyDown={handleKeyDown}>
          {/* Recently Awarded Students */}
          {lastAwardedStudents && lastAwardedStudents.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Recently Awarded</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {lastAwardedStudents.slice(0, 5).map((award, idx) => {
                  const student = mockStudents.find(s => s.id === award.studentId.toString());
                  return (
                    <Button
                      key={idx}
                      type="button"
                      variant={selectedStudent === award.studentId.toString() ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handleQuickSelectStudent(award.studentId.toString())}
                      className="text-sm md:text-base h-14 md:h-16 px-3 md:px-4 w-full"
                    >
                      <div className="flex flex-col items-start w-full">
                        <span className="font-semibold text-xs md:text-sm truncate w-full text-left">
                          {student?.name || `Student ${Number(award.studentId)}`}
                        </span>
                        <span className="text-[10px] md:text-xs opacity-75 truncate w-full text-left">{award.reason}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="studentSelect" className="text-base font-semibold">Student Selection</Label>
            <Select value={selectedStudent} onValueChange={(value) => {
              setSelectedStudent(value);
              setIsWholeClass(false);
            }}>
              <SelectTrigger className="text-base md:text-lg h-12 md:h-14 w-full" id="studentSelect">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id} className="text-sm md:text-base py-3">
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Whole Class Button */}
          <div className="space-y-2">
            <Button
              type="button"
              variant={isWholeClass ? 'default' : 'outline'}
              size="lg"
              onClick={handleWholeClassClick}
              className="w-full text-lg md:text-xl h-14 md:h-16 font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
            >
              <Trophy className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              🏆 AWARD WHOLE CLASS
            </Button>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 25].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={awardAmount === amount.toString() && !customAmount ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setPresetAmount(amount)}
                  className="text-xl md:text-2xl h-16 md:h-20 font-bold"
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAwardAmount('');
              }}
              className="text-base md:text-lg h-12 md:h-14 w-full"
              min="1"
            />
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base font-semibold">Reason</Label>
            <Select value={awardReason} onValueChange={setAwardReason}>
              <SelectTrigger className="text-base md:text-lg h-12 md:h-14 w-full" id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {presetReasons.map((reason) => (
                  <SelectItem key={reason} value={reason} className="text-sm md:text-base py-3">
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {split && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 md:p-4 border-2 border-amber-200">
              <p className="text-xs md:text-sm font-medium text-amber-900 mb-2">Preview:</p>
              <div className="space-y-1">
                <p className="text-sm md:text-base text-amber-800">
                  <span className="font-bold">+{split.classAmount} CubCoins</span> to class fund
                </p>
                {split.isWholeClass ? (
                  <p className="text-sm md:text-base text-amber-800 font-semibold">
                    All students benefit together!
                  </p>
                ) : (
                  <p className="text-sm md:text-base text-amber-800">
                    <span className="font-bold">+{split.personalAmount} CubCoins</span> to {split.studentName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="bg-green-50 rounded-xl p-3 md:p-4 border-2 border-green-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
              <p className="text-base md:text-lg font-semibold text-green-900">
                ✅ {lastAwardedName} awarded!
              </p>
            </div>
          )}

          {/* Award Button */}
          <Button
            onClick={handleQuickAward}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xl md:text-2xl h-16 md:h-20 font-bold shadow-lg"
            disabled={awardCubCoins.isPending || (!selectedStudent && !isWholeClass) || !(customAmount || awardAmount) || !awardReason}
          >
            {awardCubCoins.isPending ? (
              <>
                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Awarding...
              </>
            ) : (
              'AWARD'
            )}
          </Button>

          {/* Undo Button */}
          {showUndoButton && undoTransaction && (
            <Button
              onClick={handleUndoAward}
              variant="outline"
              className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 text-base md:text-lg h-14 md:h-16 font-semibold gap-2"
              disabled={undoAward.isPending}
            >
              <Undo2 className="w-4 h-4 md:w-5 md:h-5" />
              {undoAward.isPending ? 'Undoing...' : 'UNDO LAST AWARD'}
            </Button>
          )}

          {/* Keyboard Shortcuts */}
          <div className="text-center text-xs md:text-sm text-gray-500 space-y-1">
            <p>💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to award</p>
            <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to clear</p>
          </div>
        </CardContent>
      </Card>

      {/* This Week at a Glance Stats Card */}
      <Card className="border-blue-300 shadow-xl">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl">This Week at a Glance</CardTitle>
              <CardDescription className="text-sm md:text-base">Quick weekly overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {statsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : weeklyStats ? (
            <>
              <div className="bg-amber-50 rounded-xl p-3 md:p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                  <p className="text-xs md:text-sm text-amber-800 font-medium">Class Fund Balance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl">🪙</span>
                  <span className="text-2xl md:text-3xl font-bold text-amber-900">
                    {formatCubCoins(weeklyStats.classFundBalance)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-3 md:p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <p className="text-xs md:text-sm text-green-800 font-medium">Students Who Contributed</p>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-green-900">
                  {Number(weeklyStats.studentsContributed)} / {Number(weeklyStats.totalStudents)}
                </p>
                <p className="text-xs md:text-sm text-green-700 mt-1">
                  {weeklyStats.totalStudents > BigInt(0) 
                    ? `${Math.round((Number(weeklyStats.studentsContributed) / Number(weeklyStats.totalStudents)) * 100)}% participation`
                    : 'No students yet'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 md:p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <p className="text-xs md:text-sm text-purple-800 font-medium">Total CubCoins Earned This Week</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl">✨</span>
                  <span className="text-2xl md:text-3xl font-bold text-purple-900">
                    {formatCubCoins(weeklyStats.totalCubCoinsEarned)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-6 text-sm">No stats available yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
