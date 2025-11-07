import Link from 'next/link'
import HistorySection from '@/components/History/HistorySection'
import { getCurrentUserServer } from '@/services/authService'
import { getOrdersForCurrentUserServer } from '@/services/orderService'
import { redirect } from 'next/navigation'
import { parseSearchParams } from '@/utils/searchParamsParser'
import { historySearchParamsSchema } from '@/schema/searchParams'

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
  }>
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await getCurrentUserServer()

  if (!user) {
    redirect('/login')
  }

  const params = await parseSearchParams(searchParams, historySearchParamsSchema)
  const { page, limit } = params

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
          initialOrders={ordersData.content || ordersData.payload || []}
          initialPagination={{
            page: ordersData.page || ordersData.currentPage,
            totalPages: ordersData.totalPages,
            totalElements: ordersData.totalElements || ordersData.totalItems,
            limit,
          }}
        />
      </div>
    </div>
  )
}
