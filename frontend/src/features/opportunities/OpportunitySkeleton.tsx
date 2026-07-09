import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'

export function OpportunitySkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 w-full pt-1">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-12 mt-2" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-20" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-24" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-20" />
        </div>
        
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse w-full" />
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-28" />
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-16" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-20" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-24" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-32" />
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-24" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse w-16" />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse flex-1" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse flex-1" />
      </CardFooter>
    </Card>
  )
}
