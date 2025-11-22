import Link from 'next/link';
import RegisterSection from '@/components/Account/RegisterSection';

export default function RegisterPage() {
  return (
    <div className="register-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Đăng ký</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <RegisterSection />
      </div>
    </div>
  );
}
