'use client';

import Image from 'next/image';
import { Link } from '@/lib/i18n';
import { urlFor } from '@/sanity/lib/image';
import { ArrowRight } from 'lucide-react';
import type { Image as SanityImage } from 'sanity';

interface NewsItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
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
}

interface FeaturedNewsCardProps {
  news: NewsItem;
}

export default function FeaturedNewsCard({ news }: FeaturedNewsCardProps) {
  // Build image URL with larger dimensions for featured card
  const imageUrl = news.mainImage
    ? urlFor(news.mainImage.asset)?.width(1400).height(600).url()
    : null;

  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${news.slug.current}`}
      className="group cursor-pointer border border-gray-200 bg-white hover:border-black transition-colors duration-300 overflow-hidden flex flex-col md:flex-row h-full"
    >
      {/* Image Section */}
      {hasImage && (
        <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto bg-gray-100 overflow-hidden relative border-b md:border-b-0 md:border-r border-gray-200">
          <Image
            src={imageUrl}
            alt={news.mainImage?.alt || news.title}
            width={1400}
            height={600}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            priority
          />
        </div>
      )}

      {/* Content Section */}
      <div className={`p-8 md:p-12 flex flex-col justify-center ${hasImage ? 'w-full md:w-1/2' : 'w-full'}`}>
        {/* Header: Category and Date */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <span className="font-mono text-xs tracking-wider uppercase text-gray-400 group-hover:text-black transition-colors">
              [{news.category.title}]
            </span>
          </div>
          <span className="font-mono text-xs tracking-wider uppercase text-gray-500">
            {news.publishedAt}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 mb-6 group-hover:underline decoration-2 underline-offset-8">
          {news.title}
        </h3>

        {/* Subtitle */}
        {news.subtitle && (
          <p className="text-xl text-gray-500 leading-relaxed font-light mb-8">
            {news.subtitle}
          </p>
        )}

        {/* Excerpt (for non-image cards) */}
        {!hasImage && news.excerpt && (
          <p className="text-gray-600 leading-relaxed line-clamp-4 font-mono text-sm mb-6 border-l-2 border-gray-200 pl-4">
            {news.excerpt}
          </p>
        )}

        {/* Footer: Read Button */}
        <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-transparent group-hover:border-gray-100 transition-colors">
          <span className="text-sm font-bold uppercase tracking-wide group-hover:text-blue-700 transition-colors">
            Read Featured Story
          </span>
          <ArrowRight className="w-4 h-4 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
