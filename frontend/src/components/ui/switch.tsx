import * as React from "react"

const Switch = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      ref={ref}
      className={className}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    />
  )
)
Switch.displayName = "Switch"

export { Switch }
