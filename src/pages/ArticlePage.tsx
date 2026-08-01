import Sidebar from '@/components/layout/Sidebar';
import NewsArticle from '@/components/news/NewsArticle';

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <NewsArticle />
        </div>
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
