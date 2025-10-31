import * as React from "react"

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />
}

export { Skeleton }
