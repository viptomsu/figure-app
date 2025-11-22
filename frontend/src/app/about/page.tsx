import Link from "next/link"
import NewSection from "@/components/About/OurTeam/OurTeam"

export default function AboutPage() {
  

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
