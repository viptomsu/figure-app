'use client'

import React from 'react'
import CheckOutSuccess from '@/components/CheckOutSuccess/CheckOutSuccess'
import { useAuth } from '@/hooks/useAuth'

export default function CheckoutSuccessPage() {
  const { isAuthenticated } = useAuth({ required: true })

  if (!isAuthenticated) {
    return null
  }

  return <CheckOutSuccess />
}
