import * as React from "react"

const Collapsible = ({ children }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  return <div>{children}</div>
}

const CollapsibleTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
