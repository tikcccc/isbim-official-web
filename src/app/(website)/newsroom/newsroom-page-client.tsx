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

// --- Motion Tokens (match newsroom-design-tokens exactly) ---
const MOTION = {
  fast: 0.2,
  base: 0.4,    // prototype: duration: 0.4
  slow: 0.7,
  stagger: 0.1, // prototype: staggerChildren: 0.1
};

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
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-black selection:text-white pt-12">
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
      className="max-w-7xl mx-auto px-6 pb-20"
    >
      {/* Header Area - matches prototype exactly */}
      <div className="mb-8 border-b border-gray-900 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">
            News Feed
          </h1>

          {/* Layout Controls - matches prototype: border border-gray-200 p-1 bg-white */}
          <div className="flex items-center gap-2 border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 transition-colors ${layout === 'grid' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Headline View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('magazine')}
              className={`p-2 transition-colors ${layout === 'magazine' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Strategic Briefing"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('feed')}
              className={`p-2 transition-colors ${layout === 'feed' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Compact Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intelligence Filter - matches prototype: mt-8 flex flex-wrap items-center gap-2 */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('All')}
            className={`
              px-3 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-wide border transition-all duration-200
              ${filter === 'All'
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
            `}
          >
            View All
          </button>

          {derivedCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilter(cat.title)}
              className={`
                px-3 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-wide border transition-all duration-200
                ${filter === cat.title
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
              `}
            >
              {cat.title}
            </button>
          ))}

          {filter !== 'All' && (
            <m.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto text-xs font-mono text-gray-400 hidden md:inline-block"
            >
              Showing {filteredData.length} Result{filteredData.length !== 1 ? 's' : ''}
            </m.span>
          )}
        </div>
      </div>

      {/* Layout Renderer with Staggered Animation */}
      <div className="min-h-[500px]">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 bg-gray-50">
            <p className="text-sm font-mono text-gray-400 uppercase">No Intelligence Found</p>
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
      className="group block border border-gray-200 bg-white hover:border-black transition-colors duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-full">
      {hasImage && (
        <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto bg-gray-100 overflow-hidden relative border-b md:border-b-0 md:border-r border-gray-200">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className={`p-8 md:p-12 flex flex-col justify-center ${hasImage ? 'w-full md:w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">
              [{post.category.title}]
            </MonoLabel>
          </div>
          <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-CA')}</MonoLabel>
        </div>

        <h3 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 mb-6 group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="text-xl text-gray-500 leading-relaxed font-light mb-8">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
          <p className="text-gray-600 leading-relaxed line-clamp-4 font-mono text-sm mb-6 border-l-2 border-gray-200 pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-transparent group-hover:border-gray-100 transition-colors">
          <span className="text-sm font-bold uppercase tracking-wide group-hover:text-blue-700 transition-colors">
            Read Featured Story
          </span>
          <ArrowRight className="w-4 h-4 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
        </div>
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
    <Link href={`/newsroom/${post.slug.current}`} className="group flex flex-col h-full border-t border-gray-200 pt-6 hover:border-black transition-colors duration-300 relative bg-white cursor-pointer">
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
      className={`group grid gap-8 items-start border-t border-gray-200 pt-8 hover:border-black transition-colors duration-300
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
      className="group flex flex-col md:flex-row items-baseline gap-4 md:gap-12 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
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

