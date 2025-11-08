import Link from 'next/link'
import Map from '@/components/Contact/Map/Map'
import ContactItems from '@/components/Contact/ContactItems/ContactItems'

export default function ContactPage() {
  return (
    <div className="contact-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Liên hệ</span>
              </li>
            </ul>
          </div>
        </section>
        <Map />
        <ContactItems />
      </div>
    </div>
  )
}
