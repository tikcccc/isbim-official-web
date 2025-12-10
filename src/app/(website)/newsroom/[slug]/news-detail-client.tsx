'use client';

import { m } from '@/components/motion/lazy-motion';
import { ArrowLeft, Share2, Home, Tag } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/lib/i18n';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import type { ReactNode } from 'react';
import type { Image as SanityImage } from 'sanity';
import type { PortableTextBlock } from '@portabletext/types';
import { useEffect } from 'react';

// Types for Sanity data
interface NewsItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  body?: PortableTextBlock[]; // Rich text array
  mainImage?: {
    asset: SanityImage;
    alt: string;
  };
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
  };
  tags?: string[];
  author: string;
  readTime: number;
  featured?: boolean;
}

interface NewsDetailClientProps {
  newsDetail: NewsItem;
  relatedNews: NewsItem[];
  recentNews: NewsItem[];
}

// Utility component for mono labels
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`newsroom-label newsroom-text-subtle ${className}`}>
    {children}
  </span>
);

export default function NewsDetailClient({
  newsDetail,
  relatedNews,
  recentNews,
}: NewsDetailClientProps) {
  const imageUrl = newsDetail.mainImage
    ? urlFor(newsDetail.mainImage.asset)?.width(1600).height(685).url()
    : null;

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share article function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsDetail.title,
          text: newsDetail.subtitle || newsDetail.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[Newsroom][Debug] Detail payload');
      console.log('newsDetail', newsDetail);
      console.log('relatedNews', relatedNews);
      console.log('recentNews', recentNews);
      console.groupEnd();
    }
  }, [newsDetail, relatedNews, recentNews]);

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="newsroom-detail newsroom-surface-card pb-20 relative"
    >
      <div className="newsroom-article-container flex items-center gap-3 md:gap-4 py-6">
        <Link href="/newsroom" className="newsroom-back-btn">
          <ArrowLeft className="w-3 h-3 newsroom-back-icon" />
          Back to Newsroom
        </Link>
      </div>

      {/* Article Content */}
      <article className="newsroom-article-container py-12">
        {/* Article Header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-12">
          {/* Sidebar Metadata */}
          <div className="space-y-6 pt-2">
            <div>
              <MonoLabel className="block mb-1">Published</MonoLabel>
              <div className="text-sm font-medium">{formatDate(newsDetail.publishedAt)}</div>
            </div>
            <div>
              <MonoLabel className="block mb-1">Category</MonoLabel>
              <div className="flex flex-wrap gap-2">
                <span
                  className="newsroom-label newsroom-text-primary"
                  style={{ color: newsDetail.category.color }}
                >
                  [{newsDetail.category.title}]
                </span>
              </div>
            </div>
            <div>
              <MonoLabel className="block mb-1">Read Time</MonoLabel>
              <div className="text-sm font-medium newsroom-text-soft">{newsDetail.readTime} MIN READ</div>
            </div>
            {newsDetail.author && (
              <div>
                <MonoLabel className="block mb-1">Author</MonoLabel>
                <div className="text-sm font-medium">{newsDetail.author}</div>
              </div>
            )}
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h1 className="newsroom-article-title mb-6 leading-tight">
              {newsDetail.title}
            </h1>
            {newsDetail.subtitle && (
              <p className="newsroom-body leading-relaxed font-light border-l-2 newsroom-border-strong pl-6">
                {newsDetail.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl ? (
          <div className="newsroom-media-frame newsroom-media-featured relative aspect-[21/9] w-full mb-16 overflow-hidden">
            <Image
              src={imageUrl}
              alt={newsDetail.mainImage?.alt || newsDetail.title}
              fill
              sizes="100vw"
              className="newsroom-media-img object-cover"
            />
          </div>
        ) : (
          <div className="newsroom-detail-divider" />
        )}

        {/* Article Body */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="hidden md:block newsroom-detail-sidebar">
            <div className="newsroom-detail-sticky">
              <div className="newsroom-section-marker"></div>
              <MonoLabel>Section 01</MonoLabel>
            </div>
          </div>

          <div className="newsroom-prose max-w-none">
            <PortableText
              value={newsDetail.body || []}
              components={portableTextComponents}
            />
          </div>
        </div>

        {/* Tags Section */}
        {newsDetail.tags && newsDetail.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t newsroom-border-subtle">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-4 h-4 newsroom-text-soft" />
              {newsDetail.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 newsroom-label-xs newsroom-surface-muted newsroom-text-muted hover:bg-[var(--newsroom-surface-quiet)] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Intelligence Section */}
      {relatedNews.length > 0 && (
        <div className="newsroom-article-container mt-20 pt-12 border-t newsroom-border-strong">
          <h3 className="newsroom-label newsroom-text-primary mb-8">
            Related Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedNews.map(related => (
              <Link
                key={related._id}
                href={`/newsroom/${related.slug.current}`}
                className="group"
              >
                <RelatedCard post={related} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent News Section */}
      {recentNews.length > 0 && (
        <div className="newsroom-article-container mt-20 pt-12 border-t newsroom-border-subtle">
          <h3 className="newsroom-label newsroom-text-primary mb-8">
            Recent News
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map(recent => (
              <Link
                key={recent._id}
                href={`/newsroom/${recent.slug.current}`}
                className="group"
              >
                <RelatedCard post={recent} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t newsroom-border-subtle p-4 md:hidden z-50 flex items-center justify-between pb-8"
        style={{ backgroundColor: 'rgba(var(--newsroom-surface-card-rgb), 0.96)' }}
      >
        <Link href="/newsroom" className="p-2 newsroom-text-subtle hover:text-[var(--newsroom-text-primary)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link href="/newsroom" className="flex items-center gap-2 newsroom-label newsroom-text-primary font-bold">
          <Home className="w-4 h-4" />
          News Feed
        </Link>
        <button onClick={handleShare} className="p-2 newsroom-text-subtle hover:text-[var(--newsroom-text-primary)]">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </m.div>
  );
}

// Related Article Card Component
function RelatedCard({ post }: { post: NewsItem }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;

  return (
    <div className="group cursor-pointer flex flex-col h-full relative newsroom-card-shell">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="group-hover:text-[var(--newsroom-text-primary)] transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <MonoLabel>
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="newsroom-card-title mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-body-small line-clamp-2 mb-4">
            {post.subtitle}
          </p>
        )}

        {imageUrl && (
          <div className="mt-auto mb-4">
            <div className="newsroom-media-frame relative w-full aspect-[3/2]">
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="newsroom-media-img object-cover"
              />
            </div>
          </div>
        )}

        {!imageUrl && post.excerpt && (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="newsroom-excerpt-bar absolute left-0 top-0 bottom-0 w-px" />
            <p className="newsroom-body-small leading-relaxed pl-4 line-clamp-[10]">
              {post.excerpt}...
            </p>
          </div>
        )}
      </div>

      <div className="newsroom-card-footer mt-auto flex items-center justify-between -mx-0">
        <span className="newsroom-cta-label newsroom-cta-link">
          Read Briefing
        </span>
        <ArrowRight className="w-3 h-3 newsroom-icon-soft transition-all group-hover:text-[var(--newsroom-accent-cta)] group-hover:translate-x-1" />
      </div>
    </div>
  );
}

// Portable Text Components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }: { children?: ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[var(--newsroom-accent-cta)] hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: ReactNode }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 newsroom-border-subtle pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
};

// Add ArrowRight icon component
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
