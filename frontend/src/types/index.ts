// Local type definitions to replace blockchain types
export type AwardSplit =
  | 'defaultSplit'    // 70% class, 30% student
  | 'allToClassFund'  // 100% class
  | 'allToStudent'    // 100% student

export type VoteOption = {
  name: string
  voteCount: number
}

export type LessonActivity = {
  name: string
  description: string
}

export type Lesson = {
  title: string
  teacherScript: string
  discussionQuestions: string[]
  activities: LessonActivity[]
}

export type CurriculumModule = {
  weekNumber: number
  moduleName: string
  learningObjectives: string[]
  mondayLesson: Lesson
  fridayLesson: Lesson
  isCompleted?: boolean
}

export type LessonCompletion = {
  weekNumber: number
  dayType: 'monday' | 'friday'
  completedAt: string // ISO date string
  notes: string
  teacherId: string
}

// Class Bank Transaction types
export type ClassTransactionType = 'award' | 'interest' | 'expense' | 'shopPurchase' | 'adjustment'

export type ClassTransaction = {
  id: string
  transactionType: ClassTransactionType
  amount: number // Positive for income, negative for expenses
  reference: string
  category?: string
  balanceAfter: number
  timestamp: string // ISO date string
  relatedItemId?: string
}
