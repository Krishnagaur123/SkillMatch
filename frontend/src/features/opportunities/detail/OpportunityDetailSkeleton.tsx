import { Skeleton } from '@/components/feedback/Skeleton'
import { Card, CardContent, CardHeader } from '@/components/common/Card'

export function OpportunityDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-xl" />
            <div className="flex flex-col gap-2 pt-1">
              <Skeleton className="h-8 w-64 md:w-96 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Match Summary */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          {/* Skills Breakdown */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-48 rounded-md mb-2" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48 rounded-md mb-2" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[90%] rounded-md" />
            <Skeleton className="h-4 w-[95%] rounded-md" />
            <Skeleton className="h-4 w-[80%] rounded-md" />
            <br />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[85%] rounded-md" />
          </div>

          {/* Company Preview */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-40 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-4 w-56 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Action Panel */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
