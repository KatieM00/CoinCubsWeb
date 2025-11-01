import { createContext, useContext, useState, ReactNode } from 'react'

// Demo data types matching the actual data structures from the backend
export interface DemoStudent {
  id: bigint
  name: string
  personalBalance: bigint
  classContribution: bigint
}

export interface DemoClassGoal {
  id: bigint
  name: string
  description: string
  targetAmount: bigint
  currentAmount: bigint
  isActive: boolean
}

export interface DemoTransaction {
  id: bigint
  amount: bigint
  description: string
  timestamp: bigint
}

export interface DemoActivityMessage {
  message: string
  isCelebration: boolean
  isWholeClassAward: boolean
}

export interface DemoWeeklyStats {
  classFundBalance: bigint
  studentsContributed: bigint
  totalStudents: bigint
  totalCubCoinsEarned: bigint
}

export interface DemoDataContextValue {
  students: DemoStudent[]
  classGoals: DemoClassGoal[]
  classFundBalance: bigint
  transactions: DemoTransaction[]
  activityTicker: DemoActivityMessage[]
  weeklyStats: DemoWeeklyStats
  lastAwardedStudents: Array<{ studentId: bigint; reason: string; amount: bigint }>
  currentWeek: bigint
  presetAmounts: bigint[]
  presetReasons: string[]

  // Mutation helpers
  awardStudent: (studentId: bigint, amount: bigint, reason: string) => void
  createGoal: (name: string, description: string, targetAmount: bigint) => void
  contributeToGoal: (goalId: bigint, amount: bigint) => void
  resetDemoData: () => void
}

const DemoDataContext = createContext<DemoDataContextValue | undefined>(undefined)

