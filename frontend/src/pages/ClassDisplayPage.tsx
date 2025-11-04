// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import { useGetClassFund, useGetClassGoals, useGetActivityTicker, useGetDisplayMode, useGetActiveLessonContent, useGetActiveVotingProposals, useEndLesson, useMarkLessonComplete } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ClassDisplayPage() {
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();
  const { data: activityTicker } = useGetActivityTicker();
  const { data: displayMode } = useGetDisplayMode();
  const { data: lessonContent } = useGetActiveLessonContent();
  const { data: votingProposals } = useGetActiveVotingProposals();
  const endLesson = useEndLesson();
  const markLessonComplete = useMarkLessonComplete();

  const [displayedTotal, setDisplayedTotal] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'individual' | 'wholeClass'>('individual');
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);
  const previousTotalRef = useRef<number>(0);
  const previousTickerLengthRef = useRef<number>(0);

  // Lesson completion dialog state
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [lessonNotes, setLessonNotes] = useState('');

  const formatCubCoins = (amount: bigint) => Number(amount).toLocaleString();

  const totalCubCoins = classFund?.totalAmount || BigInt(0);
  const activeGoals = classGoals?.filter(goal => goal.isActive) || [];
  const primaryGoal = activeGoals[0];

  const isLessonMode = displayMode === 'lessonMode';

  const handleEndLessonWithoutCompletion = async () => {
    try {
      await endLesson.mutateAsync();
      toast.success('Lesson ended - returning to dashboard');
    } catch (error) {
      toast.error('Failed to end lesson');
      console.error(error);
    }
  };

  const handleMarkComplete = async () => {
    if (!lessonContent) return;

    try {
      await markLessonComplete.mutateAsync({
        weekNumber: Number(lessonContent.weekNumber),
        dayType: lessonContent.dayType,
        notes: lessonNotes,
      });

      // End the lesson and return to dashboard
      await endLesson.mutateAsync();

      toast.success('Lesson marked as complete!');
      setShowCompletionDialog(false);
      setLessonNotes('');
    } catch (error) {
      toast.error('Failed to mark lesson complete');
      console.error(error);
    }
  };

  // Get active voting proposal for Lesson 2, Lesson 3, and Lesson 4 Friday
  const activeVote = votingProposals && votingProposals.length > 0 ? votingProposals[0] : null;
  const isVotingActive = activeVote && !activeVote.isFinalized;
  const votingFinalized = activeVote && activeVote.isFinalized;

  // Detect Lesson content
  const isLesson3Monday = lessonContent?.title.includes('One Marshmallow Now or Two Later');
  const isLesson3Friday = lessonContent?.title.includes('Should We Save or Spend');
  const isLesson4Monday = lessonContent?.title.includes('What If We Worked Together');
  const isLesson4Friday = lessonContent?.title.includes('Should We Collaborate');

  // Smooth counter animation when total changes
  useEffect(() => {
    const currentTotal = Number(totalCubCoins);
    const previousTotal = previousTotalRef.current;

    if (currentTotal !== previousTotal && previousTotal > 0) {
      const difference = currentTotal - previousTotal;
      const duration = 1000;
      const steps = 30;
      const increment = difference / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayedTotal(currentTotal);
          clearInterval(interval);
        } else {
          setDisplayedTotal(Math.round(previousTotal + increment * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      setDisplayedTotal(currentTotal);
    }

    previousTotalRef.current = currentTotal;
  }, [totalCubCoins]);

  // Trigger celebration when new activity is added
  useEffect(() => {
    if (activityTicker && activityTicker.length > 0) {
      const currentLength = activityTicker.length;
      const previousLength = previousTickerLengthRef.current;

      if (currentLength > previousLength && previousLength > 0) {
        const latestActivity = activityTicker[0];
        if (latestActivity.isCelebration) {
          setCelebrationType(latestActivity.isWholeClassAward ? 'wholeClass' : 'individual');
          setShowCelebration(true);
          const timer = setTimeout(() => {
            setShowCelebration(false);
          }, latestActivity.isWholeClassAward ? 4000 : 2000);
          return () => clearTimeout(timer);
        }
      }

      previousTickerLengthRef.current = currentLength;
    }
  }, [activityTicker]);

  // Auto-scroll through ticker items
  useEffect(() => {
    if (activityTicker && activityTicker.length > 1) {
      const interval = setInterval(() => {
        setCurrentTickerIndex((prev) => (prev + 1) % activityTicker.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activityTicker]);

  // Trigger goal celebration
  useEffect(() => {
    if (primaryGoal && primaryGoal.currentAmount >= primaryGoal.targetAmount) {
      setCelebrationType('wholeClass');
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [primaryGoal]);

  // Trigger celebration when vote is finalized
  useEffect(() => {
    if (votingFinalized) {
      setCelebrationType('wholeClass');
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [votingFinalized]);

  if (fundLoading || goalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E0F2FE] to-[#DBEAFE]">
        <Skeleton className="h-96 w-full max-w-6xl rounded-3xl" />
      </div>
    );
  }

  // Lesson Mode Display
  if (isLessonMode && lessonContent) {
    const isFridayVoting = lessonContent.title.includes('Time to Vote');
    const isMondayIntro = lessonContent.title.includes('Our Class Gets to Decide Together');
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden">
        {/* Celebration Effects */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-in zoom-in duration-500">
              <img
                src="/assets/generated/voting-celebration-winner.dim_400x400.png"
                alt="Celebration"
                className="w-full h-full max-w-2xl max-h-2xl object-contain animate-pulse"
              />
            </div>
          </div>
        )}

        <div className="max-w-6xl w-full space-y-12 text-center">
          {/* Lesson Title */}
          <div className="space-y-4">
            <div className="text-7xl md:text-8xl lg:text-9xl mb-6">
              {isFridayVoting || isLesson3Friday || isLesson4Friday ? '🗳️' : isLesson3Monday ? '🍬' : isLesson4Monday ? '🤝' : '📚'}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#92400E] leading-tight">
              {lessonContent.title}
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#B45309]">
              {lessonContent.weekTopic}
            </p>
          </div>

          {/* Lesson 4 Monday: Cross-Classroom Collaboration Math Comparison */}
          {isLesson4Monday && (
            <>
              {/* Math Comparison */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#7C3AED] p-8">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#5B21B6] mb-6">
                  Math Comparison
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Our Class */}
                  <div className="bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] rounded-2xl p-6 border-4 border-[#5B21B6]">
                    <div className="text-4xl mb-3">🏫</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Our Class</h3>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                        alt="CubCoin"
                        className="w-12 h-12"
                      />
                      <span className="text-5xl font-bold text-white">2,800</span>
                    </div>
                    <p className="text-xl text-white/90 mt-3">56% to goal</p>
                  </div>

                  {/* Mrs. Smith's Class */}
                  <div className="bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] rounded-2xl p-6 border-4 border-[#1E40AF]">
                    <div className="text-4xl mb-3">🏫</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Mrs. Smith's Class</h3>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                        alt="CubCoin"
                        className="w-12 h-12"
                      />
                      <span className="text-5xl font-bold text-white">2,200</span>
                    </div>
                    <p className="text-xl text-white/90 mt-3">44% to goal</p>
                  </div>
                </div>

                {/* Separate vs Together */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Separate Progress */}
                  <div className="bg-[#FCA5A5] rounded-2xl p-6 border-4 border-[#DC2626]">
                    <div className="text-4xl mb-3">🔴</div>
                    <h3 className="text-2xl font-bold text-[#7F1D1D] mb-3">Separate Progress</h3>
                    <p className="text-lg text-[#7F1D1D]">Our class: 56%</p>
                    <p className="text-lg text-[#7F1D1D]">Their class: 44%</p>
                    <p className="text-xl font-bold text-[#7F1D1D] mt-3">Neither reaches goal alone!</p>
                  </div>

                  {/* Together */}
                  <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl p-6 border-4 border-[#065F46]">
                    <div className="text-4xl mb-3">🟢</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Together</h3>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <img
                        src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                        alt="CubCoin"
                        className="w-12 h-12"
                      />
                      <span className="text-5xl font-bold text-white">5,000</span>
                    </div>
                    <p className="text-2xl font-bold text-white">100% to goal! 🎉</p>
                  </div>
                </div>
              </div>

              {/* Combined Progress After 3 Weeks */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#10B981] p-8">
                <div className="text-5xl mb-4">📈</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#065F46] mb-6">
                  Combined Progress After 3 Weeks
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* If Separate */}
                  <div className="bg-[#FEF3C7] rounded-2xl p-6 border-4 border-[#F59E0B]">
                    <div className="text-4xl mb-3">🔴</div>
                    <h3 className="text-2xl font-bold text-[#78350F] mb-4">If Separate</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-lg font-semibold text-[#78350F]">Our class: ~3,600 (72%)</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-lg font-semibold text-[#78350F]">Their class: ~3,000 (60%)</p>
                      </div>
                      <p className="text-xl font-bold text-[#DC2626] mt-4">Still not enough! 😔</p>
                    </div>
                  </div>

                  {/* If Together */}
                  <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl p-6 border-4 border-[#065F46]">
                    <div className="text-4xl mb-3">🟢</div>
                    <h3 className="text-2xl font-bold text-white mb-4">If Together</h3>
                    <div className="space-y-3">
                      <div className="bg-white/90 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-3">
                          <img
                            src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                            alt="CubCoin"
                            className="w-10 h-10"
                          />
                          <span className="text-3xl font-bold text-[#065F46]">~6,600</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white">Carnival + Extra Activities! 🎉</p>
                      <p className="text-lg text-white/90">We can do MORE together!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion Prompt */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#92400E] p-8">
                <div className="text-5xl mb-4">💭</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#92400E] mb-6">
                  Let's Think About This:
                </h2>
                <p className="text-2xl md:text-3xl text-[#78350F] leading-relaxed font-medium">
                  {lessonContent.discussionPrompt}
                </p>
              </div>
            </>
          )}

          {/* Lesson 4 Friday: Collaboration Voting */}
          {isLesson4Friday && activeVote && (
            <>
              {/* Voting Prompt */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#7C3AED] p-8 mb-8">
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#5B21B6] mb-4">
                  Should we collaborate with Mrs. Smith's class?
                </h2>
              </div>

              {/* Live Vote Counting Interface */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#92400E] mb-8">
                  {votingFinalized ? '🎉 Voting Results 🎉' : '📊 Live Vote Count 📊'}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {activeVote.options.map((option, idx) => {
                    const maxVotes = Math.max(...activeVote.options.map(o => Number(o.voteCount)));
                    const isWinner = votingFinalized && Number(option.voteCount) === maxVotes;
                    const isYes = option.name.toLowerCase().includes('yes');
                    
                    return (
                      <div
                        key={idx}
                        className={`rounded-3xl shadow-xl border-4 p-8 space-y-6 transition-all ${
                          isWinner 
                            ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] border-[#065F46] scale-110 animate-pulse' 
                            : isYes
                            ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] border-[#065F46]'
                            : 'bg-gradient-to-br from-[#FCA5A5] to-[#F87171] border-[#DC2626]'
                        }`}
                      >
                        <div className="text-6xl mb-4">
                          {isYes ? '✅' : '❌'}
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-bold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {option.name}
                        </h3>
                        <div className={`text-7xl md:text-8xl font-bold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {Number(option.voteCount)}
                        </div>
                        <p className={`text-xl font-semibold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {Number(option.voteCount) === 1 ? 'vote' : 'votes'}
                        </p>
                        {isWinner && (
                          <div className="mt-4">
                            <div className="text-5xl mb-2">👑</div>
                            <p className="text-2xl font-bold text-white">WINNER!</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Votes */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-[#3B82F6]">
                <p className="text-2xl md:text-3xl font-bold text-[#1E3A8A]">
                  Total Votes: <span className="text-[#F59E0B]">{Number(activeVote.totalVotes)}</span>
                </p>
              </div>

              {/* Conditional Outcome Display */}
              {votingFinalized && (
                <>
                  {/* Determine winner */}
                  {(() => {
                    const winningOption = activeVote.options.reduce((prev, current) => 
                      Number(current.voteCount) > Number(prev.voteCount) ? current : prev
                    );
                    const didCollaborate = winningOption.name.toLowerCase().includes('yes');

                    return didCollaborate ? (
                      // If class voted YES
                      <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-3xl p-8 border-4 border-[#065F46] shadow-2xl">
                        <div className="text-6xl mb-4">🎊</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Amazing! We're Collaborating!
                        </h2>
                        <div className="space-y-6">
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🤝</div>
                            <p className="text-xl md:text-2xl font-bold text-[#065F46] mb-3">
                              Arrange joint meeting with Mrs. Smith's class
                            </p>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">💰</div>
                            <p className="text-xl md:text-2xl font-bold text-[#065F46] mb-3">
                              Combine funds: 2,800 + 2,200 = 5,000 CubCoins
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-4">
                              <img
                                src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                                alt="CubCoin"
                                className="w-12 h-12"
                              />
                              <span className="text-4xl font-bold text-[#F59E0B]">5,000</span>
                            </div>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🎪</div>
                            <p className="text-xl md:text-2xl font-bold text-[#065F46]">
                              Immediate carnival celebration!
                            </p>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🎉</div>
                            <p className="text-xl md:text-2xl font-bold text-[#065F46]">
                              Plan joint activities and shared rewards
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // If class voted NO
                      <div className="bg-gradient-to-br from-[#FCA5A5] to-[#F87171] rounded-3xl p-8 border-4 border-[#DC2626] shadow-2xl">
                        <div className="text-6xl mb-4">🏫</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          We're Continuing Separately
                        </h2>
                        <div className="space-y-6">
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🎯</div>
                            <p className="text-xl md:text-2xl font-bold text-[#92400E] mb-3">
                              Continue working separately
                            </p>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">💭</div>
                            <p className="text-xl md:text-2xl font-bold text-[#92400E] mb-3">
                              Discuss alternative goals we can reach alone
                            </p>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🏆</div>
                            <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                              Keep our class identity and individual achievements
                            </p>
                          </div>
                          <div className="bg-white/90 rounded-2xl p-6">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                              Explore other collaboration opportunities
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Key Learning */}
                  <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-3xl p-8 border-4 border-[#5B21B6] shadow-2xl">
                    <div className="text-5xl mb-4">🌟</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Key Learning
                    </h2>
                    <p className="text-xl md:text-2xl text-white leading-relaxed">
                      Collaboration allows us to achieve bigger goals together, but we must decide when cooperation serves everyone's interests!
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Lesson 3 Monday: Marshmallow Experiment */}
          {isLesson3Monday && (
            <>
              {/* Current Situation */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#10B981] p-8">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#065F46] mb-4">
                  Current Situation
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <img
                    src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                    alt="CubCoin"
                    className="w-16 h-16"
                  />
                  <span className="text-5xl md:text-6xl font-bold text-[#F59E0B]">
                    800
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-[#92400E]">+</span>
                  <span className="text-4xl md:text-5xl font-bold text-[#10B981]">~400 more</span>
                  <span className="text-3xl md:text-4xl font-bold text-[#92400E]">=</span>
                  <span className="text-5xl md:text-6xl font-bold text-[#7C3AED]">1,200 total</span>
                </div>
              </div>

              {/* Options Comparison */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#92400E]">
                  What Should We Choose?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Option A - Spend Now */}
                  <div className="bg-gradient-to-br from-[#FCA5A5] to-[#F87171] rounded-3xl shadow-xl border-4 border-[#DC2626] p-8 space-y-6">
                    <div className="text-6xl mb-4">🍕</div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      Option A: Spend Now
                    </h3>
                    <div className="space-y-4 text-left">
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✓ Pizza Party Today!
                        </p>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✗ Fund goes to 0
                        </p>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✗ Start saving over again
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <img
                        src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                        alt="CubCoin"
                        className="w-12 h-12"
                      />
                      <span className="text-4xl font-bold text-white">1,200</span>
                    </div>
                  </div>

                  {/* Option B - Save & Wait */}
                  <div className="bg-gradient-to-br from-[#86EFAC] to-[#4ADE80] rounded-3xl shadow-xl border-4 border-[#16A34A] p-8 space-y-6">
                    <div className="text-6xl mb-4">🚌</div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      Option B: Save & Wait
                    </h3>
                    <div className="space-y-4 text-left">
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✗ No reward this week
                        </p>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✓ Keep saving our CubCoins
                        </p>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✓ Field Trip in 4 weeks!
                        </p>
                      </div>
                      <div className="bg-white/90 rounded-xl p-4">
                        <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                          ✓ More fun, longer lasting!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <img
                        src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                        alt="CubCoin"
                        className="w-12 h-12"
                      />
                      <span className="text-4xl font-bold text-white">2,500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion Prompt */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#92400E] p-8">
                <div className="text-5xl mb-4">💭</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#92400E] mb-6">
                  Let's Think About This:
                </h2>
                <p className="text-2xl md:text-3xl text-[#78350F] leading-relaxed font-medium">
                  {lessonContent.discussionPrompt}
                </p>
              </div>
            </>
          )}

          {/* Lesson 3 Friday: Voting Interface */}
          {isLesson3Friday && activeVote && (
            <>
              {/* Live Vote Counting Interface */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#92400E] mb-8">
                  {votingFinalized ? '🎉 Voting Results 🎉' : '📊 Live Vote Count 📊'}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {activeVote.options.map((option, idx) => {
                    const maxVotes = Math.max(...activeVote.options.map(o => Number(o.voteCount)));
                    const isWinner = votingFinalized && Number(option.voteCount) === maxVotes;
                    const isSpendNow = option.name.includes('Spend') || option.name.includes('Pizza');
                    const isSave = option.name.includes('Save') || option.name.includes('Field Trip');
                    
                    return (
                      <div
                        key={idx}
                        className={`rounded-3xl shadow-xl border-4 p-8 space-y-6 transition-all ${
                          isWinner 
                            ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] border-[#065F46] scale-110 animate-pulse' 
                            : isSpendNow
                            ? 'bg-gradient-to-br from-[#FCA5A5] to-[#F87171] border-[#DC2626]'
                            : 'bg-gradient-to-br from-[#86EFAC] to-[#4ADE80] border-[#16A34A]'
                        }`}
                      >
                        <div className="text-6xl mb-4">
                          {isSpendNow ? '🍕' : '🚌'}
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-bold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {option.name}
                        </h3>
                        <div className={`text-7xl md:text-8xl font-bold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {Number(option.voteCount)}
                        </div>
                        <p className={`text-xl font-semibold ${isWinner ? 'text-white' : 'text-white'}`}>
                          {Number(option.voteCount) === 1 ? 'vote' : 'votes'}
                        </p>
                        {isWinner && (
                          <div className="mt-4">
                            <div className="text-5xl mb-2">👑</div>
                            <p className="text-2xl font-bold text-white">WINNER!</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Votes */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-[#3B82F6]">
                <p className="text-2xl md:text-3xl font-bold text-[#1E3A8A]">
                  Total Votes: <span className="text-[#F59E0B]">{Number(activeVote.totalVotes)}</span>
                </p>
              </div>

              {/* Conditional Outcome Display */}
              {votingFinalized && (
                <>
                  {/* Determine winner */}
                  {(() => {
                    const winningOption = activeVote.options.reduce((prev, current) => 
                      Number(current.voteCount) > Number(prev.voteCount) ? current : prev
                    );
                    const didSave = winningOption.name.includes('Save') || winningOption.name.includes('Field Trip');

                    return didSave ? (
                      // If class voted SAVE
                      <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-3xl p-8 border-4 border-[#065F46] shadow-2xl">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Great Choice! We're Saving for the Field Trip!
                        </h2>
                        <div className="bg-white/90 rounded-2xl p-6 mb-6">
                          <div className="text-4xl mb-3">⏰</div>
                          <p className="text-2xl md:text-3xl font-bold text-[#065F46]">
                            Countdown: 4 weeks to go!
                          </p>
                        </div>
                        <div className="bg-white/90 rounded-2xl p-6">
                          <div className="text-4xl mb-3">📊</div>
                          <p className="text-xl md:text-2xl font-bold text-[#065F46] mb-3">
                            Progress Tracker
                          </p>
                          <div className="flex items-center justify-center gap-4">
                            <img
                              src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                              alt="CubCoin"
                              className="w-12 h-12"
                            />
                            <span className="text-3xl font-bold text-[#F59E0B]">1,200</span>
                            <span className="text-2xl text-[#78350F]">/</span>
                            <span className="text-3xl font-bold text-[#7C3AED]">2,500</span>
                          </div>
                          <div className="mt-4 h-8 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#10B981] to-[#F59E0B] transition-all" style={{ width: '48%' }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // If class voted SPEND
                      <div className="bg-gradient-to-br from-[#FCA5A5] to-[#F87171] rounded-3xl p-8 border-4 border-[#DC2626] shadow-2xl">
                        <div className="text-6xl mb-4">🍕</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Pizza Party Time! 🎉
                        </h2>
                        <div className="bg-white/90 rounded-2xl p-6 mb-6">
                          <p className="text-2xl md:text-3xl font-bold text-[#92400E] mb-4">
                            Let's Reflect on Our Choice:
                          </p>
                          <div className="space-y-3 text-left">
                            <div className="bg-[#FEF3C7] rounded-xl p-4">
                              <p className="text-lg md:text-xl font-semibold text-[#78350F]">
                                💭 Was the pizza party worth it?
                              </p>
                            </div>
                            <div className="bg-[#FEF3C7] rounded-xl p-4">
                              <p className="text-lg md:text-xl font-semibold text-[#78350F]">
                                💭 What did we give up by not waiting?
                              </p>
                            </div>
                            <div className="bg-[#FEF3C7] rounded-xl p-4">
                              <p className="text-lg md:text-xl font-semibold text-[#78350F]">
                                💭 How do we feel about starting over?
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/90 rounded-2xl p-6">
                          <p className="text-xl md:text-2xl font-bold text-[#92400E]">
                            Fund Reset: Starting fresh at 0 CubCoins
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Key Learning */}
                  <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-3xl p-8 border-4 border-[#5B21B6] shadow-2xl">
                    <div className="text-5xl mb-4">🌟</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Key Learning
                    </h2>
                    <p className="text-xl md:text-2xl text-white leading-relaxed">
                      Delayed gratification means waiting for something better. When we save as a community, we support each other and all benefit from the bigger reward!
                    </p>
                  </div>

                  {/* Blockchain Record */}
                  <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-8 border-4 border-[#1E40AF] shadow-2xl">
                    <div className="text-5xl mb-4">🔒</div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      Vote recorded on blockchain (immutable)
                    </p>
                    <p className="text-lg md:text-xl text-white/90 mt-4">
                      This decision is now permanent and transparent!
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Lesson 2 Monday: Show Voting Options */}
          {isMondayIntro && lessonContent.votingOptions && lessonContent.votingOptions.length > 0 && (
            <>
              {/* Current Class Fund Display */}
              <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#10B981] p-8">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#065F46] mb-4">
                  Current Class Fund
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                    alt="CubCoin"
                    className="w-16 h-16"
                  />
                  <span className="text-6xl md:text-7xl font-bold text-[#F59E0B]">
                    2,000
                  </span>
                </div>
              </div>

              {/* Voting Options */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#92400E]">
                  What Should We Choose?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {lessonContent.votingOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 rounded-2xl shadow-xl border-4 border-[#B45309] p-8 space-y-4 hover:scale-105 transition-transform"
                    >
                      <div className="text-5xl mb-4">
                        {idx === 0 ? '🍕' : idx === 1 ? '🎮' : '📚'}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#92400E]">
                        {option.name}
                      </h3>
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <img
                          src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
                          alt="CubCoin"
                          className="w-12 h-12"
                        />
                        <span className="text-3xl font-bold text-[#F59E0B]">
                          {Number(option.cost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voting Rules */}
              <div className="bg-[#3B82F6]/20 rounded-2xl p-8 border-4 border-[#3B82F6]">
                <div className="text-5xl mb-4">⚖️</div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E3A8A]">
                  One person = One vote. Majority wins!
                </p>
              </div>
            </>
          )}

          {/* Lesson 2 Friday: Live Vote Counting */}
          {isFridayVoting && activeVote && !isLesson3Friday && !isLesson4Friday && (
            <>
              {/* Live Vote Counting Interface */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#92400E] mb-8">
                  {votingFinalized ? '🎉 Voting Results 🎉' : '📊 Live Vote Count 📊'}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {activeVote.options.map((option, idx) => {
                    const maxVotes = Math.max(...activeVote.options.map(o => Number(o.voteCount)));
                    const isWinner = votingFinalized && Number(option.voteCount) === maxVotes;
                    
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl shadow-xl border-4 p-8 space-y-4 transition-all ${
                          isWinner 
                            ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] border-[#065F46] scale-110 animate-pulse' 
                            : 'bg-white/90 border-[#B45309]'
                        }`}
                      >
                        <div className="text-5xl mb-4">
                          {idx === 0 ? '🍕' : idx === 1 ? '🎮' : '📚'}
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-bold ${isWinner ? 'text-white' : 'text-[#92400E]'}`}>
                          {option.name}
                        </h3>
                        <div className={`text-6xl md:text-7xl font-bold ${isWinner ? 'text-white' : 'text-[#3B82F6]'}`}>
                          {Number(option.voteCount)}
                        </div>
                        <p className={`text-xl font-semibold ${isWinner ? 'text-white' : 'text-[#78350F]'}`}>
                          {Number(option.voteCount) === 1 ? 'vote' : 'votes'}
                        </p>
                        {isWinner && (
                          <div className="mt-4">
                            <div className="text-5xl mb-2">👑</div>
                            <p className="text-2xl font-bold text-white">WINNER!</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Votes */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-[#3B82F6]">
                <p className="text-2xl md:text-3xl font-bold text-[#1E3A8A]">
                  Total Votes: <span className="text-[#F59E0B]">{Number(activeVote.totalVotes)}</span>
                </p>
              </div>

              {/* Blockchain Record (if finalized) */}
              {votingFinalized && (
                <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-8 border-4 border-[#5B21B6] shadow-2xl">
                  <div className="text-5xl mb-4">🔒</div>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    Vote recorded on blockchain (immutable)
                  </p>
                  <p className="text-lg md:text-xl text-white/90 mt-4">
                    This decision is now permanent and transparent!
                  </p>
                </div>
              )}
            </>
          )}

          {/* Discussion Prompt (for non-voting lessons) */}
          {!isMondayIntro && !isFridayVoting && !isLesson3Monday && !isLesson3Friday && !isLesson4Monday && !isLesson4Friday && (
            <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#92400E] p-12">
              <div className="text-6xl mb-6">💭</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#92400E] mb-8">
                Let's Think About This:
              </h2>
              <p className="text-2xl md:text-3xl lg:text-4xl text-[#78350F] leading-relaxed font-medium">
                {lessonContent.discussionPrompt}
              </p>
            </div>
          )}

          {/* Encouragement Message */}
          <div className="bg-[#10B981]/20 rounded-2xl p-8 border-4 border-[#10B981]">
            <div className="text-5xl mb-4">🌟</div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#065F46]">
              {(isFridayVoting || isLesson3Friday || isLesson4Friday) && votingFinalized
                ? 'Democracy in action! Every voice matters!'
                : 'Working together makes us stronger!'}
            </p>
          </div>
        </div>

        {/* Lesson Control Buttons - Fixed at bottom */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
          <Button
            onClick={() => setShowCompletionDialog(true)}
            disabled={markLessonComplete.isPending || endLesson.isPending}
            size="lg"
            className="h-16 px-8 text-xl font-bold bg-green-600 hover:bg-green-700 shadow-2xl border-4 border-white"
          >
            <Check className="w-6 h-6 mr-3" />
            Complete Lesson
          </Button>
          <Button
            onClick={handleEndLessonWithoutCompletion}
            disabled={endLesson.isPending}
            size="lg"
            variant="outline"
            className="h-16 px-8 text-xl font-bold bg-white hover:bg-gray-100 shadow-2xl border-4 border-gray-300"
          >
            <X className="w-6 h-6 mr-3" />
            {endLesson.isPending ? 'Ending...' : 'End Without Saving'}
          </Button>
        </div>

        {/* Completion Dialog */}
        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Lesson</DialogTitle>
              <DialogDescription className="text-base">
                Mark this lesson as complete and add any notes for future reference.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-purple-900">
                  <span className="text-2xl">📚</span>
                  <span>{lessonContent?.title}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Week {lessonContent?.weekNumber ? Number(lessonContent.weekNumber) : ''} • {lessonContent?.dayType === 'monday' ? 'Monday' : 'Friday'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                  Lesson Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any observations, student reactions, or reminders for next time..."
                  value={lessonNotes}
                  onChange={(e) => setLessonNotes(e.target.value)}
                  className="min-h-[150px] text-base"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCompletionDialog(false);
                  setLessonNotes('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleMarkComplete}
                disabled={markLessonComplete.isPending || endLesson.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {markLessonComplete.isPending || endLesson.isPending ? 'Saving...' : 'Mark Complete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default View Display
  const progressPercentage = primaryGoal 
    ? Math.min(100, Number((primaryGoal.currentAmount * BigInt(100)) / primaryGoal.targetAmount))
    : 0;

  const cubCoinsToGo = primaryGoal 
    ? primaryGoal.targetAmount - primaryGoal.currentAmount
    : BigInt(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] to-[#DBEAFE] flex flex-col relative overflow-hidden">
      {/* Celebration Effects */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {celebrationType === 'wholeClass' ? (
            <div className="animate-in zoom-in duration-500">
              <img
                src="/assets/generated/whole-class-confetti-burst.dim_600x600.png"
                alt="Celebration"
                className="w-full h-full max-w-2xl max-h-2xl object-contain animate-pulse"
              />
            </div>
          ) : (
            <div className="animate-in zoom-in duration-300">
              <img
                src="/assets/generated/individual-award-sparkle-glow.dim_400x400.png"
                alt="Sparkle"
                className="w-96 h-96 object-contain animate-gentle-pulse"
              />
            </div>
          )}
        </div>
      )}

      {/* Top 60% - Hero Section */}
      <div className="flex-[6] flex flex-col items-center justify-center px-8 py-12">
        <div className="text-center max-w-7xl w-full space-y-8">
          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#1E3A8A] mb-8 tracking-wide flex items-center justify-center gap-4">
            <span className="text-7xl md:text-8xl lg:text-9xl">🏆</span>
            <span>OUR CLASS FUND</span>
            <span className="text-7xl md:text-8xl lg:text-9xl">🏆</span>
          </h1>

          {/* Main Balance */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <img
              src="/assets/generated/generated/cubcoin-icon.dim_64x64.png"
              alt="CubCoin"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
            />
            <span className="text-8xl md:text-9xl lg:text-[10rem] font-bold text-[#F59E0B] animate-counter-up leading-none">
              {displayedTotal.toLocaleString()}
            </span>
          </div>

          {/* Goal Section */}
          {primaryGoal && (
            <div className="space-y-6 px-4">
              <p className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1E3A8A]">
                Saving for: {primaryGoal.name}
              </p>

              {/* Progress Bar */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="relative h-16 md:h-20 lg:h-24 bg-white/80 rounded-full overflow-hidden shadow-lg border-4 border-[#1E3A8A]">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#F59E0B] transition-all duration-1000 ease-out flex items-center justify-end pr-8"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Message */}
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#10B981]">
                  {primaryGoal.currentAmount >= primaryGoal.targetAmount 
                    ? '🎉 Goal Reached! Amazing work, class! 🎉'
                    : `Only ${formatCubCoins(cubCoinsToGo)} CubCoins to go!`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom 40% - Activity Ticker */}
      <div className="flex-[4] flex flex-col px-8 pb-12">
        <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-[#1E3A8A] h-full flex flex-col p-8 md:p-12">
          {/* Ticker Header */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-5xl md:text-6xl">📢</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E3A8A]">
              What's Happening
            </h2>
          </div>

          {/* Ticker Content */}
          <div className="flex-1 flex items-center justify-center">
            {activityTicker && activityTicker.length > 0 ? (
              <div className="text-center animate-in fade-in duration-700 w-full" key={currentTickerIndex}>
                <div className="mb-6">
                  {activityTicker[currentTickerIndex]?.isWholeClassAward ? (
                    <div className="text-7xl md:text-8xl lg:text-9xl mb-4">🏆</div>
                  ) : (
                    <div className="text-7xl md:text-8xl lg:text-9xl mb-4">⭐</div>
                  )}
                </div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] mb-6 leading-relaxed px-4">
                  {activityTicker[currentTickerIndex]?.message}
                </p>
                {activityTicker[currentTickerIndex]?.isWholeClassAward && (
                  <div className="inline-block bg-[#10B981] text-white text-2xl md:text-3xl lg:text-4xl px-8 py-4 rounded-full font-bold shadow-lg">
                    Everyone Benefits Together! 🎉
                  </div>
                )}
              </div>
            ) : (
              <p className="text-3xl md:text-4xl lg:text-5xl text-[#1E3A8A] font-semibold">
                No recent activity yet. Let's start earning CubCoins! 🚀
              </p>
            )}
          </div>

          {/* Pagination Dots */}
          {activityTicker && activityTicker.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {activityTicker.slice(0, 10).map((_, index) => (
                <div
                  key={index}
                  className={`h-4 rounded-full transition-all duration-300 ${
                    index === currentTickerIndex
                      ? 'bg-[#1E3A8A] w-12'
                      : 'bg-[#1E3A8A]/30 w-4'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
