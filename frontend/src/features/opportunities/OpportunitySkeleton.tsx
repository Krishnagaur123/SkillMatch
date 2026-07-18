import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { Skeleton } from '@/components/feedback/Skeleton'

export function OpportunitySkeleton() {
  return (
    <Card variant="interactive" className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-start gap-4 flex-1">
          <Skeleton variant="rectangular" className="w-12 h-12 rounded-md shrink-0" />
          <div className="flex flex-col gap-2 w-full pt-1">
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
          <Skeleton variant="avatar" className="w-16 h-16" />
          <Skeleton variant="text" className="h-3 w-12 mt-2" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-5">
        <div className="flex gap-4">
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
        
        <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="h-4 w-28" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
              <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
              <Skeleton variant="rectangular" className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-6 w-24 rounded-full" />
              <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 flex gap-3" style={{ borderTop: '1px solid var(--border-default)' }}>
        <Skeleton variant="rectangular" className="h-10 flex-1 rounded" />
        <Skeleton variant="rectangular" className="h-10 flex-1 rounded" />
      </CardFooter>
    </Card>
  )
}
