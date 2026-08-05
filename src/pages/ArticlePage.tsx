import Sidebar from '@/components/layout/Sidebar';
import NewsArticle from '@/components/news/NewsArticle';

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <NewsArticle />
        </div>
        <div className="w-full lg:w-72 shrink-0 mt-8 lg:mt-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
