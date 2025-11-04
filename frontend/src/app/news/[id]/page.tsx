'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getNewsById } from '@/services/newService'

interface NewsItem {
  _id: number
  title: string
  content: string
  publishDate: string
  image: string
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>()
  const [news, setNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const data = await getNewsById(params.id)
        setNews(data.payload)
      } catch (error) {
        console.error('Error fetching news detail:', error)
      }
    }

    window.scrollTo(0, 0)
    if (params.id) {
      fetchNewsDetail()
    }
  }, [params.id])

  if (!news) {
    return <p>Loading...</p>
  }

  return (
    <div className="about-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Chi tiết bài viết</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="article" style={{ padding: '20px 0' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12">
                <h1>{news.title}</h1>
                <p>
                  <strong>Ngày đăng:</strong>{' '}
                  {new Date(news.publishDate).toLocaleDateString()}
                </p>
                <img
                  src={news.image}
                  alt={news.title}
                  style={{ width: '100%', height: 'auto', borderRadius: '5px', marginBottom: '20px' }}
                />
                <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