// Generate realistic demo data
const generateInitialData = () => {
  const studentNames = [
    'Emma Johnson', 'Liam Smith', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
    'Ethan Garcia', 'Sophia Martinez', 'Mason Rodriguez', 'Isabella Davis', 'William Miller',
    'Mia Wilson', 'James Moore', 'Charlotte Taylor', 'Benjamin Anderson', 'Amelia Thomas',
    'Lucas Jackson', 'Harper White', 'Henry Harris', 'Evelyn Martin', 'Alexander Thompson',
    'Abigail Lee', 'Michael Walker', 'Emily Hall', 'Daniel Allen', 'Elizabeth Young'
  ]

  const students: DemoStudent[] = studentNames.map((name, index) => ({
    id: BigInt(index + 1),
    name,
    personalBalance: BigInt(Math.floor(Math.random() * 300) + 50),
    classContribution: BigInt(Math.floor(Math.random() * 150) + 20)
  }))

  const classGoals: DemoClassGoal[] = [
    {
      id: BigInt(1),
      name: 'Class Pizza Party',
      description: 'Earn a pizza party for the whole class!',
      targetAmount: BigInt(2000),
      currentAmount: BigInt(1650),
      isActive: true
    },
    {
      id: BigInt(2),
      name: 'Field Trip to Science Museum',
      description: 'Fund our trip to the science museum',
      targetAmount: BigInt(5000),
      currentAmount: BigInt(3200),
      isActive: true
    },
    {
      id: BigInt(3),
      name: 'New Classroom Library Books',
      description: 'Buy new books for our reading corner',
      targetAmount: BigInt(1500),
      currentAmount: BigInt(800),
      isActive: true
    },
    {
      id: BigInt(4),
      name: 'Outdoor Games Equipment',
      description: 'Get new equipment for recess',
      targetAmount: BigInt(3000),
      currentAmount: BigInt(3000),
      isActive: false
    }
  ]

  const now = BigInt(Date.now())
  const transactions: DemoTransaction[] = [
    {
      id: BigInt(1),
      amount: BigInt(250),
      description: 'Class contribution from awards',
      timestamp: now - BigInt(3600000 * 24) // 1 day ago
    },
    {
      id: BigInt(2),
      amount: BigInt(180),
      description: 'Whole class milestone bonus',
      timestamp: now - BigInt(3600000 * 48) // 2 days ago
    },
    {
      id: BigInt(3),
      amount: BigInt(320),
      description: 'Weekly participation awards',
      timestamp: now - BigInt(3600000 * 120) // 5 days ago
    }
  ]

  const activityTicker: DemoActivityMessage[] = [
    {
      message: '🎉 Emma earned 25 CubCoins for helping a classmate!',
      isCelebration: true,
      isWholeClassAward: false
    },
    {
      message: '⭐ Class earned 50 CubCoins for excellent listening!',
      isCelebration: true,
      isWholeClassAward: true
    },
    {
      message: '🌟 Liam earned 30 CubCoins for completing all homework!',
      isCelebration: true,
      isWholeClassAward: false
    },
    {
      message: '🎊 Whole class earned 100 CubCoins for perfect attendance!',
      isCelebration: true,
      isWholeClassAward: true
    }
  ]

  const lastAwardedStudents = [
    { studentId: BigInt(1), reason: 'Helping a classmate', amount: BigInt(25) },
    { studentId: BigInt(3), reason: 'Excellent participation', amount: BigInt(20) },
    { studentId: BigInt(7), reason: 'Great teamwork', amount: BigInt(30) }
  ]

  return {
    students,
    classGoals,
    classFundBalance: BigInt(4850),
    transactions,
    activityTicker,
    lastAwardedStudents,
    currentWeek: BigInt(6),
    presetAmounts: [BigInt(10), BigInt(25), BigInt(50), BigInt(100)],
    presetReasons: [
      'Excellent participation',
      'Helping a classmate',
      'Great teamwork',
      'Outstanding effort',
      'Respectful behavior',
      'Completing all homework',
      'Asking great questions'
    ]
  }
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const initialData = generateInitialData()
  const [students, setStudents] = useState(initialData.students)
  const [classGoals, setClassGoals] = useState(initialData.classGoals)
  const [classFundBalance, setClassFundBalance] = useState(initialData.classFundBalance)
  const [transactions, setTransactions] = useState(initialData.transactions)
  const [activityTicker, setActivityTicker] = useState(initialData.activityTicker)
  const [lastAwardedStudents, setLastAwardedStudents] = useState(initialData.lastAwardedStudents)

  const weeklyStats: DemoWeeklyStats = {
    classFundBalance,
    studentsContributed: BigInt(students.filter(s => s.classContribution > 0).length),
    totalStudents: BigInt(students.length),
    totalCubCoinsEarned: students.reduce((sum, s) => sum + s.personalBalance, BigInt(0))
  }

  const awardStudent = (studentId: bigint, amount: bigint, reason: string) => {
    // Update student balance
    setStudents(prev => prev.map(s =>
      s.id === studentId
        ? { ...s, personalBalance: s.personalBalance + amount, classContribution: s.classContribution + (amount / BigInt(4)) }
        : s
    ))

    // Update class fund (25% of award goes to class)
    const classContribution = amount / BigInt(4)
    setClassFundBalance(prev => prev + classContribution)

    // Add to activity ticker
    const student = students.find(s => s.id === studentId)
    if (student) {
      setActivityTicker(prev => [
        {
          message: `🌟 ${student.name} earned ${amount.toString()} CubCoins for ${reason.toLowerCase()}!`,
          isCelebration: true,
          isWholeClassAward: false
        },
        ...prev.slice(0, 9) // Keep last 10 messages
      ])
    }

    // Update last awarded
    setLastAwardedStudents(prev => [
      { studentId, reason, amount },
      ...prev.slice(0, 2) // Keep last 3
    ])

    // Add transaction
    setTransactions(prev => [
      {
        id: BigInt(prev.length + 1),
        amount: classContribution,
        description: `Class contribution from award to ${student?.name}`,
        timestamp: BigInt(Date.now())
      },
      ...prev
    ])
  }

  const createGoal = (name: string, description: string, targetAmount: bigint) => {
    const newGoal: DemoClassGoal = {
      id: BigInt(classGoals.length + 1),
      name,
      description,
      targetAmount,
      currentAmount: BigInt(0),
      isActive: true
    }
    setClassGoals(prev => [...prev, newGoal])
  }

  const contributeToGoal = (goalId: bigint, amount: bigint) => {
    setClassGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? { ...goal, currentAmount: goal.currentAmount + amount }
        : goal
    ))
  }

  const resetDemoData = () => {
    const newData = generateInitialData()
    setStudents(newData.students)
    setClassGoals(newData.classGoals)
    setClassFundBalance(newData.classFundBalance)
    setTransactions(newData.transactions)
    setActivityTicker(newData.activityTicker)
    setLastAwardedStudents(newData.lastAwardedStudents)
  }

  return (
    <DemoDataContext.Provider
      value={{
        students,
        classGoals,
        classFundBalance,
        transactions,
        activityTicker,
        weeklyStats,
        lastAwardedStudents,
        currentWeek: initialData.currentWeek,
        presetAmounts: initialData.presetAmounts,
        presetReasons: initialData.presetReasons,
        awardStudent,
        createGoal,
        contributeToGoal,
        resetDemoData
      }}
    >
      {children}
    </DemoDataContext.Provider>
  )
}

export function useDemoData() {
  const context = useContext(DemoDataContext)
  if (context === undefined) {
    throw new Error('useDemoData must be used within a DemoDataProvider')
  }
  return context
}
