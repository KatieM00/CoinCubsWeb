import { createContext, useContext, useState, ReactNode } from 'react'

export type DemoRole = 'teacher' | 'parent' | null

interface DemoContextValue {
  isDemoMode: boolean
  demoRole: DemoRole
  enterDemoMode: (role: DemoRole) => void
  exitDemoMode: () => void
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoRole, setDemoRole] = useState<DemoRole>(null)

  const enterDemoMode = (role: DemoRole) => {
    setIsDemoMode(true)
    setDemoRole(role)
    console.log(`Entering demo mode as ${role}`)
  }

  const exitDemoMode = () => {
    setIsDemoMode(false)
    setDemoRole(null)
    console.log('Exiting demo mode')
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, demoRole, enterDemoMode, exitDemoMode }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
