import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-6 px-4">
        <FileQuestion className="h-24 w-24 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Sorry, the page you visited does not exist.</p>
        </div>
        <Button asChild>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </div>
  )
}
