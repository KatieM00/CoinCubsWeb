import { useState, useEffect } from 'react';
import { useGetCurriculumModules, useGetCurrentWeek, useInitializeCurriculum, useStartMondayLesson, useStartFridayLesson, useSkipToWeek, useRestartCurriculum, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Play, RotateCcw, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { CurriculumModule } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function LessonsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: curriculumModules, isLoading: modulesLoading } = useGetCurriculumModules();
  const { data: currentWeek, isLoading: weekLoading } = useGetCurrentWeek();
  const initCurriculum = useInitializeCurriculum();
  const startMonday = useStartMondayLesson();
  const startFriday = useStartFridayLesson();
  const skipWeek = useSkipToWeek();
  const restartCurriculum = useRestartCurriculum();

  useEffect(() => {
    if (!modulesLoading && curriculumModules && curriculumModules.length === 0) {
      initCurriculum.mutate();
    }
  }, [modulesLoading, curriculumModules]);

  const handleStartMondayLesson = async (weekNumber: bigint) => {
    try {
      await startMonday.mutateAsync(weekNumber);
      toast.success('Monday lesson started on Class Display!');
    } catch (error) {
      toast.error('Failed to start lesson');
      console.error(error);
    }
  };

  const handleStartFridayLesson = async (weekNumber: bigint) => {
    try {
      await startFriday.mutateAsync(weekNumber);
      toast.success('Friday lesson started on Class Display!');
    } catch (error) {
      toast.error('Failed to start lesson');
      console.error(error);
    }
  };

  const handleSkipToWeek = async (weekNumber: string) => {
    try {
      await skipWeek.mutateAsync(BigInt(weekNumber));
      toast.success(`Jumped to Week ${weekNumber}`);
    } catch (error) {
      toast.error('Failed to skip to week');
      console.error(error);
    }
  };

  const handleRestartCurriculum = async () => {
    try {
      await restartCurriculum.mutateAsync();
      toast.success('Curriculum restarted successfully!');
    } catch (error) {
      toast.error('Failed to restart curriculum');
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    toast.info('PDF export feature coming soon!');
  };

  if (adminLoading || modulesLoading || weekLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>
            Only teachers can access the Lessons page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentWeekNumber = currentWeek ? Number(currentWeek) : 1;

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 max-w-7xl space-y-6 md:space-y-8">
      {/* Page Header Section */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900">CoinCubs Curriculum</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-blue-700 font-medium">8-Week Financial Literacy Program</p>
      </div>

      {/* Four Lesson Cards in Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {curriculumModules && curriculumModules.length > 0 ? (
          curriculumModules.map((module) => {
            const isCurrent = Number(module.weekNumber) === currentWeekNumber;
            
            return (
              <LessonCard
                key={Number(module.weekNumber)}
                module={module}
                isCurrent={isCurrent}
                onStartMonday={handleStartMondayLesson}
                onStartFriday={handleStartFridayLesson}
                startMondayPending={startMonday.isPending}
                startFridayPending={startFriday.isPending}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>Initializing curriculum...</p>
          </div>
        )}
      </div>

      {/* Curriculum Controls Section */}
      <Card className="shadow-xl bg-gradient-to-br from-gray-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-purple-900">Curriculum Controls</CardTitle>
          <CardDescription>Navigate, restart, or export lesson plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Week Navigation Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Jump to Week</label>
              <Select onValueChange={handleSkipToWeek} disabled={skipWeek.isPending}>
                <SelectTrigger className="h-11 md:h-12 text-base">
                  <SelectValue placeholder="Select week..." />
                </SelectTrigger>
                <SelectContent>
                  {curriculumModules?.map((module) => (
                    <SelectItem key={Number(module.weekNumber)} value={String(module.weekNumber)}>
                      Week {Number(module.weekNumber)}: {module.moduleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Restart Curriculum */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Reset Progress</label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-11 md:h-12 text-base" disabled={restartCurriculum.isPending}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart Curriculum
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restart Curriculum?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset the curriculum to Week 1 and mark all modules as incomplete. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestartCurriculum} className="bg-red-600 hover:bg-red-700">
                      Restart Curriculum
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Export PDF */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Export</label>
              <Button variant="outline" className="w-full h-11 md:h-12 text-base" onClick={handleExportPDF}>
                <FileDown className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Lesson Card Component with Expandable Sections
function LessonCard({ 
  module, 
  isCurrent,
  onStartMonday,
  onStartFriday,
  startMondayPending,
  startFridayPending
}: { 
  module: CurriculumModule;
  isCurrent: boolean;
  onStartMonday: (weekNumber: bigint) => void;
  onStartFriday: (weekNumber: bigint) => void;
  startMondayPending: boolean;
  startFridayPending: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`border-2 transition-all ${
        isCurrent
          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
          : 'border-blue-300 bg-white hover:shadow-md'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                isCurrent ? 'bg-purple-600' : 'bg-blue-500'
              }`}>
                <span className="text-white font-bold text-sm md:text-base">{Number(module.weekNumber)}</span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg md:text-xl leading-tight">{module.moduleName}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-sm">
              20 min/week (10 min Monday + 10 min Friday)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Learning Objectives */}
        <div className="p-3 bg-white rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2 text-sm">Learning Objectives:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {module.learningObjectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Expandable Full Lesson Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-11 md:h-12 text-sm md:text-base font-semibold bg-gray-50 hover:bg-gray-100 border-gray-300"
            >
              <span>View Full Lesson Details</span>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {/* Monday Lesson Details */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              <h4 className="font-bold text-blue-900 flex items-center gap-2">
                <span className="text-lg">📘</span>
                {module.mondayLesson.title}
              </h4>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Teacher Script:</p>
                <p className="text-sm text-gray-700 italic">{module.mondayLesson.teacherScript}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Discussion Questions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {module.mondayLesson.discussionQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              {module.mondayLesson.activities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Activities:</p>
                  {module.mondayLesson.activities.map((activity, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white rounded border border-blue-100">
                      <p className="text-sm font-medium text-blue-900">{activity.name}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friday Lesson Details */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
              <h4 className="font-bold text-orange-900 flex items-center gap-2">
                <span className="text-lg">🎉</span>
                {module.fridayLesson.title}
              </h4>
              <div>
                <p className="text-sm font-semibold text-orange-800 mb-1">Teacher Script:</p>
                <p className="text-sm text-gray-700 italic">{module.fridayLesson.teacherScript}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-800 mb-1">Discussion Questions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {module.fridayLesson.discussionQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              {module.fridayLesson.activities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-orange-800 mb-1">Activities:</p>
                  {module.fridayLesson.activities.map((activity, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white rounded border border-orange-100">
                      <p className="text-sm font-medium text-orange-900">{activity.name}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            size="lg"
            className="h-11 md:h-14 text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-md"
            onClick={() => onStartMonday(module.weekNumber)}
            disabled={startMondayPending}
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {startMondayPending ? 'Starting...' : 'START MONDAY LESSON'}
          </Button>

          <Button
            size="lg"
            className="h-11 md:h-14 text-sm md:text-base font-bold bg-orange-600 hover:bg-orange-700 shadow-md"
            onClick={() => onStartFriday(module.weekNumber)}
            disabled={startFridayPending}
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {startFridayPending ? 'Starting...' : 'START FRIDAY LESSON'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
