'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-6 px-4">
        <AlertCircle className="h-24 w-24 text-destructive" />
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-foreground">500</h1>
          <p className="text-xl text-muted-foreground">Sorry, something went wrong.</p>
        </div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
