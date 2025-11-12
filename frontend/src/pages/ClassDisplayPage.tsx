// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import { useGetClassFund, useGetClassGoals, useGetActivityTicker, useGetDisplayMode, useGetActiveLessonContent, useGetActiveVotingProposals, useEndLesson, useMarkLessonComplete } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, Trophy, TrendingUp, BookOpen, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { data: activityTicker, refetch: refetchActivity } = useGetActivityTicker();
  const { data: displayMode } = useGetDisplayMode();
  const { data: lessonContent } = useGetActiveLessonContent();
  const { data: votingProposals } = useGetActiveVotingProposals();
  const endLesson = useEndLesson();
  const markLessonComplete = useMarkLessonComplete();

  const [displayedTotal, setDisplayedTotal] = useState<number>(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [animatingCoins, setAnimatingCoins] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const previousTotalRef = useRef<number>(0);
  const previousTickerLengthRef = useRef<number>(0);

  // Lesson completion dialog state
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [lessonNotes, setLessonNotes] = useState('');

  const formatCubCoins = (amount: bigint) => Number(amount).toLocaleString();
  const formatTimestamp = (timestamp: bigint) => {
    const now = Date.now();
    const diff = now - Number(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const totalCubCoins = classFund?.balance || BigInt(0);
  const activeGoals = classGoals?.filter((goal: any) => goal.isActive) || [];
  const primaryGoal = activeGoals[0];
  const recentActivities = activityTicker?.slice(0, 3) || [];

  // Current date formatting
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Get class name (placeholder for now)
  const className = "Mrs. Smith's Class";

  // Auto-refetch activity every 15 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetchActivity();
    }, 15000);

    return () => clearInterval(interval);
  }, [refetchActivity]);

  // Smooth counter animation when total changes
  useEffect(() => {
    const currentTotal = Number(totalCubCoins);
    const previousTotal = previousTotalRef.current;

    if (currentTotal !== previousTotal && previousTotal > 0) {
      const difference = currentTotal - previousTotal;
      const duration = 1000;
      const steps = 30;
      const increment = difference / steps;

      let step = 0;
      const interval = setInterval(() => {
        step++;
        setDisplayedTotal(Math.round(previousTotal + increment * step));
        if (step >= steps) {
          clearInterval(interval);
          setDisplayedTotal(currentTotal);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayedTotal(currentTotal);
    }

    previousTotalRef.current = currentTotal;
  }, [totalCubCoins]);

  // Trigger coin animation on new activity
  useEffect(() => {
    const currentLength = activityTicker?.length || 0;
    const previousLength = previousTickerLengthRef.current;

    if (currentLength > previousLength && previousLength > 0) {
      // New activity detected - trigger coin animation
      setShowCoinAnimation(true);
      setAnimatingCoins([0, 1, 2, 3, 4]); // 5 coins

      setTimeout(() => {
        setShowCoinAnimation(false);
        setAnimatingCoins([]);
      }, 2000);
    }

    previousTickerLengthRef.current = currentLength;
  }, [activityTicker]);

  // Calculate goal progress
  const goalProgress = primaryGoal
    ? Math.min(100, Math.floor((Number(primaryGoal.currentAmount) * 100) / Number(primaryGoal.targetAmount)))
    : 0;

  const isLessonMode = displayMode === 'lessonMode';

  const handleEndLessonWithoutCompletion = async () => {
    try {
      await endLesson.mutateAsync();
      toast.success('Lesson ended');
      setShowCompletionDialog(false);
    } catch (error) {
      console.error('Error ending lesson:', error);
      toast.error('Failed to end lesson');
    }
  };

  const handleMarkLessonComplete = async () => {
    try {
      if (!lessonContent?.weekNumber) return;
      await markLessonComplete.mutateAsync({
        weekNumber: lessonContent.weekNumber,
        dayType: lessonContent.dayType,
        notes: lessonNotes
      });
      await endLesson.mutateAsync();
      toast.success('Lesson completed!');
      setShowCompletionDialog(false);
      setLessonNotes('');
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to complete lesson');
    }
  };

  if (fundLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-6 lg:p-8">
        <Skeleton className="h-20 w-full rounded-3xl mb-6" />
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

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

                  {/* Decision Record */}
                  <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-8 border-4 border-[#1E40AF] shadow-2xl">
                    <div className="text-5xl mb-4">🔒</div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      Vote recorded in system (permanent)
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

              {/* Decision Record (if finalized) */}
              {votingFinalized && (
                <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-8 border-4 border-[#5B21B6] shadow-2xl">
                  <div className="text-5xl mb-4">🔒</div>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    Vote recorded in system (permanent)
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

  // Default dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Header Bar */}
      <div className="mb-6 md:mb-8">
        <Card className="border-amber-300 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="py-4 md:py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {className}
              </h1>
              <div className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-700">
                {currentDate}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Current Class Funds */}
        <Card className="border-amber-400 bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl relative overflow-hidden">
          <CardContent className="py-6 md:py-8 lg:py-12">
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Coins className="w-8 h-8 md:w-12 md:h-12 text-amber-600" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-900">
                  Current Class Funds
                </h2>
              </div>
              <div className="text-5xl md:text-7xl lg:text-9xl font-black text-amber-600 drop-shadow-lg">
                {formatCubCoins(BigInt(displayedTotal))}
              </div>
              <p className="text-lg md:text-xl text-amber-800 mt-2">CubCoins</p>
            </div>

            {/* Coin animation target */}
            {showCoinAnimation && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <AnimatePresence>
                  {animatingCoins.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        x: '50%',
                        y: '150%',
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{
                        x: '50%',
                        y: '50%',
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute"
                    >
                      <Coins className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Goal */}
        <Card className="border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 shadow-xl">
          <CardContent className="py-6 md:py-8 lg:py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-green-600" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-900">
                  Class Goal
                </h2>
              </div>
              {primaryGoal ? (
                <>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 mb-4">
                    {primaryGoal.name}
                  </h3>
                  <div className="space-y-3">
                    <Progress
                      value={goalProgress}
                      className="h-6 md:h-8 bg-green-200"
                    />
                    <div className="flex items-center justify-between text-lg md:text-xl font-semibold text-green-700">
                      <span>{goalProgress}% Complete</span>
                      <span>{(Number(primaryGoal.targetAmount) - Number(primaryGoal.currentAmount)).toLocaleString()} to go!</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xl text-green-700">No active goal yet!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Updates Feed */}
      <Card className="border-blue-300 bg-white/95 backdrop-blur-sm shadow-xl mb-8">
        <CardContent className="py-6 md:py-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900">
              Updates
            </h2>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                // Parse activity message to extract details
                const isWholeClass = activity.isWholeClassAward;
                const match = activity.message.match(/^[^\s]+\s+(.+?)\s+earned\s+(\d+)\s+CubCoins\s+for\s+(.+)!$/);
                const recipient = match ? match[1] : (isWholeClass ? 'Whole Class' : 'Student');
                const amount = match ? match[2] : '0';
                const reason = match ? match[3] : activity.message;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${
                      isWholeClass
                        ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50'
                        : 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50'
                    } shadow-md hover:shadow-lg transition-shadow`}>
                      <CardContent className="py-4 md:py-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isWholeClass ? 'bg-purple-200' : 'bg-amber-200'
                          }`}>
                            <span className="text-2xl md:text-4xl">
                              {isWholeClass ? '🏆' : '⭐'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                              🎉 Well done {recipient}!
                            </p>
                            <p className="text-lg md:text-xl lg:text-2xl text-gray-700">
                              You were awarded <span className="font-bold text-amber-600">{amount} CubCoins</span> for <span className="font-semibold">{reason}</span>
                            </p>
                            <p className="text-sm md:text-base text-gray-500 mt-2">
                              {formatTimestamp(BigInt(Date.now()))}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl md:text-3xl text-gray-500">
                No recent updates yet. Start awarding CubCoins!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mascot - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-10">
        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
          <span className="text-5xl md:text-6xl lg:text-7xl">🐻</span>
        </div>
      </div>
    </div>
  );
}
