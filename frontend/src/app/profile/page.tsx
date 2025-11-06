'use client'

import Link from 'next/link'
import React from 'react'
import ProfileSection from '@/components/Profile/ProfileSection'

export default function ProfilePage() {
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
                <span>Trang cá nhân</span>
              </li>
            </ul>
          </div>
        </section>
        <ProfileSection />
      </div>
    </div>
  )
}
