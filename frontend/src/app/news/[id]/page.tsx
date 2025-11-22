import Link from 'next/link';
import { getNewsByIdServer } from '@/services/server';
import { notFound } from 'next/navigation';

interface NewsItem {
  _id: number;
  title: string;
  content: string;
  publishDate: string;
  image: string;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const news = await getNewsByIdServer(resolvedParams.id);

  if (!news) {
    notFound();
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
                  <strong>Ngày đăng:</strong> {new Date(news.publishDate).toLocaleDateString()}
                </p>
                <img
                  src={news.image}
                  alt={news.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '5px',
                    marginBottom: '20px',
                  }}
                />
                <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
