import * as React from "react"

const Badge = ({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) => {
  return <div className={className} {...props} />
}

export { Badge }
