'use client';

import React, { useEffect, useState } from 'react';
import { m } from '@/components/motion/lazy-motion';
import {
  ArrowRight,
  LayoutGrid, List, AlignJustify,
} from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Link } from '@/lib/i18n';
import type { PortableTextBlock } from '@portabletext/types';
import type { Image as SanityImage } from 'sanity';

// --- Types ---
interface NewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  mainImage?: {
    asset: SanityImage;
    alt: string;
  };
  publishedAt: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  readTime: number;
  tags?: string[];
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
  };
  author: string;
  featured?: boolean;
}

interface NewsCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

type LayoutMode = 'grid' | 'feed' | 'magazine';
type CategoryFilter = string | 'All';

// --- Motion Tokens (read from CSS custom properties) ---
const getMotionTokens = () => {
  if (typeof window === 'undefined') {
    return { fast: 0.2, base: 0.4, slow: 0.7, stagger: 0.1 };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    fast: parseFloat(style.getPropertyValue('--newsroom-motion-page-fast')) || 0.2,
    base: parseFloat(style.getPropertyValue('--newsroom-motion-page-duration')) || 0.4,
    slow: parseFloat(style.getPropertyValue('--newsroom-motion-page-slow')) || 0.7,
    stagger: parseFloat(style.getPropertyValue('--newsroom-motion-page-stagger')) || 0.1,
  };
};

const MOTION = getMotionTokens();

// --- Animation Variants (match prototype exactly) ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.stagger
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: MOTION.base } }
};

// --- Utility Components ---

