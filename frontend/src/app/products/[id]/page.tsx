import Link from "next/link"
import ProductDetailsContent from "@/components/ProductDetails/ProductDetailsContent"
import RelatedProducts from "@/components/ProductDetails/RelatedProducts/RelatedProducts"
import { getProductByIdServer } from "@/services/productService"
import { notFound } from "next/navigation"

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const id = parseInt(params.id)

  // Validate id is not NaN
  if (Number.isNaN(id)) {
    notFound()
  }

  try {
    const product = await getProductByIdServer(id)

    if (!product) {
      notFound()
    }

  return (
    <div className="product-details-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <Link href="/shop">Cửa hàng</Link>
              </li>
              <li>
                <span>Chi tiết sản phẩm</span>
              </li>
            </ul>
          </div>
        </section>

        <ProductDetailsContent theProduct={product} loading={false} />
        <RelatedProducts product={product} />
      </div>
    </div>
  ) catch (error: any) {
    // If 404 error, call notFound
    if (error?.status === 404) {
      notFound()
    }
    // Re-throw other errors to allow route error boundary to handle
    throw error
  }
}
