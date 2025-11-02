import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../stores'

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
}

export function useAuth({ required = false, redirectTo = '/login' }: UseAuthOptions = {}) {
  const router = useRouter()
  const { isAuthenticated, user, token } = useUserStore()

  useEffect(() => {
    // If authentication is required and user is not authenticated, redirect
    if (required && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, required, redirectTo, router])

  return {
    isAuthenticated,
    user,
    token,
    isLoading: false // Since we're using Zustand, there's no loading state
  }
}
