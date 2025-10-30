// Local type definitions to replace blockchain types
export type AwardSplit =
  | 'defaultSplit'    // 70% class, 30% student
  | 'allToClassFund'  // 100% class
  | 'allToStudent'    // 100% student

export type VoteOption = {
  name: string
  voteCount: number
}

export type CurriculumModule = {
  weekNumber: number
  title: string
  description: string
  mondayLesson: string
  fridayLesson: string
  isCompleted: boolean
}
