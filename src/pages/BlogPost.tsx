import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { useBlogPost } from '@/hooks/useBlog';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug ?? '');

  if (!slug) return <Navigate to="/blog" replace />;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
        <div className="aspect-video bg-gray-100 rounded mb-8" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEO
        title={`${post.title} | KITES Blog`}
        description={post.excerpt ?? ''}
      />

      {/* Header */}
      <section className="bg-gray-900 pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{post.category}</span>
            {post.publishedAt && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-gray-400 mt-4 text-lg leading-relaxed">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Thumbnail */}
      {post.thumbnailUrl && (
        <div className="max-w-3xl mx-auto px-6 lg:px-8 -mt-1">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {post.content ? (
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>
        ) : (
          <p className="text-gray-400 italic">No content available for this post.</p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-3 flex-wrap">
            <Tag size={14} className="text-gray-400" />
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={14} /> All Posts
          </Link>
        </div>
      </article>
    </>
  );
}
