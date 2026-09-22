import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  contentClassName?: string
}

export function SectionCard({
  title,
  description,
  icon,
  action,
  className,
  contentClassName,
  children,
  ...props
}: SectionCardProps) {
  return (
    <Card className={cn('p-5 sm:p-6', className)} {...props}>
      {(title || description || action) && (
        <CardHeader className="mb-5 flex-row flex-wrap items-start justify-between gap-x-4 gap-y-3 space-y-0">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                {icon}
              </div>
            )}
            <div className="flex min-w-0 flex-col gap-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {action && <div className="max-w-full shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
