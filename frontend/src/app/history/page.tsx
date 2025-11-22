import HistorySection from '@/components/History/HistorySection';
import { getCurrentUserServer } from '@/services/server';
import { getOrdersForCurrentUserServer } from '@/services/server';
import { redirect } from 'next/navigation';
import { parseSearchParams } from '@/utils/searchParamsParser';
import { historySearchParamsSchema } from '@/schema/searchParams';

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect('/login');
  }

  const params = await parseSearchParams(searchParams, historySearchParamsSchema);
  const { page, limit } = params;

  const ordersData = await getOrdersForCurrentUserServer(page, limit);

  if (!ordersData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Không thể tải dữ liệu đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {' '}
      {/* Changed outer div */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        {' '}
        {/* Added new header div */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
        <p className="text-gray-600">Quản lý và theo dõi trạng thái các đơn hàng của bạn</p>
      </div>
      <div className="container mx-auto px-4">
        {' '}
        {/* Wrapped HistorySection in a new div */}
        <HistorySection
          initialOrders={ordersData.content || []}
          initialPagination={{
            page: ordersData.page || 1,
            totalPages: ordersData.totalPages,
            totalElements: ordersData.totalElements || 0,
            limit,
          }}
        />
      </div>
    </div>
  );
}
