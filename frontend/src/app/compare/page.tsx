import Link from 'next/link'
import CompareSection from '@/components/Compare/CompareSection'

export default function ComparePage() {
  return (
    <div className="compare-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Sản phẩm quan tâm</span>
              </li>
            </ul>
          </div>
        </section>
        <CompareSection />
      </div>
    </div>
  )
}
