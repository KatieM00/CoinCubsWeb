// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { useGetClassFund, useAwardClassGems, useGetClassGoals, useGetLastAwardedStudents, useGetUndoTransaction, useUndoLastAward, useGetWeeklyStats, useGetStudents, useGetTeacherClass } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useAdminCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AwardSplit } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CubCoinIcon from '@/assets/CubCoin.png';

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
);

export default function QuickAwardPage() {
  console.log('📊 QuickAwardPage: Component function starting');

  console.log('📊 QuickAwardPage: Before useIsCallerAdmin');
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  console.log('📊 QuickAwardPage: After useIsCallerAdmin');

  console.log('📊 QuickAwardPage: Before useGetClassFund');
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  console.log('📊 QuickAwardPage: After useGetClassFund');

  console.log('📊 QuickAwardPage: Before useGetClassGoals');
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();
  console.log('📊 QuickAwardPage: After useGetClassGoals');

  console.log('📊 QuickAwardPage: Before useGetLastAwardedStudents');
  const { data: lastAwardedStudents } = useGetLastAwardedStudents();
  console.log('📊 QuickAwardPage: After useGetLastAwardedStudents');

  console.log('📊 QuickAwardPage: Before useGetUndoTransaction');
  const { data: undoTransaction } = useGetUndoTransaction();
  console.log('📊 QuickAwardPage: After useGetUndoTransaction');

  console.log('📊 QuickAwardPage: Before useGetWeeklyStats');
  const { data: weeklyStats, isLoading: statsLoading } = useGetWeeklyStats();
  console.log('📊 QuickAwardPage: After useGetWeeklyStats');

  console.log('📊 QuickAwardPage: Before useGetTeacherClass');
  const { data: teacherClass } = useGetTeacherClass();
  console.log('📊 QuickAwardPage: After useGetTeacherClass');

  console.log('📊 QuickAwardPage: Before useGetStudents');
  const { data: students, isLoading: studentsLoading } = useGetStudents(teacherClass?.id);
  console.log('📊 QuickAwardPage: After useGetStudents');

  console.log('📊 QuickAwardPage: Before useAwardClassGems');
  const awardCubCoins = useAwardClassGems();
  console.log('📊 QuickAwardPage: After useAwardClassGems');

  console.log('📊 QuickAwardPage: Before useUndoLastAward');
  const undoAward = useUndoLastAward();
  console.log('📊 QuickAwardPage: After useUndoLastAward, all hooks initialized');

  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isWholeClass, setIsWholeClass] = useState(false);
  const [awardAmount, setAwardAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [awardReason, setAwardReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastAwardedName, setLastAwardedName] = useState('');
  const [lastAwardSplit, setLastAwardSplit] = useState<{ classAmount: number; personalAmount: number; studentName: string; isWholeClass: boolean } | null>(null);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use real students from database
  const studentsList = students || [];

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
    const finalReason = awardReason === 'custom' ? customReason : awardReason;

    if ((!selectedStudent && !isWholeClass) || !finalAmount || !finalReason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const amount = BigInt(finalAmount);
      const splitType = isWholeClass ? 'allToClassFund' : 'defaultSplit';

      // Calculate and store split before clearing form
      const currentSplit = calculateSplit();
      if (currentSplit) {
        setLastAwardSplit(currentSplit);
      }

      await awardCubCoins.mutateAsync({
        studentId: isWholeClass ? '0' : selectedStudent,
        amount,
        splitType,
        description: finalReason,
      });

      const awardedName = isWholeClass
        ? 'Whole class'
        : studentsList.find(s => s.id === selectedStudent)?.name || 'Student';
      setLastAwardedName(awardedName);
      setShowConfirmation(true);

      setSelectedStudent('');
      setIsWholeClass(false);
      setAwardAmount('');
      setCustomAmount('');
      setAwardReason('');
      setCustomReason('');
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
    const finalReason = awardReason === 'custom' ? customReason : awardReason;
    if (e.key === 'Enter' && (selectedStudent || isWholeClass) && finalAmount && finalReason) {
      e.preventDefault();
      handleQuickAward();
    } else if (e.key === 'Escape') {
      setSelectedStudent('');
      setIsWholeClass(false);
      setAwardAmount('');
      setCustomAmount('');
      setAwardReason('');
      setCustomReason('');
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
    const studentName = studentsList.find(s => s.id === selectedStudent)?.name || 'student';

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
      {/* Bank Card */}
      <Card className="border-amber-300 shadow-xl">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl">Award</CardTitle>
              <CardDescription className="text-sm md:text-base">Award CubCoins to students</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-5" onKeyDown={handleKeyDown}>
          {/* Section 1: Who? */}
          <div className="space-y-2">
            <Label htmlFor="studentSelect" className="text-base font-semibold">Who?</Label>
            <div className="flex gap-2">
              <Select
                value={selectedStudent}
                onValueChange={(value) => {
                  setSelectedStudent(value);
                  setIsWholeClass(false);
                }}
                disabled={isWholeClass || studentsLoading || studentsList.length === 0}
              >
                <SelectTrigger className="text-base md:text-lg h-12 md:h-14 flex-1" id="studentSelect">
                  <SelectValue placeholder={studentsLoading ? "Loading students..." : studentsList.length === 0 ? "No students yet - add in Settings" : "Select a student"} />
                </SelectTrigger>
                <SelectContent>
                  {studentsList.map((student) => (
                    <SelectItem key={student.id} value={student.id} className="text-sm md:text-base py-3">
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant={isWholeClass ? 'default' : 'outline'}
                size="lg"
                onClick={handleWholeClassClick}
                className="h-12 md:h-14 px-4 md:px-6 font-semibold whitespace-nowrap"
              >
                🏆
                Whole Class
              </Button>
            </div>
          </div>

          {/* Section 2: Why? */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base font-semibold">Why?</Label>
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
                <SelectItem value="custom" className="text-sm md:text-base py-3">
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
            {awardReason === 'custom' && (
              <Input
                type="text"
                placeholder="Enter custom reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="text-base md:text-lg h-12 md:h-14 w-full mt-2"
              />
            )}
          </div>

          {/* Section 3: Amount */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Amount:</Label>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 25].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={awardAmount === amount.toString() && !customAmount ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setPresetAmount(amount)}
                  className="text-xl md:text-2xl h-16 md:h-20 font-bold flex-1"
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAwardAmount('');
              }}
              className="text-base md:text-lg h-12 md:h-14 w-full text-center font-bold"
              min="1"
              max="9999"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleQuickAward}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xl md:text-2xl h-16 md:h-20 font-bold shadow-lg"
            disabled={awardCubCoins.isPending || (!selectedStudent && !isWholeClass) || !(customAmount || awardAmount) || !(awardReason === 'custom' ? customReason : awardReason)}
          >
            {awardCubCoins.isPending ? (
              <>
                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>

          {/* Confirmation Message */}
          {showConfirmation && lastAwardSplit && (
            <div className="bg-green-50 rounded-xl p-3 md:p-4 border-2 border-green-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <span className="text-green-600 flex-shrink-0 mt-1 text-xl">✓</span>
                <div>
                  <p className="text-base md:text-lg font-semibold text-green-900 mb-1">
                    ✅ Awarded successfully!
                  </p>
                  <div className="text-sm md:text-base text-green-800 space-y-0.5">
                    <p><span className="font-bold">+{lastAwardSplit.classAmount} CubCoins</span> added to class fund</p>
                    {!lastAwardSplit.isWholeClass && (
                      <p><span className="font-bold">+{lastAwardSplit.personalAmount} CubCoins</span> given to {lastAwardSplit.studentName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Undo Button */}
          {showUndoButton && undoTransaction && (
            <Button
              onClick={handleUndoAward}
              variant="outline"
              className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 text-base md:text-lg h-14 md:h-16 font-semibold gap-2"
              disabled={undoAward.isPending}
            >
              ↩️
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

    </div>
  );
}
