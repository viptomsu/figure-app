'use client'

import React, { useEffect } from "react"
import Link from "next/link"
import Shop from "../../../src/pages/Shop"

export default function ShopPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="shop-content">
            <div className="main">
                {/* ===== breadcrumb ===== */}
                <section id="breadcrumb">
                    <div className="container">
                        <ul className="breadcrumb-content d-flex m-0 p-0">
                            <li>
                                <Link href="/">Trang chủ</Link>
                            </li>
                            <li>
                                <span>Cửa hàng</span>
                            </li>
                        </ul>
                    </div>
                </section>
                {/* ===== content ===== */}
                <Shop />
            </div>
        </div>
    )
}
