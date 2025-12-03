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
  <span className={`newsroom-label text-gray-500 ${className}`}>
    {children}
  </span>
);

const SkeletonCard = () => (
  <div className="flex flex-col h-full border border-gray-100 bg-white p-6 animate-pulse">
    <div className="flex justify-between mb-6">
      <div className="h-3 bg-gray-200 w-24 rounded"></div>
      <div className="h-3 bg-gray-200 w-16 rounded"></div>
    </div>
    <div className="h-6 bg-gray-200 w-3/4 mb-4 rounded"></div>
    <div className="h-6 bg-gray-200 w-1/2 mb-6 rounded"></div>
    <div className="flex-1 space-y-3">
      <div className="h-3 bg-gray-200 w-full rounded"></div>
      <div className="h-3 bg-gray-200 w-full rounded"></div>
      <div className="h-3 bg-gray-200 w-5/6 rounded"></div>
    </div>
    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
      <div className="h-3 bg-gray-200 w-20 rounded"></div>
      <div className="h-3 bg-gray-200 w-3 rounded"></div>
    </div>
  </div>
);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 selection:bg-black selection:text-white pt-24 md:pt-28 pb-24">
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
      className="max-w-7xl mx-auto px-6 pb-20"
    >
      {/* Header Area */}
      <div className="mb-8 border-b border-gray-900 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="newsroom-title text-gray-900">
            News Feed
          </h1>

          {/* Layout Controls */}
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

        {/* Intelligence Filter */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('All')}
            className={`
              px-3 py-1.5 newsroom-label-xs border transition-all duration-200
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
                px-3 py-1.5 newsroom-label-xs border transition-all duration-200
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
               className="ml-auto newsroom-label text-gray-400 hidden md:inline-block"
             >
               Showing {filteredData.length} Result{filteredData.length !== 1 ? 's' : ''}
             </m.span>
          )}
        </div>
      </div>

      {/* Layout Renderer with Staggered Animation & Skeleton */}
      <div className="min-h-[500px]">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 bg-gray-50">
            <p className="newsroom-label text-gray-400 uppercase">No Intelligence Found</p>
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
              <div className="border-t border-gray-200">
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
      className={`group cursor-pointer border border-gray-200 bg-white hover:border-black transition-colors duration-300 overflow-hidden flex flex-col md:flex-row h-full`}
    >
      {hasImage && (
        <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto bg-gray-100 overflow-hidden relative border-b md:border-b-0 md:border-r border-gray-200">
           <Image
             src={imageUrl}
             alt={post.mainImage?.alt || post.title}
             fill
             sizes="(max-width: 768px) 100vw, 50vw"
             className="object-cover transition-all duration-700 group-hover:scale-105"
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
           <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
        </div>

        <h3 className="newsroom-card-title-featured text-gray-900 mb-6 group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-body text-gray-500 leading-relaxed font-light mb-8">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
           <p className="newsroom-body-small text-gray-600 leading-relaxed line-clamp-4 mb-6 border-l-2 border-gray-200 pl-4">
             {post.excerpt}
           </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-transparent group-hover:border-gray-100 transition-colors">
          <span className="newsroom-cta-label group-hover:text-blue-700 transition-colors">
             Read Featured Story
          </span>
          <ArrowRight className="w-4 h-4 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
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
    <div onClick={onClick} className="group cursor-pointer flex flex-col h-full border-t border-gray-200 pt-6 hover:border-black transition-colors duration-300 relative bg-white">
      <div className="flex justify_between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">[{post.category.title}]</MonoLabel>
        </div>
        <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="newsroom-card-title text-gray-900 mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-body-small text-gray-500 line-clamp-2 mb-4">
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
                 className="object-cover transition-all duration-500"
               />
             </div>
           </div>
        )}

        {!hasImage && post.excerpt && (
           <div className="relative mt-2 mb-4 flex-1">
             <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
             <p className="newsroom-body-small text-gray-500 leading-relaxed pl-4 line-clamp-[10]">
               {post.excerpt}...
             </p>
           </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between group-hover:bg-gray-50 -mx-0 px-2 pb-2 transition-colors rounded-b-sm">
        <span className="newsroom-cta-label text-gray-500 group-hover:text-blue-700 transition-colors">
          Read Briefing
        </span>
        <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
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
      className={`group cursor-pointer grid gap-8 items-start border-t border-gray-200 pt-8 hover:border-black transition-colors duration-300
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
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-4 mb-4">
          <MonoLabel>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</MonoLabel>
          <div className="h-px w-8 bg-gray-300"></div>
          <MonoLabel className="text-gray-400 group-hover:text-black transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <h3 className="newsroom-card-title-featured text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
          {post.title}
        </h3>
        <p className="newsroom-body text-gray-600 leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
          {post.excerpt ? post.excerpt.substring(0, hasImage ? 180 : 300) : post.subtitle}...
        </p>
        <span className="flex items-center gap-2 newsroom-cta-label mt-auto group-hover:translate-x-2 transition-transform">
          Read Full Briefing <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

function FeedRow({ post, onClick }: { post: NewsPost; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group cursor-pointer flex flex-col md:flex-row items-baseline gap-4 md:gap-12 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="w-32 shrink-0">
        <MonoLabel className="text-gray-500 group-hover:text-black transition-colors">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </MonoLabel>
      </div>
      <div className="flex-1">
         <h3 className="newsroom-body font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {post.title}
         </h3>
      </div>
      <div className="w-auto hidden md:block shrink-0">
          <span className="newsroom-label-xs text-gray-400">
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
      transition={{ duration: 0.3 }}
      className="bg-white pt-6 pb-20 relative"
    >
      <div className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-40 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 newsroom-label text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </button>
          <div className="flex gap-4">
             <button className="text-gray-400 hover:text-black transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-12">
          <div className="space-y-6 pt-2">
            <div>
              <MonoLabel className="block mb-1">Published</MonoLabel>
              <div className="text-sm font-medium">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div>
               <MonoLabel className="block mb-1">Category</MonoLabel>
               <div className="flex flex-wrap gap-2">
                 <span className="newsroom-label text-black">
                   [{post.category.title}]
                 </span>
               </div>
            </div>
             <div>
              <MonoLabel className="block mb-1">Read Time</MonoLabel>
              <div className="text-sm font-medium text-gray-400">{post.readTime} MIN READ</div>
            </div>
          </div>

          <div>
            <h1 className="newsroom-article-title text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="newsroom-body text-gray-500 leading-relaxed font-light border-l-2 border-gray-900 pl-6">
                {post.subtitle}
              </p>
            )}
          </div>
        </div>

        {imageUrl ? (
           <div className="relative aspect-[21/9] w-full bg-gray-100 mb-16 overflow-hidden border border-gray-200">
             <Image
               src={imageUrl}
               alt={post.mainImage?.alt || post.title}
               fill
               sizes="100vw"
               className="object-cover transition-all duration-700"
             />
           </div>
        ) : (
           <div className="w-full h-px bg-gray-200 mb-16" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
           <div className="hidden md:block">
              <div className="sticky top-32">
                 <div className="w-8 h-px bg-black mb-4"></div>
                 <MonoLabel>Section 01</MonoLabel>
              </div>
           </div>

           <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-700">
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
        <div className="max-w-4xl mx-auto px-6 mt-20 pt-12 border-t border-gray-900">
           <h3 className="newsroom-label text-gray-900 mb-8">
             Related Intelligence
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {relatedPosts.map(related => (
               <div key={related._id} className="h-96">
                 <GridCard post={related} onClick={() => onNavigate(related._id)} />
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 flex items-center justify-between pb-8">
        <button onClick={onBack} className="p-2 text-gray-500 hover:text-black">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={onBack} className="flex items-center gap-2 newsroom-label text-black font-bold">
          <Home className="w-4 h-4" />
          News Feed
        </button>
        <button className="p-2 text-gray-500 hover:text-black">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </m.div>
  );
}
