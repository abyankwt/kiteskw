import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { usePublishedPosts, type BlogPost } from '@/hooks/useBlog';

const CATEGORIES = ['All', 'news', 'training', 'events', 'insights'];

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white border border-gray-100 flex flex-col hover:border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{post.category}</span>
          {post.publishedAt && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3 flex-1">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  const { data, isLoading } = usePublishedPosts({
    page,
    limit: 9,
    ...(activeCategory !== 'All' && { category: activeCategory }),
  });

  const posts = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <SEO title="Blog | KITES" description="Engineering insights, training news, and industry updates from KITES Kuwait." />

      {/* Hero */}
      <section className="bg-gray-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Blog</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            Insights & Updates
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl text-lg">
            Engineering knowledge, training news, and industry developments from KITES.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${
                  activeCategory === cat
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-20" />
                    <div className="h-5 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
