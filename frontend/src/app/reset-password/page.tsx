import Link from 'next/link';
import ResetPasswordSection from '@/components/ResetPassword/ResetPasswordSection';

export default function ResetPasswordPage() {
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
                <span>Đặt lại mật khẩu</span>
              </li>
            </ul>
          </div>
        </section>
        <ResetPasswordSection />
      </div>
    </div>
  );
}
