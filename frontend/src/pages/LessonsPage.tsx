// @ts-nocheck
import { useState, useEffect } from 'react';
import { useIsCallerAdmin, useGetCurriculumModules, useGetCurrentWeek, useInitializeCurriculum, useStartMondayLesson, useStartFridayLesson, useSkipToWeek, useRestartCurriculum, useGetLessonCompletions, useUpdateLessonNotes } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// lucide-react removed
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
      {/* Lesson Cards in Responsive Grid */}
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
      <Card className="shadow-xl bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-[#3E2723]">Curriculum Controls</CardTitle>
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
                    🔄
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
                📥
                Export All Notes ({lessonCompletions.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Printable Lesson Plan Modal Component
function PrintableLessonPlan({
  lesson,
  module,
  dayType,
  lessonNumber,
  onClose
}: {
  lesson: any;
  module: CurriculumModule;
  dayType: 'monday' | 'friday';
  lessonNumber: number;
  onClose: () => void;
}) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to print lesson plan');
      return;
    }

    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lesson Plan - ${lesson.title}</title>
          <style>
            @page { margin: 2cm; }
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; }
            .lesson-header { text-align: center; border-bottom: 3px solid #7C3AED; padding-bottom: 20px; margin-bottom: 20px; }
            .lesson-header h1 { font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #7C3AED; }
            .top-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px; }
            .second-row { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-bottom: 20px; }
            .field { background: #f5f5f5; padding: 10px; border-radius: 6px; border: 1px solid #ddd; }
            .field-label { font-weight: bold; font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
            .field-value { font-size: 14px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; font-size: 16px; color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 5px; margin-bottom: 10px; }
            .section-content { background: #fafafa; padding: 15px; border-radius: 6px; border: 1px solid #e0e0e0; }
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            ul { margin: 0; padding-left: 20px; }
            li { margin-bottom: 5px; }
            .structure-content { white-space: pre-line; }
            @media print { body { margin: 0; padding: 0; } .no-print { display: none !important; } }
          </style>
        </head>
        <body>
          <div class="lesson-header">
            <h1>LESSON PLAN</h1>
            <div style="font-size: 14px; color: #666;">Week ${module.weekNumber} - ${dayType.charAt(0).toUpperCase() + dayType.slice(1)} Lesson</div>
          </div>
          <div class="top-row">
            <div class="field"><div class="field-label">Grade</div><div class="field-value">${lesson.grade || 'Year 3-6 (Ages 7-12)'}</div></div>
            <div class="field"><div class="field-label">Subject</div><div class="field-value">${lesson.subject || 'Financial Literacy'}</div></div>
            <div class="field"><div class="field-label">Date</div><div class="field-value">${today}</div></div>
          </div>
          <div class="second-row">
            <div class="field"><div class="field-label">Topic</div><div class="field-value">${lesson.title}</div></div>
            <div class="field"><div class="field-label">Lesson #</div><div class="field-value">${lessonNumber}</div></div>
          </div>
          <div class="section">
            <div class="section-title">Lesson Focus and Goals</div>
            <div class="section-content">${lesson.lessonFocus || lesson.teacherScript}</div>
          </div>
          <div class="two-column">
            <div class="section">
              <div class="section-title">Materials Needed</div>
              <div class="section-content"><ul>${(lesson.materials || ['Class Display', 'Whiteboard', 'Discussion materials']).map((m: string) => `<li>${m}</li>`).join('')}</ul></div>
            </div>
            <div class="section">
              <div class="section-title">Learning Objectives</div>
              <div class="section-content"><ul>${(lesson.objectives || module.learningObjectives).map((obj: string) => `<li>${obj}</li>`).join('')}</ul></div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Structure/Activity</div>
            <div class="section-content structure-content">${lesson.structure || `Teacher Script: ${lesson.teacherScript}\\n\\nDiscussion Questions:\\n${lesson.discussionQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\\n')}\\n\\nActivities:\\n${lesson.activities.map((a: { name: string; description: string }) => `- ${a.name}: ${a.description}`).join('\\n')}`}</div>
          </div>
          <div class="section">
            <div class="section-title">Assessment</div>
            <div class="section-content">${lesson.assessment || `Observe student participation in discussions. Check understanding through responses to questions.`}</div>
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Lesson Plan</DialogTitle>
              <DialogDescription>Week {module.weekNumber} - {dayType.charAt(0).toUpperCase() + dayType.slice(1)} Lesson</DialogDescription>
            </div>
            <Button onClick={handlePrint} className="gap-2">🖨️ Print Lesson Plan</Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg"><Label className="text-xs font-bold uppercase text-gray-500">Grade</Label><div className="text-sm font-medium">{lesson.grade || 'Year 3-6 (Ages 7-12)'}</div></div>
            <div className="bg-gray-50 p-3 rounded-lg"><Label className="text-xs font-bold uppercase text-gray-500">Subject</Label><div className="text-sm font-medium">{lesson.subject || 'Financial Literacy'}</div></div>
            <div className="bg-gray-50 p-3 rounded-lg"><Label className="text-xs font-bold uppercase text-gray-500">Date</Label><div className="text-sm font-medium">{new Date().toLocaleDateString('en-GB')}</div></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-gray-50 p-3 rounded-lg"><Label className="text-xs font-bold uppercase text-gray-500">Topic</Label><div className="text-sm font-medium">{lesson.title}</div></div>
            <div className="bg-gray-50 p-3 rounded-lg"><Label className="text-xs font-bold uppercase text-gray-500">Lesson #</Label><div className="text-sm font-medium">{lessonNumber}</div></div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E2723] border-b-2 border-[#DDB76F] pb-1 mb-3">Lesson Focus and Goals</h3>
            <div className="bg-[#FFF8E7] p-4 rounded-lg text-sm">{lesson.lessonFocus || lesson.teacherScript}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-bold text-[#3E2723] border-b-2 border-[#DDB76F] pb-1 mb-3">Materials Needed</h3>
              <div className="bg-[#E8C391]/20 p-4 rounded-lg text-sm">
                <ul className="list-disc list-inside space-y-1">{(lesson.materials || ['Class Display', 'Whiteboard', 'Discussion materials']).map((m: string, i: number) => (<li key={i}>{m}</li>))}</ul>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#3E2723] border-b-2 border-[#DDB76F] pb-1 mb-3">Learning Objectives</h3>
              <div className="bg-green-50 p-4 rounded-lg text-sm">
                <ul className="list-disc list-inside space-y-1">{(lesson.objectives || module.learningObjectives).map((obj: string, i: number) => (<li key={i}>{obj}</li>))}</ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E2723] border-b-2 border-[#DDB76F] pb-1 mb-3">Structure/Activity</h3>
            <div className="bg-amber-50 p-4 rounded-lg text-sm whitespace-pre-line">{lesson.structure || `Teacher Script: ${lesson.teacherScript}\n\nDiscussion Questions:\n${lesson.discussionQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\nActivities:\n${lesson.activities.map((a: { name: string; description: string }) => `- ${a.name}: ${a.description}`).join('\n')}`}</div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E2723] border-b-2 border-[#DDB76F] pb-1 mb-3">Assessment</h3>
            <div className="bg-orange-50 p-4 rounded-lg text-sm">{lesson.assessment || `Observe student participation in discussions. Check understanding through responses to questions.`}</div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [showLessonPlan, setShowLessonPlan] = useState<'monday' | 'friday' | null>(null);

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
          ? 'border-[#DDB76F] bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 shadow-lg'
          : 'border-[#E8C391] bg-white hover:shadow-md'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                isCurrent ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-orange-400'
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
        <div className="p-3 bg-white rounded-lg border border-[#E8C391]">
          <h4 className="font-semibold text-[#3E2723] mb-2 text-sm">Learning Objectives:</h4>
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
              {isExpanded ? <span>⬆️</span> : <span>⬇️</span>}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {/* Monday Lesson Details */}
            <div className="p-4 bg-[#FFF8E7] rounded-lg border border-[#E8C391] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#3E2723] flex items-center gap-2">
                  <span className="text-lg">📘</span>
                  {module.mondayLesson.title}
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs bg-white"
                  onClick={() => setShowLessonPlan('monday')}
                >
                  📄 View Lesson Plan
                </Button>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#5D4037] mb-1">Teacher Script:</p>
                <p className="text-sm text-gray-700 italic">{module.mondayLesson.teacherScript}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#5D4037] mb-1">Discussion Questions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {module.mondayLesson.discussionQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              {module.mondayLesson.activities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#5D4037] mb-1">Activities:</p>
                  {module.mondayLesson.activities.map((activity, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white rounded border border-[#E8C391]/50">
                      <p className="text-sm font-medium text-[#3E2723]">{activity.name}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friday Lesson Details */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-orange-900 flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  {module.fridayLesson.title}
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs bg-white"
                  onClick={() => setShowLessonPlan('friday')}
                >
                  📄 View Lesson Plan
                </Button>
              </div>
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
                className="h-11 md:h-14 text-sm md:text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md w-full"
                onClick={() => onStartMonday(module.weekNumber)}
                disabled={startMondayPending}
              >
                ▶️
                {startMondayPending ? 'Starting...' : 'START MONDAY LESSON'}
              </Button>
              {mondayCompletion && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  ✅
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
                  👁️
                  View Notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleExportLesson('monday')}
                >
                  📥
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
                className="h-11 md:h-14 text-sm md:text-base font-bold bg-[#DDB76F] hover:bg-[#E8C391] text-[#3E2723] shadow-md w-full"
                onClick={() => onStartFriday(module.weekNumber)}
                disabled={startFridayPending}
              >
                ▶️
                {startFridayPending ? 'Starting...' : 'START FRIDAY LESSON'}
              </Button>
              {fridayCompletion && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  ✅
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
                  👁️
                  View Notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => handleExportLesson('friday')}
                >
                  📥
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
              ✏️
              {updateNotes.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Printable Lesson Plan Modal */}
      {showLessonPlan && (
        <PrintableLessonPlan
          lesson={showLessonPlan === 'monday' ? module.mondayLesson : module.fridayLesson}
          module={module}
          dayType={showLessonPlan}
          lessonNumber={Number(module.weekNumber) * 2 - (showLessonPlan === 'monday' ? 1 : 0)}
          onClose={() => setShowLessonPlan(null)}
        />
      )}
    </Card>
  );
}
