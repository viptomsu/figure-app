'use client'

import React, { useEffect } from 'react'
import Link from "next/link"
import LoginSection from '../../../src/components/Account/LoginSection'

export default function LoginPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="login-content">
            <div className="main">
                {/* ===== breadcrumb ===== */}
                <section id="breadcrumb">
                    <div className="container">
                        <ul className="breadcrumb-content d-flex m-0 p-0">
                            <li>
                                <Link href="/">Trang chủ</Link>
                            </li>
                            <li>
                                <span>Đăng nhập</span>
                            </li>
                        </ul>
                    </div>
                </section>
                {/* ===== content ===== */}
                <LoginSection />
            </div>
        </div>
    )
}
