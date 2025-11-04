// @ts-nocheck
import { useState } from 'react';
import { useGetLessonCompletions, useGetCurriculumModules, useIsCallerAdmin, useUpdateLessonNotes } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileDown, BookOpen, Calendar, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { LessonCompletion } from '../types';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function LessonNotesPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: lessonCompletions = [], isLoading: completionsLoading } = useGetLessonCompletions();
  const { data: curriculumModules, isLoading: modulesLoading } = useGetCurriculumModules();
  const updateNotes = useUpdateLessonNotes();

  const [editingCompletion, setEditingCompletion] = useState<LessonCompletion | null>(null);
  const [editedNotes, setEditedNotes] = useState('');

  const handleEditNotes = (completion: LessonCompletion) => {
    setEditingCompletion(completion);
    setEditedNotes(completion.notes);
  };

  const handleSaveNotes = async () => {
    if (!editingCompletion) return;

    try {
      await updateNotes.mutateAsync({
        weekNumber: editingCompletion.weekNumber,
        dayType: editingCompletion.dayType,
        notes: editedNotes,
      });
      toast.success('Notes updated successfully');
      setEditingCompletion(null);
      setEditedNotes('');
    } catch (error) {
      toast.error('Failed to update notes');
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    // Generate PDF content
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
          <title>Lesson Notes - CoinCubs Curriculum</title>
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
          <h1>📚 CoinCubs Curriculum - Lesson Notes</h1>
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

  if (adminLoading || completionsLoading || modulesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>
            Only teachers can access the Lesson Notes page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Sort completions by week and day
  const sortedCompletions = [...lessonCompletions].sort((a, b) =>
    a.weekNumber - b.weekNumber || (a.dayType === 'monday' ? -1 : 1)
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 max-w-7xl space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900">Lesson Notes</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-blue-700 font-medium">
          Review and manage your teaching notes
        </p>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportPDF}
          disabled={sortedCompletions.length === 0}
          size="lg"
          className="h-12 px-6 text-base font-bold bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Export to PDF
        </Button>
      </div>

      {/* Lesson Notes List */}
      {sortedCompletions.length === 0 ? (
        <Card className="shadow-xl">
          <CardContent className="py-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Lesson Notes Yet</h3>
            <p className="text-gray-500">
              Complete lessons and add notes to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedCompletions.map((completion) => {
            const module = curriculumModules?.find(m => Number(m.weekNumber) === completion.weekNumber);
            const lesson = completion.dayType === 'monday' ? module?.mondayLesson : module?.fridayLesson;
            const date = new Date(completion.completedAt);

            return (
              <Card key={`${completion.weekNumber}-${completion.dayType}`} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {completion.weekNumber}
                        </div>
                        <div>
                          <CardTitle className="text-lg md:text-xl">
                            {lesson?.title || 'Lesson'}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {completion.dayType === 'monday' ? 'Monday' : 'Friday'} • {module?.moduleName}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNotes(completion)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {completion.notes ? (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                        {completion.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-400 italic">No notes recorded for this lesson</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={!!editingCompletion} onOpenChange={() => setEditingCompletion(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Lesson Notes</DialogTitle>
            <DialogDescription className="text-base">
              Update your notes for this lesson.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingCompletion && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-purple-900">
                  <span className="text-2xl">📚</span>
                  <span>
                    Week {editingCompletion.weekNumber} • {editingCompletion.dayType === 'monday' ? 'Monday' : 'Friday'}
                  </span>
                </div>
              </div>
            )}
            <Textarea
              placeholder="Add any observations, student reactions, or reminders for next time..."
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="min-h-[200px] text-base"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingCompletion(null);
                setEditedNotes('');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNotes}
              disabled={updateNotes.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateNotes.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
