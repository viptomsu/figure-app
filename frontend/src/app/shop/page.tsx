import Link from "next/link"
import Shop from "@/components/Shop"
import { getAllProductsServer } from "@/services/productService"

interface ShopPageProps {
  searchParams: {
    category?: string
    page?: string
    sort?: string
    direction?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const categoryRaw = searchParams.category ? parseInt(searchParams.category) : null
  const pageNum = searchParams.page ? parseInt(searchParams.page) : 1
  const sort = searchParams.sort || 'productName'
  const direction = searchParams.direction || 'asc'
  const limit = 12

  // Validate and fallback NaN values
  const category = Number.isNaN(categoryRaw) ? null : categoryRaw
  const page = Number.isNaN(pageNum) ? 1 : pageNum

  const products = await getAllProductsServer(
    '',
    category,
    null,
    page,
    limit,
    sort,
    direction
  )

  return (
    <div className="shop-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Cửa hàng</span>
              </li>
            </ul>
          </div>
        </section>
        <Shop
          initialProducts={products.content || []}
          initialPage={page}
          initialSort={sort}
          initialDirection={direction}
          initialCategory={category}
          totalPages={products.totalPages}
        />
      </div>
    </div>
  )
}
