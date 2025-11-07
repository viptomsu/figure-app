import Link from 'next/link'
import ProfileSection from '@/components/Profile/ProfileSection'
import { getCurrentUserServer } from '@/services/authService'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await getCurrentUserServer()

  if (!user) {
    redirect('/login')
  }

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
                <span>Trang cá nhân</span>
              </li>
            </ul>
          </div>
        </section>
        <ProfileSection initialUser={user} />
      </div>
    </div>
  )
}
