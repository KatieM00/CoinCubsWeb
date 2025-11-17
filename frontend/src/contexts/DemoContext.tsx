import { createContext, useContext, useState, ReactNode } from 'react'
import { DemoDataProvider } from './DemoDataContext'

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
    console.log(`Entering demo mode as ${role}`)
    setIsDemoMode(true)
    setDemoRole(role)
    // Navigation will happen in the component that calls this
    // since this context is outside the router
  }

  const exitDemoMode = () => {
    setIsDemoMode(false)
    setDemoRole(null)
    console.log('Exiting demo mode')
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, demoRole, enterDemoMode, exitDemoMode }}>
      <DemoDataProvider>
        {children}
      </DemoDataProvider>
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
