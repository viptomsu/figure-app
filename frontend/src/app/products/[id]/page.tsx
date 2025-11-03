'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import ProductDetailsContent from "@/components/ProductDetails/ProductDetailsContent"
import RelatedProducts from "@/components/ProductDetails/RelatedProducts/RelatedProducts"
import { getProductById } from "@/services/productService"

export default function ProductDetailsPage() {
  const params = useParams()
  const propsId = params.id as string
  const [loading, setLoading] = useState<boolean>(true)
  const [theProduct, setTheProduct] = useState<any>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(parseInt(propsId))
        setTheProduct(product)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    window.scrollTo(0, 0)
    fetchProduct()
  }, [propsId])

  return (
    <div className="product-details-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
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

        {/* ===== content ===== */}
        <ProductDetailsContent theProduct={theProduct} loading={loading} />
        <RelatedProducts />
      </div>
    </div>
  )
}
