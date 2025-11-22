import Link from 'next/link'
import WishlistSection from '@/components/Wishlist/WishlistSection'

export default function WishlistPage() {
  return (
    <div className="wishlist-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Sản phẩm yêu thích</span>
              </li>
            </ul>
          </div>
        </section>
        <WishlistSection />
      </div>
    </div>
  )
}