// MonoLabel: font-mono text-xs tracking-wider uppercase text-gray-500
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-xs tracking-wider uppercase text-gray-500 ${className}`}>
    {children}
  </span>
);

// --- Main Page Component ---

interface NewsroomPageClientProps {
  initialNews: NewsPost[];
  categories: NewsCategory[];
  featuredNews: NewsPost | null;
}

export default function NewsroomPageClient({
  initialNews,
  categories,
  featuredNews,
}: NewsroomPageClientProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[Newsroom][Debug] Initial payload');
      console.log('featuredNews', featuredNews);
      console.log('categories', categories);
      console.log('initialNews length', initialNews.length);
      console.log('initialNews slugs', initialNews.map(n => n.slug?.current));
      console.log('initialNews', initialNews);
      console.groupEnd();
    }
  }, [initialNews, categories, featuredNews]);

  return (
    <div className="newsroom-page">
      <NewsListView
        key="list"
        newsData={initialNews}
        categories={categories}
        featuredNews={featuredNews}
      />
    </div>
  );
}

// --- List View Container ---

function NewsListView({
  newsData,
  categories,
  featuredNews,
}: {
  newsData: NewsPost[];
  categories: NewsCategory[];
  featuredNews: NewsPost | null;
}) {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [filter, setFilter] = useState<CategoryFilter>('All');

  const derivedCategories: NewsCategory[] =
    categories.length > 0
      ? categories
      : Array.from(
          new Map(
            newsData.map((post) => [
              post.category._id,
              {
                _id: post.category._id,
                title: post.category.title,
                slug: post.category.slug,
                description: "",
                color: post.category.color,
              } as NewsCategory,
            ])
          ).values()
        );

  const filteredData = filter === 'All'
    ? newsData
    : newsData.filter(post => post.category.title === filter);

  const featuredMatchesFilter =
    featuredNews &&
    (filter === 'All' || featuredNews.category.title === filter);

  const listWithoutFeatured =
    featuredMatchesFilter && featuredNews
      ? filteredData.filter((post) => post._id !== featuredNews._id)
      : filteredData;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="newsroom-shell newsroom-padding-inline pb-20"
    >
      {/* Header Area */}
      <div className="newsroom-header">
        <div className="newsroom-header-content">
          <div className="newsroom-hero-split">
            <h1 className="newsroom-title">Newsroom</h1>
            <p className="newsroom-tagline">
              Latest insights, updates, and industry intelligence from isBIM
            </p>
          </div>

          {/* Layout Controls */}
          <div className="newsroom-layout-toggle">
            <button
              onClick={() => setLayout('grid')}
              className={`newsroom-layout-btn ${layout === 'grid' ? 'active' : ''}`}
              title="Grid View"
              aria-label="Grid layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('magazine')}
              className={`newsroom-layout-btn ${layout === 'magazine' ? 'active' : ''}`}
              title="Magazine View"
              aria-label="Magazine layout"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('feed')}
              className={`newsroom-layout-btn ${layout === 'feed' ? 'active' : ''}`}
              title="Feed View"
              aria-label="Feed layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="newsroom-filter-section">
          <button
            onClick={() => setFilter('All')}
            className={`newsroom-filter-btn ${filter === 'All' ? 'active' : ''}`}
          >
            All Categories
          </button>

          {derivedCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilter(cat.title)}
              className={`newsroom-filter-btn ${filter === cat.title ? 'active' : ''}`}
            >
              {cat.title}
            </button>
          ))}

          {filter !== 'All' && (
            <m.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto newsroom-label-xs hidden md:inline-block"
            >
              Showing {filteredData.length} Result{filteredData.length !== 1 ? 's' : ''}
            </m.span>
          )}
        </div>
      </div>

      {/* Layout Renderer with Staggered Animation */}
      <div className="min-h-[500px]">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center newsroom-border border-dashed newsroom-surface-quiet">
            <p className="newsroom-label-xs newsroom-text-soft">No Articles Found</p>
          </div>
        ) : (
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {featuredMatchesFilter && featuredNews && (
                  <m.div variants={itemVariants} key={featuredNews._id} className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FeaturedGridCard post={featuredNews} />
                  </m.div>
                )}

                {listWithoutFeatured.map((post) => (
                  <m.div variants={itemVariants} key={post._id}>
                    <GridCard post={post} />
                  </m.div>
                ))}
              </div>
            )}

            {layout === 'magazine' && (
              <div className="flex flex-col gap-12 max-w-5xl">
                {filteredData.map((post) => (
                  <m.div variants={itemVariants} key={post._id}>
                    <MagazineCard post={post} />
                  </m.div>
                ))}
              </div>
            )}

            {layout === 'feed' && (
              <div className="border-t border-gray-200">
                {filteredData.map((post) => (
                  <m.div variants={itemVariants} key={post._id}>
                    <FeedRow post={post} />
                  </m.div>
                ))}
              </div>
            )}
          </m.div>
        )}
      </div>
    </m.div>
  );
}

// --- Cards & Components ---

function FeaturedGridCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1200).height(675).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className="newsroom-card-featured group"
    >
      {hasImage && (
        <div className="newsroom-card-featured-image">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="newsroom-card-featured-content">
        <div className="flex justify-between items-start newsroom-mb-sm">
          <div className="flex gap-2">
            <MonoLabel className="newsroom-text-soft group-hover:newsroom-text-primary transition-colors">
              [{post.category.title}]
            </MonoLabel>
          </div>
          <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-CA')}</MonoLabel>
        </div>

        <h3 className="newsroom-card-title-featured newsroom-mb-sm group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-subtitle newsroom-mb">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
          <p className="newsroom-excerpt-mono newsroom-mb line-clamp-4 border-l-2 newsroom-border-soft pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="newsroom-card-footer">
          <span className="newsroom-cta-text newsroom-text-primary group-hover:newsroom-text-accent transition-colors">
            Read Featured Story
          </span>
          <ArrowRight className="w-4 h-4 group-hover:newsroom-text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link href={`/newsroom/${post.slug.current}`} className="newsroom-card-shell group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">[{post.category.title}]</MonoLabel>
        </div>
        <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-CA')}</MonoLabel>
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

        {hasImage && (
          <div className="mt-auto mb-4">
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden border border-gray-100">
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>
        )}

        {!hasImage && post.excerpt && (
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
    </Link>
  );
}

function MagazineCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(500).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className={`newsroom-card-shell group grid gap-8 items-start
        ${hasImage ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : 'grid-cols-1'}
      `}
    >
      {hasImage && (
        <div className="relative aspect-[4/3] md:aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-100">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-4 mb-4">
          <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-CA')}</MonoLabel>
          <div className="h-px w-8 bg-gray-300"></div>
          <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <h3 className={`font-bold leading-tight text-gray-900 mb-4 group-hover:text-blue-700 transition-colors
          ${hasImage ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}
        `}>
          {post.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
          {post.excerpt ? post.excerpt.substring(0, hasImage ? 180 : 300) : post.subtitle}...
        </p>
        <span className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wide mt-auto group-hover:translate-x-2 transition-transform">
          Read Full Briefing <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

function FeedRow({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className="newsroom-feed-row group"
    >
      <div className="w-32 shrink-0">
        <MonoLabel className="text-gray-500 group-hover:text-black transition-colors">
          {new Date(post.publishedAt).toLocaleDateString('en-CA')}
        </MonoLabel>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
          {post.title}
        </h3>
      </div>
      <div className="w-auto hidden md:block shrink-0">
        <span className="text-[10px] font-mono text-gray-400">
          {post.category.title}
        </span>
      </div>
    </Link>
  );
}

// --- Detail View Component ---

