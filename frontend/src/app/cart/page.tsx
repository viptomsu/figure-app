import Link from 'next/link'
import CartSection from '@/components/ShoppingCart/CartSection'

export default function CartPage() {
  return (
    <div className="cart-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Giỏ hàng</span>
              </li>
            </ul>
          </div>
        </section>
        <CartSection />
      </div>
    </div>
  )
}
