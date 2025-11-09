// @ts-nocheck
import { useGetClassFund, useGetClassAchievements, useGetClassGoals } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Heart, Target, BookOpen, TrendingUp, Award, Sparkles } from 'lucide-react';

export default function ParentViewPage() {
  const { data: classFund, isLoading: fundLoading } = useGetClassFund();
  const { data: achievements, isLoading: achievementsLoading } = useGetClassAchievements();
  const { data: classGoals, isLoading: goalsLoading } = useGetClassGoals();

  const formatGems = (amount: bigint) => Number(amount).toLocaleString();

  if (fundLoading || achievementsLoading || goalsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const totalClassGems = classFund?.totalAmount || BigInt(0);
  const activeGoals = classGoals?.filter((goal) => goal.isActive) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/parent-view.dim_400x300.png"
              alt="Parent View"
              className="h-32 object-contain drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-4xl font-bold text-teal-900">Parent View</CardTitle>
          <CardDescription className="text-lg text-teal-800">
            Understanding CoinCubs: A Community-First Approach to Learning
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Philosophy Section */}
      <Card className="border-teal-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Our Community-First Philosophy</CardTitle>
              <CardDescription>Why CoinCubs is different from traditional reward systems</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            CoinCubs is designed around a core principle: <strong>collaboration over competition</strong>. Unlike
            traditional classroom economies that focus on individual wealth accumulation, CoinCubs emphasizes
            collective achievement and community building.
          </p>
          <div className="bg-teal-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-teal-900">Key Principles:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">•</span>
                <span className="text-sm">
                  <strong>Shared Success:</strong> 70% of earned ClassGems go to a shared class fund, teaching
                  children that their actions benefit the entire community
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">•</span>
                <span className="text-sm">
                  <strong>No Competition:</strong> There are no leaderboards or rankings. Every child's contribution
                  is valued equally
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">•</span>
                <span className="text-sm">
                  <strong>Democratic Decision-Making:</strong> Students vote together on how to use their shared
                  resources, learning civic engagement
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">•</span>
                <span className="text-sm">
                  <strong>Collective Achievements:</strong> The class earns badges together, celebrating group
                  milestones rather than individual accomplishments
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">What Your Child is Learning</CardTitle>
              <CardDescription>Educational outcomes and life skills being developed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Financial Literacy</h4>
                  <p className="text-sm text-muted-foreground">
                    Understanding saving, value, resource allocation, and delayed gratification through hands-on
                    experience
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Collaboration Skills</h4>
                  <p className="text-sm text-muted-foreground">
                    Learning to work together, value others' contributions, and achieve shared goals as a team
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Goal Setting</h4>
                  <p className="text-sm text-muted-foreground">
                    Setting collective objectives, tracking progress, and celebrating milestones together
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Civic Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    Participating in democratic voting, discussing proposals, and making collective decisions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Empathy & Community Values</h4>
                  <p className="text-sm text-muted-foreground">
                    Recognizing how individual actions impact the group and celebrating peer support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Critical Thinking</h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluating options, considering trade-offs, and making informed choices about resource use
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Current Class Progress</CardTitle>
            <CardDescription>How the class is working together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Class Treasure Total</p>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/assets/generated/classgem-icon.dim_64x64.png"
                  alt="ClassGem"
                  className="w-10 h-10"
                />
                <span className="text-4xl font-bold text-amber-900">{formatGems(totalClassGems)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">ClassGems saved together</p>
            </div>

            {activeGoals.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Active Goals:</h4>
                {activeGoals.slice(0, 3).map((goal) => (
                  <div key={Number(goal.id)} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-muted-foreground">
                        {Math.min(100, Math.floor((Number(goal.currentAmount) * 100) / Number(goal.targetAmount)))}%
                      </span>
                    </div>
                    <Progress value={Math.min(100, Math.floor((Number(goal.currentAmount) * 100) / Number(goal.targetAmount)))} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Class Achievements</CardTitle>
            <CardDescription>Milestones reached together</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements && achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div
                    key={Number(achievement.id)}
                    className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  The class is working toward their first achievements!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Impact */}
      <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 shadow-lg">
        <CardContent className="py-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold text-green-900">Long-Term Educational Impact</h3>
            <p className="text-green-800">
              Research shows that children who learn financial literacy and collaboration skills early develop
              stronger decision-making abilities, better interpersonal relationships, and a greater sense of civic
              responsibility. CoinCubs provides a safe, supportive environment for your child to develop these
              essential life skills while building positive classroom culture.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge variant="secondary" className="text-sm">Financial Literacy</Badge>
              <Badge variant="secondary" className="text-sm">Teamwork</Badge>
              <Badge variant="secondary" className="text-sm">Decision Making</Badge>
              <Badge variant="secondary" className="text-sm">Empathy</Badge>
              <Badge variant="secondary" className="text-sm">Goal Setting</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
