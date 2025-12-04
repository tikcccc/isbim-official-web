'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import {
  ArrowLeft, ArrowRight, Share2,
  LayoutGrid, List, AlignJustify, Home
} from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import type { ReactNode } from 'react';
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

// --- Utility Components ---

const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`newsroom-label newsroom-text-subtle ${className}`}>
    {children}
  </span>
);

// --- Motion Tokens (match newsroom-design-tokens) ---
const MOTION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.75,
  stagger: 0.12,
};

// --- Animation Variants ---
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
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeRoute]);

  const activePost = initialNews.find(p => p._id === activeRoute);

  return (
    <div className="newsroom-page min-h-screen">
      <AnimatePresence mode="wait">
        {!activeRoute ? (
          <NewsListView
            key="list"
            newsData={initialNews}
            categories={categories}
            featuredNews={featuredNews}
            onNavigate={setActiveRoute}
          />
        ) : (
          <DetailView
            key="detail"
            post={activePost!}
            allNews={initialNews}
            onNavigate={setActiveRoute}
            onBack={() => setActiveRoute(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Portable Text components for detail view
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
              className="newsroom-text-accent hover:underline"
            >
              {children}
            </a>
          );
        },
  },
  block: {
    h2: ({ children }: { children?: ReactNode }) => <h2 className="text-2xl font-bold newsroom-mt-lg newsroom-mb">{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 className="text-xl font-bold newsroom-mt newsroom-mb">{children}</h3>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 newsroom-border-subtle pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
};

// --- List View Container ---

function NewsListView({
  newsData,
  categories,
  featuredNews,
  onNavigate
}: {
  newsData: NewsPost[];
  categories: NewsCategory[];
  featuredNews: NewsPost | null;
  onNavigate: (id: string) => void;
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

  const effectiveData = filteredData;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="newsroom-content newsroom-section"
    >
      {/* Header Area */}
      <div className="newsroom-mb-lg border-b newsroom-border-strong newsroom-stack-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between newsroom-gap">
          <h1 className="newsroom-title">
            News Feed
          </h1>

          {/* Layout Controls */}
          <div
            className="flex items-center gap-2 border newsroom-border-subtle newsroom-surface-card"
            style={{ padding: "var(--newsroom-stack-xs)" }}
          >
            <button
              onClick={() => setLayout('grid')}
              className={`newsroom-layout-btn ${layout === 'grid' ? 'active' : ''}`}
              title="Headline View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
             <button
              onClick={() => setLayout('magazine')}
              className={`newsroom-layout-btn ${layout === 'magazine' ? 'active' : ''}`}
              title="Strategic Briefing"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('feed')}
              className={`newsroom-layout-btn ${layout === 'feed' ? 'active' : ''}`}
              title="Compact Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intelligence Filter */}
        <div className="newsroom-stack flex flex-wrap items-center newsroom-gap">
          <button
            onClick={() => setFilter('All')}
            className={`newsroom-filter-btn ${filter === 'All' ? 'active' : ''}`}
          >
            View All
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
               className="ml-auto newsroom-label newsroom-text-soft hidden md:inline-block"
             >
               Showing {filteredData.length} Result{filteredData.length !== 1 ? 's' : ''}
             </m.span>
          )}
        </div>
      </div>

      {/* Layout Renderer with Staggered Animation & Skeleton */}
      <div className="min-h-[500px]">
        {filteredData.length === 0 ? (
          <div
            className="text-center border border-dashed newsroom-border-subtle newsroom-surface-quiet"
            style={{ paddingBlock: "var(--newsroom-section-padding)" }}
          >
            <p className="newsroom-label newsroom-text-soft uppercase">No Intelligence Found</p>
          </div>
        ) : (
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {effectiveData.map((post, index) => {
                  if (index === 0 && featuredNews && post._id === featuredNews._id) {
                    return (
                      <m.div variants={itemVariants} key={post._id} className="col-span-1 md:col-span-2 lg:col-span-3">
                        <FeaturedGridCard post={post} onClick={() => onNavigate(post._id)} />
                      </m.div>
                    );
                  }
                  return (
                    <m.div variants={itemVariants} key={post._id}>
                      <GridCard post={post} onClick={() => onNavigate(post._id)} />
                    </m.div>
                  );
                })}
              </div>
            )}

            {layout === 'magazine' && (
              <div className="flex flex-col gap-12 max-w-5xl">
                {effectiveData.map((post) => (
                  <m.div variants={itemVariants} key={post._id}>
                    <MagazineCard post={post} onClick={() => onNavigate(post._id)} />
                  </m.div>
                ))}
              </div>
            )}

            {layout === 'feed' && (
              <div className="border-t newsroom-border-subtle">
                {effectiveData.map((post) => (
                  <m.div variants={itemVariants} key={post._id}>
                    <FeedRow post={post} onClick={() => onNavigate(post._id)} />
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

function FeaturedGridCard({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1200).height(675).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer newsroom-card-featured overflow-hidden flex flex-col md:flex-row h-full"
    >
      {hasImage && (
        <div className="newsroom-media-frame newsroom-media-featured w-full md:w-1/2 aspect-[16/9] md:aspect-auto relative border-b md:border-b-0 md:border-r newsroom-border-subtle">
           <Image
             src={imageUrl}
             alt={post.mainImage?.alt || post.title}
             fill
             sizes="(max-width: 768px) 100vw, 50vw"
             className="newsroom-media-img object-cover"
           />
        </div>
      )}

      <div className={`newsroom-card-padding-lg flex flex-col justify-center ${hasImage ? 'w-full md:w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-start newsroom-mb-lg">
           <div className="flex gap-2">
             <MonoLabel className="group-hover:text-[var(--newsroom-text-primary)] transition-colors">
               [{post.category.title}]
             </MonoLabel>
           </div>
           <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
        </div>

        <h3 className="newsroom-card-title-featured newsroom-mb-lg group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-body leading-relaxed font-light newsroom-mb-lg">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
           <p
             className="newsroom-body-small leading-relaxed line-clamp-4 newsroom-mb-lg border-l-2 newsroom-border-subtle"
             style={{ paddingLeft: "var(--newsroom-card-gap)" }}
           >
             {post.excerpt}
           </p>
        )}

        <div
          className="newsroom-card-footer mt-auto flex items-center justify-between w-full border-t border-transparent"
          style={{ paddingTop: "var(--newsroom-stack)" }}
        >
          <span className="newsroom-cta-label newsroom-cta-link">
             Read Featured Story
          </span>
          <ArrowRight className="w-4 h-4 newsroom-icon-soft transition-all group-hover:text-[var(--newsroom-accent-cta)] group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

function GridCard({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <div onClick={onClick} className="group cursor-pointer flex flex-col h-full relative newsroom-card-shell">
      <div className="flex justify-between items-start newsroom-mb">
        <div className="flex gap-2">
          <MonoLabel className="group-hover:text-[var(--newsroom-text-primary)] transition-colors">[{post.category.title}]</MonoLabel>
        </div>
        <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="newsroom-card-title newsroom-mb group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-body-small line-clamp-2 newsroom-mb">
            {post.subtitle}
          </p>
        )}

        {hasImage && (
           <div className="mt-auto newsroom-mb">
             <div className="newsroom-media-frame relative w-full aspect-[3/2]">
               <Image
                 src={imageUrl}
                 alt={post.mainImage?.alt || post.title}
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 className="newsroom-media-img object-cover"
               />
             </div>
           </div>
        )}

        {!hasImage && post.excerpt && (
           <div className="relative newsroom-mt newsroom-mb flex-1">
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

function MagazineCard({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(500).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer grid newsroom-gap items-start newsroom-card-shell newsroom-stack-lg
        ${hasImage ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : 'grid-cols-1'}
      `}
    >
      {hasImage && (
        <div className="newsroom-media-frame relative aspect-[4/3] md:aspect-[16/10]">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="newsroom-media-img object-cover"
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-4 newsroom-mb">
          <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
          <div className="h-px w-8 bg-[var(--newsroom-border-subtle)]"></div>
          <MonoLabel className="group-hover:text-[var(--newsroom-text-primary)] transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <h3 className="newsroom-card-title-featured newsroom-mb group-hover:text-[var(--newsroom-accent-cta)] transition-colors">
          {post.title}
        </h3>
        <p className="newsroom-body leading-relaxed newsroom-mb-lg line-clamp-3 md:line-clamp-none">
          {post.excerpt ? post.excerpt.substring(0, hasImage ? 180 : 300) : post.subtitle}...
        </p>
        <span className="flex items-center gap-2 newsroom-cta-label newsroom-cta-link mt-auto group-hover:translate-x-2 transition-transform">
          Read Full Briefing <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

function FeedRow({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col md:flex-row items-baseline newsroom-gap md:gap-12 border-b newsroom-border-subtle hover:bg-[var(--newsroom-surface-quiet)] transition-colors"
      style={{ paddingBlock: "var(--newsroom-stack)" }}
    >
      <div className="w-32 shrink-0">
        <MonoLabel className="group-hover:text-[var(--newsroom-text-primary)] transition-colors">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </MonoLabel>
      </div>
      <div className="flex-1">
         <h3 className="newsroom-body font-semibold newsroom-text-primary group-hover:text-[var(--newsroom-accent-cta)] transition-colors">
          {post.title}
         </h3>
      </div>
      <div className="w-auto hidden md:block shrink-0">
          <span className="newsroom-label-xs newsroom-text-soft">
            {post.category.title}
          </span>
      </div>
    </div>
  );
}

// --- Detail View Component ---

function DetailView({ post, allNews, onBack, onNavigate }: { post: NewsPost; allNews: NewsPost[]; onBack: () => void; onNavigate: (id: string) => void }) {

  // Find Related Articles Logic
  const relatedPosts = allNews
    .filter(p => p.category._id === post.category._id && p._id !== post._id)
    .slice(0, 2);

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1600).height(685).url()
    : null;

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: MOTION.fast }}
      className="newsroom-surface-card relative"
      style={{
        paddingTop: "var(--newsroom-stack-lg)",
        paddingBottom: "var(--newsroom-section-padding)",
      }}
    >
      <div
        className="border-b newsroom-border-subtle sticky top-0 backdrop-blur-md z-40 transition-all"
        style={{ backgroundColor: 'rgba(var(--newsroom-surface-card-rgb), 0.95)' }}
      >
        <div className="max-w-4xl mx-auto newsroom-padding-inline h-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 newsroom-label newsroom-text-subtle hover:text-[var(--newsroom-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </button>
          <div className="flex gap-4">
             <button className="newsroom-text-soft hover:text-[var(--newsroom-text-primary)] transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <article
        className="newsroom-article-container"
        style={{ paddingBlock: "var(--newsroom-section-padding)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] newsroom-gap newsroom-mb-xl">
          <div className="newsroom-stack-lg" style={{ paddingTop: "var(--newsroom-stack-xs)" }}>
            <div>
              <MonoLabel className="block newsroom-mb-xs">Published</MonoLabel>
              <div className="text-sm font-medium">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div>
               <MonoLabel className="block newsroom-mb-xs">Category</MonoLabel>
               <div className="flex flex-wrap gap-2">
                 <span className="newsroom-label newsroom-text-primary">
                   [{post.category.title}]
                 </span>
               </div>
            </div>
             <div>
              <MonoLabel className="block newsroom-mb-xs">Read Time</MonoLabel>
              <div className="text-sm font-medium newsroom-text-soft">{post.readTime} MIN READ</div>
            </div>
          </div>

          <div>
            <h1 className="newsroom-article-title newsroom-mb-lg leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p
                className="newsroom-body leading-relaxed font-light border-l-2 newsroom-border-strong"
                style={{ paddingLeft: "var(--newsroom-card-gap)" }}
              >
                {post.subtitle}
              </p>
            )}
          </div>
        </div>

        {imageUrl ? (
           <div className="newsroom-media-frame newsroom-media-featured relative aspect-[21/9] w-full newsroom-mb-xl overflow-hidden">
             <Image
               src={imageUrl}
               alt={post.mainImage?.alt || post.title}
               fill
               sizes="100vw"
               className="newsroom-media-img object-cover"
             />
           </div>
        ) : (
           <div className="w-full h-px bg-[var(--newsroom-border-subtle)] newsroom-mb-xl" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] newsroom-gap">
           <div className="hidden md:block">
              <div className="sticky top-32">
                 <div className="w-8 h-px bg-[var(--newsroom-text-primary)] newsroom-mb"></div>
                 <MonoLabel>Section 01</MonoLabel>
              </div>
           </div>

           <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-[var(--newsroom-text-muted)] newsroom-stack-lg">
             {post.body && post.body.length > 0 ? (
               <PortableText value={post.body} components={portableTextComponents} />
             ) : (
               <p className="lead">
                 {post.excerpt || post.subtitle || 'No content available.'}
               </p>
             )}
           </div>
        </div>
      </article>

      {/* Related Intelligence Section */}
      {relatedPosts.length > 0 && (
        <div
          className="newsroom-article-container border-t newsroom-border-strong"
          style={{
            marginTop: "var(--newsroom-section-padding)",
            paddingTop: "var(--newsroom-stack-lg)",
          }}
        >
           <h3 className="newsroom-label newsroom-text-primary newsroom-mb-lg">
             Related Intelligence
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 newsroom-gap">
             {relatedPosts.map(related => (
               <div key={related._id} className="h-96">
                 <GridCard post={related} onClick={() => onNavigate(related._id)} />
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t newsroom-border-subtle md:hidden z-50 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(var(--newsroom-surface-card-rgb), 0.96)',
          padding: "var(--newsroom-stack)",
          paddingBottom: "var(--newsroom-stack-lg)",
        }}
      >
        <button
          onClick={onBack}
          className="newsroom-text-subtle hover:text-[var(--newsroom-text-primary)]"
          style={{ padding: "var(--newsroom-stack-xs)" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={onBack} className="flex items-center gap-2 newsroom-label newsroom-text-primary font-bold">
          <Home className="w-4 h-4" />
          News Feed
        </button>
        <button
          className="newsroom-text-subtle hover:text-[var(--newsroom-text-primary)]"
          style={{ padding: "var(--newsroom-stack-xs)" }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </m.div>
  );
}


