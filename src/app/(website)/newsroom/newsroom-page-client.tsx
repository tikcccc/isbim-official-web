'use client';

import React, { useEffect, useState } from 'react';
import { m } from '@/components/motion/lazy-motion';
import {
  ArrowRight,
  LayoutGrid, List, AlignJustify,
  MoveRight,
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

// Shared cubic-bezier easing (must be a 4-value tuple for Framer Motion)
const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- Animation Variants (match prototype exactly) ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: MOTION_EASE
    }
  }
};

// --- Utility Components ---

// MonoLabel: font-mono text-xs tracking-wider uppercase text-gray-500
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-xs tracking-wider uppercase text-gray-500 ${className}`}>
    {children}
  </span>
);

// --- Hero Section Component ---
function HeroSection({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1920).height(1080).url()
    : null;
  const hasImage = !!imageUrl;

  // Hero animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: MOTION_EASE }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: MOTION_EASE }
    }
  };

  return (
    <Link href={`/newsroom/${post.slug.current}`}>
      <div className="relative w-full h-[80vh] min-h-[600px] mb-12 group overflow-hidden bg-gray-900 cursor-pointer">

        {/* Background Image with Slow Zoom + Fade Effect */}
        {hasImage && (
          <m.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: MOTION_EASE }}
            whileHover={{ scale: 1.025 }}
          >
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </m.div>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent opacity-80" />

        {/* Content Container - Flex Column Space Between */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col justify-between w-full"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-[90%] md:max-w-[88%] xl:max-w-[1700px] mx-auto px-0 md:px-6">
            {/* TOP: Newsroom Masthead (Inside Hero) */}
            <m.div
              className="pt-24 md:pt-32"
              variants={titleVariants}
            >
              <h1 className="newsroom-hero-title">
                Newsroom
              </h1>
            </m.div>
          </div>

          {/* BOTTOM: Featured Article Info */}
          <div className="w-full max-w-[90%] md:max-w-[88%] xl:max-w-[1700px] mx-auto px-0 md:px-6 pb-8 md:pb-12">
            {/* Category Tag */}
            <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
              <span className="text-[11px] font-mono border border-white/30 px-3 py-1 text-white bg-black/20 backdrop-blur-sm uppercase tracking-widest">
                {post.category.title}
              </span>
            </m.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
                {post.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-mono border border-white/30 px-3 py-1 text-white bg-black/20 backdrop-blur-sm uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </m.div>
            )}

            {/* Date */}
            <m.div className="mb-4" variants={heroItemVariants}>
              <span className="font-mono text-xs tracking-wider uppercase text-gray-300">
                {new Date(post.publishedAt).toLocaleDateString('en-CA')}
              </span>
            </m.div>

            {/* Title */}
            <m.h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
              variants={heroItemVariants}
            >
              {post.title}
            </m.h2>

            {/* Subtitle */}
            {post.subtitle && (
              <m.p
                className="text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed border-l-2 border-white/30 pl-6"
                variants={heroItemVariants}
              >
                {post.subtitle}
              </m.p>
            )}

            {/* Read More CTA with Arrow */}
            <m.div className="mt-8 flex items-center gap-3" variants={heroItemVariants}>
              <span className="text-sm md:text-base font-bold uppercase tracking-wide text-white">
                Read Featured Story
              </span>
              <MoveRight className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-300 group-hover:translate-x-2" />
            </m.div>
          </div>
        </m.div>
      </div>
    </Link>
  );
}

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

  // Sort by date (newest first)
  const sortedNewsData = [...newsData].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const filteredData = filter === 'All'
    ? sortedNewsData
    : sortedNewsData.filter(post => post.category.title === filter);

  // Hero post logic (NOT affected by filter):
  // - If featured news exists: ALWAYS use featured news (regardless of filter)
  // - Otherwise: use newest article from ALL news (not filtered)
  const heroPost = featuredNews
    ? featuredNews
    : sortedNewsData.length > 0
      ? sortedNewsData[0]
      : null;

  // List without hero (filtered data, excluding hero post)
  const listWithoutHero = filteredData.filter((post) =>
    heroPost && post._id !== heroPost._id
  );

  // Featured card logic for grid view:
  // Use the newest article from the filtered remaining list
  const newestPost = listWithoutHero.length > 0 ? listWithoutHero[0] : null;

  // Remaining list data (exclude the featured card post)
  const listData = listWithoutHero.slice(1);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Section (Magazine Cover Style with Embedded Title) */}
      {heroPost && <HeroSection post={heroPost} />}

      {/* Container for Controls & List */}
      <div className="newsroom-shell newsroom-padding-inline">
        {/* Controls Area */}
        <div className="mb-12 border-b border-gray-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', ...derivedCategories.map(cat => cat.title)].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat as CategoryFilter)}
                  className={`
                    px-3 py-1.5 text-xs md:text-sm font-mono uppercase tracking-wide border transition-all duration-200
                    ${filter === cat
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
                  `}
                >
                  {cat === 'All' ? 'View All' : cat}
                </button>
              ))}
            </div>

            <h2 className="text-4xl font-bold tracking-tighter text-gray-900">
              Latest Briefings
            </h2>
          </div>

          {/* Layout Switcher */}
          <div className="flex items-center gap-2 border border-gray-200 p-1 bg-white">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`p-2 transition-colors ${layout === 'grid' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('magazine')}
              className={`p-2 transition-colors ${layout === 'magazine' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Strategic View"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('feed')}
              className={`p-2 transition-colors ${layout === 'feed' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
              title="Data Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout Renderer */}
        <div className="min-h-[500px]">
          {listData.length === 0 ? (
            <div className="py-20 text-center newsroom-border border-dashed newsroom-surface-quiet">
              <p className="newsroom-label-xs newsroom-text-soft">No More Intelligence Found</p>
            </div>
          ) : (
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* GRID VIEW: Newest article as featured card (full width), then regular cards */}
              {layout === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {newestPost && (
                    <m.div variants={itemVariants} key={newestPost._id} className="col-span-1 md:col-span-2 lg:col-span-3">
                      <FeaturedGridCard post={newestPost} />
                    </m.div>
                  )}

                  {listData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <GridCard post={post} />
                    </m.div>
                  ))}
                </div>
              )}

              {layout === 'magazine' && (
                <div className="flex flex-col gap-12 max-w-5xl">
                  {listData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <MagazineCard post={post} />
                    </m.div>
                  ))}
                </div>
              )}

              {layout === 'feed' && (
                <div className="border-t border-gray-200">
                  {listData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <FeedRow post={post} />
                    </m.div>
                  ))}
                </div>
              )}
            </m.div>
          )}
        </div>
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
            Read Story
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

