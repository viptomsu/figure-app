import Link from 'next/link'
import ForgotPasswordSection from '@/components/ResetPassword/ForgotPasswordSection'

export default function ForgotPasswordPage() {
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
                <span>Quên mật khẩu</span>
              </li>
            </ul>
          </div>
        </section>
        <ForgotPasswordSection />
      </div>
    </div>
  )
}
