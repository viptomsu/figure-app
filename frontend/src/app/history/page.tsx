'use client'

import Link from 'next/link'
import React from 'react'
import HistorySection from '@/components/History/HistorySection'
import { useAuth } from '@/hooks/useAuth'

export default function HistoryPage() {
  const { isAuthenticated } = useAuth({ required: true })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="login-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Lịch sử mua hàng</span>
              </li>
            </ul>
          </div>
        </section>
        <HistorySection />
      </div>
    </div>
  )
}
