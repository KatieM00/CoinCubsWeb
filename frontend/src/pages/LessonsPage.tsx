// @ts-nocheck
import { useState, useEffect } from 'react';
import { useGetCurriculumModules, useGetCurrentWeek, useInitializeCurriculum, useStartMondayLesson, useStartFridayLesson, useSkipToWeek, useRestartCurriculum, useGetLessonCompletions, useUpdateLessonNotes } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useAdminCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Play, RotateCcw, FileDown, ChevronDown, ChevronUp, CheckCircle2, FileText, Eye, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { CurriculumModule, LessonCompletion } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

export default function LessonsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: curriculumModules, isLoading: modulesLoading } = useGetCurriculumModules();
  const { data: currentWeek, isLoading: weekLoading } = useGetCurrentWeek();
  const { data: lessonCompletions = [] } = useGetLessonCompletions();
  const initCurriculum = useInitializeCurriculum();
  const startMonday = useStartMondayLesson();
  const startFriday = useStartFridayLesson();
  const skipWeek = useSkipToWeek();
  const restartCurriculum = useRestartCurriculum();
  const updateNotes = useUpdateLessonNotes();

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

  const handleExportAllPDF = () => {
    if (lessonCompletions.length === 0) {
      toast.error('No completed lessons to export');
      return;
    }

    // Sort completions by week and day
    const sortedCompletions = [...lessonCompletions].sort((a, b) =>
      a.weekNumber - b.weekNumber || (a.dayType === 'monday' ? -1 : 1)
    );

    // Create printable HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to export PDF');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>All Lesson Notes - CoinCubs Curriculum</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #7C3AED;
              border-bottom: 3px solid #7C3AED;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            .lesson-note {
              margin-bottom: 30px;
              padding: 20px;
              border: 2px solid #E5E7EB;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .lesson-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 15px;
            }
            .lesson-title {
              font-size: 18px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 5px;
            }
            .lesson-meta {
              font-size: 14px;
              color: #6B7280;
            }
            .lesson-date {
              font-size: 12px;
              color: #9CA3AF;
              text-align: right;
            }
            .lesson-notes {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #E5E7EB;
              line-height: 1.6;
              white-space: pre-wrap;
            }
            .no-notes {
              font-style: italic;
              color: #9CA3AF;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
              text-align: center;
              color: #6B7280;
              font-size: 12px;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <h1>📚 CoinCubs Curriculum - All Lesson Notes</h1>
          ${sortedCompletions.map((completion) => {
            const module = curriculumModules?.find(m => Number(m.weekNumber) === completion.weekNumber);
            const lesson = completion.dayType === 'monday' ? module?.mondayLesson : module?.fridayLesson;
            const date = new Date(completion.completedAt);

            return `
              <div class="lesson-note">
                <div class="lesson-header">
                  <div>
                    <div class="lesson-title">${lesson?.title || 'Lesson'}</div>
                    <div class="lesson-meta">
                      Week ${completion.weekNumber} • ${completion.dayType.charAt(0).toUpperCase() + completion.dayType.slice(1)}
                      ${module ? ` • ${module.moduleName}` : ''}
                    </div>
                  </div>
                  <div class="lesson-date">
                    Completed: ${date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div class="lesson-notes">
                  ${completion.notes ? completion.notes : '<span class="no-notes">No notes recorded</span>'}
                </div>
              </div>
            `;
          }).join('')}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };

    toast.success('Opening print dialog...');
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
            const mondayCompletion = lessonCompletions.find(
              (c: LessonCompletion) => c.weekNumber === Number(module.weekNumber) && c.dayType === 'monday'
            );
            const fridayCompletion = lessonCompletions.find(
              (c: LessonCompletion) => c.weekNumber === Number(module.weekNumber) && c.dayType === 'friday'
            );

            return (
              <LessonCard
                key={Number(module.weekNumber)}
                module={module}
                isCurrent={isCurrent}
                mondayCompletion={mondayCompletion}
                fridayCompletion={fridayCompletion}
                onStartMonday={handleStartMondayLesson}
                onStartFriday={handleStartFridayLesson}
                startMondayPending={startMonday.isPending}
                startFridayPending={startFriday.isPending}
                updateNotes={updateNotes}
                curriculumModules={curriculumModules}
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

            {/* Export All Lesson Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Export Notes</label>
              <Button
                variant="outline"
                className="w-full h-11 md:h-12 text-base"
                onClick={handleExportAllPDF}
                disabled={lessonCompletions.length === 0}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export All Notes ({lessonCompletions.length})
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
  mondayCompletion,
  fridayCompletion,
  onStartMonday,
  onStartFriday,
  startMondayPending,
  startFridayPending,
  updateNotes,
  curriculumModules
}: {
  module: CurriculumModule;
  isCurrent: boolean;
  mondayCompletion?: LessonCompletion;
  fridayCompletion?: LessonCompletion;
  onStartMonday: (weekNumber: bigint) => void;
  onStartFriday: (weekNumber: bigint) => void;
  startMondayPending: boolean;
  startFridayPending: boolean;
  updateNotes: any;
  curriculumModules: CurriculumModule[] | undefined;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'monday' | 'friday' | null>(null);
  const [editedNotes, setEditedNotes] = useState('');

  const handleViewNotes = (dayType: 'monday' | 'friday') => {
    const completion = dayType === 'monday' ? mondayCompletion : fridayCompletion;
    setSelectedDay(dayType);
    setEditedNotes(completion?.notes || '');
    setShowNotesDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedDay) return;

    try {
      await updateNotes.mutateAsync({
        weekNumber: Number(module.weekNumber),
        dayType: selectedDay,
        notes: editedNotes,
      });
      toast.success('Notes updated successfully');
      setShowNotesDialog(false);
      setSelectedDay(null);
      setEditedNotes('');
    } catch (error) {
      toast.error('Failed to update notes');
      console.error(error);
    }
  };

  const handleExportLesson = (dayType: 'monday' | 'friday') => {
    const completion = dayType === 'monday' ? mondayCompletion : fridayCompletion;
    if (!completion) {
      toast.error('This lesson has not been completed yet');
      return;
    }

    const lesson = dayType === 'monday' ? module.mondayLesson : module.fridayLesson;
    const date = new Date(completion.completedAt);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to export PDF');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lesson.title} - Notes</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
            h1 { color: #7C3AED; border-bottom: 3px solid #7C3AED; padding-bottom: 10px; margin-bottom: 30px; }
            .meta { color: #6B7280; font-size: 14px; margin-bottom: 20px; }
            .notes { margin-top: 20px; padding: 20px; border: 2px solid #E5E7EB; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; }
            .no-notes { font-style: italic; color: #9CA3AF; }
            @media print { body { margin: 0; padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>📚 ${lesson.title}</h1>
          <div class="meta">
            Week ${Number(module.weekNumber)} • ${dayType.charAt(0).toUpperCase() + dayType.slice(1)} • ${module.moduleName}<br>
            Completed: ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div class="notes">
            <strong>Notes:</strong><br><br>
            ${completion.notes || '<span class="no-notes">No notes recorded</span>'}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => setTimeout(() => printWindow.print(), 250);
    toast.success('Opening print dialog...');
  };

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
          <div className="space-y-2">
            <div className="relative">
              <Button
                size="lg"
                className="h-11 md:h-14 text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-md w-full"
                onClick={() => onStartMonday(module.weekNumber)}
                disabled={startMondayPending}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {startMondayPending ? 'Starting...' : 'START MONDAY LESSON'}
              </Button>
              {mondayCompletion && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>
            {mondayCompletion && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleViewNotes('monday')}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleExportLesson('monday')}
                >
                  <FileDown className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            )}
            {mondayCompletion?.notes && (
              <p className="text-xs text-gray-600 italic truncate" title={mondayCompletion.notes}>
                Note: {mondayCompletion.notes}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Button
                size="lg"
                className="h-11 md:h-14 text-sm md:text-base font-bold bg-orange-600 hover:bg-orange-700 shadow-md w-full"
                onClick={() => onStartFriday(module.weekNumber)}
                disabled={startFridayPending}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {startFridayPending ? 'Starting...' : 'START FRIDAY LESSON'}
              </Button>
              {fridayCompletion && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>
            {fridayCompletion && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleViewNotes('friday')}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleExportLesson('friday')}
                >
                  <FileDown className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            )}
            {fridayCompletion?.notes && (
              <p className="text-xs text-gray-600 italic truncate" title={fridayCompletion.notes}>
                Note: {fridayCompletion.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lesson Notes</DialogTitle>
            <DialogDescription className="text-base">
              {selectedDay && `Week ${Number(module.weekNumber)} • ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} • ${module.moduleName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-semibold">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any observations, student reactions, or reminders for next time..."
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="min-h-[200px] text-base"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNotesDialog(false);
                setSelectedDay(null);
                setEditedNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNotes}
              disabled={updateNotes.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {updateNotes.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
