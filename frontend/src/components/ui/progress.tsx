import * as React from "react"

const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number }>(
  ({ className, value, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <div style={{ width: `${value}%` }} />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
