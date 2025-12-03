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
}

// Utility component for mono labels
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-xs tracking-wider uppercase text-gray-500 ${className}`}>
    {children}
  </span>
);

export default function NewsDetailClient({
  newsDetail,
  relatedNews,
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

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white pt-6 pb-20 relative"
    >
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-40 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link
            href="/newsroom"
            className="group flex items-center gap-2 text-xs font-mono uppercase text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Link>
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-black transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
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
                  className="text-xs font-mono uppercase tracking-wide text-black"
                  style={{ color: newsDetail.category.color }}
                >
                  [{newsDetail.category.title}]
                </span>
              </div>
            </div>
            <div>
              <MonoLabel className="block mb-1">Read Time</MonoLabel>
              <div className="text-sm font-medium text-gray-400">{newsDetail.readTime} MIN READ</div>
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
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              {newsDetail.title}
            </h1>
            {newsDetail.subtitle && (
              <p className="text-xl text-gray-500 leading-relaxed font-light border-l-2 border-gray-900 pl-6">
                {newsDetail.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl ? (
          <div className="relative aspect-[21/9] w-full bg-gray-100 mb-16 overflow-hidden border border-gray-200">
            <Image
              src={imageUrl}
              alt={newsDetail.mainImage?.alt || newsDetail.title}
              fill
              sizes="100vw"
              className="object-cover transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full h-px bg-gray-200 mb-16" />
        )}

        {/* Article Body */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="hidden md:block">
            <div className="sticky top-32">
              <div className="w-8 h-px bg-black mb-4"></div>
              <MonoLabel>Section 01</MonoLabel>
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-700">
            {newsDetail.body ? (
              <PortableText value={newsDetail.body} components={portableTextComponents} />
            ) : (
              <>
                <p className="lead">
                  {newsDetail.excerpt || newsDetail.subtitle || 'No content available.'}
                </p>
                <p>
                  In a data-driven environment, the integration of these systems is not merely an operational upgrade but a fundamental restructuring of how infrastructure assets are conceived, financed, and maintained. The <strong>JARVIS</strong> ecosystem represents a paradigm shift from reactive management to predictive orchestration.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tags Section */}
        {newsDetail.tags && newsDetail.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {newsDetail.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-xs font-mono uppercase tracking-wide text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
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
        <div className="max-w-4xl mx-auto px-6 mt-20 pt-12 border-t border-gray-900">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-900 mb-8">
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

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 flex items-center justify-between pb-8">
        <Link href="/newsroom" className="p-2 text-gray-500 hover:text-black">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link href="/newsroom" className="flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-widest text-black">
          <Home className="w-4 h-4" />
          News Feed
        </Link>
        <button onClick={handleShare} className="p-2 text-gray-500 hover:text-black">
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
    <div className="group cursor-pointer flex flex-col h-full border-t border-gray-200 pt-6 hover:border-black transition-colors duration-300 relative bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <MonoLabel>
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold leading-tight text-gray-900 mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2 mb-4">
            {post.subtitle}
          </p>
        )}

        {imageUrl && (
          <div className="mt-auto mb-4">
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden border border-gray-100">
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        )}

        {!imageUrl && post.excerpt && (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
            <p className="text-xs text-gray-500 leading-relaxed pl-4 line-clamp-[10] font-mono">
              {post.excerpt}...
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between group-hover:bg-gray-50 -mx-0 px-2 pb-2 transition-colors rounded-b-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 group-hover:text-blue-700 transition-colors">
          Read Briefing
        </span>
        <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
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
          className="text-blue-600 hover:underline"
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
      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic">
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
