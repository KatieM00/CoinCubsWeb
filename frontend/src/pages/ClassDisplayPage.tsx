import { useEffect, useState, useRef } from 'react';
import { useGetClassFund, useGetClassGoals, useGetActivityTicker } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Coins, Trophy, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClassDisplayPage() {
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();
  const { data: activityTicker, refetch: refetchActivity } = useGetActivityTicker();

  const [displayedTotal, setDisplayedTotal] = useState<number>(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [animatingCoins, setAnimatingCoins] = useState<number[]>([]);
  const previousTotalRef = useRef<number>(0);
  const previousTickerLengthRef = useRef<number>(0);

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
