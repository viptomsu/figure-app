'use client'

import React, { useEffect } from "react"
import Link from "next/link"
import NewSection from "../../../src/components/About/OurTeam/OurTeam"

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="about-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Bài viết</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <NewSection />
      </div>
    </div>
  )
}
