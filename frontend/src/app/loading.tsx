import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col gap-5">
      <LoadingSpinner size="xl" />
      <p className="text-lg text-muted-foreground">Đang tải...</p>
    </div>
  )
}
