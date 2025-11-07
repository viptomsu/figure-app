import Link from 'next/link'
import HistorySection from '@/components/History/HistorySection'
import { getCurrentUserServer } from '@/services/authService'
import { getOrdersForCurrentUserServer } from '@/services/orderService'
import { redirect } from 'next/navigation'

interface HistoryPageProps {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await getCurrentUserServer()

  if (!user) {
    redirect('/login')
  }

  const pageNum = searchParams.page ? parseInt(searchParams.page) : 1
  const limitNum = searchParams.limit ? parseInt(searchParams.limit) : 5

  // Validate and fallback NaN values
  const page = Number.isNaN(pageNum) ? 1 : pageNum
  const limit = Number.isNaN(limitNum) ? 5 : limitNum

  const ordersData = await getOrdersForCurrentUserServer(page, limit)

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
                <span>Lịch sử mua hàng</span>
              </li>
            </ul>
          </div>
        </section>
        <HistorySection
          initialOrders={ordersData.content || []}
          initialPagination={{
            page: ordersData.page,
            totalPages: ordersData.totalPages,
            totalElements: ordersData.totalElements,
            limit,
          }}
        />
      </div>
    </div>
  )
}
