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

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  // Build image URL
  const imageUrl = news.mainImage
    ? urlFor(news.mainImage.asset)?.width(800).height(450).url()
    : null;

  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${news.slug.current}`}
      className="group cursor-pointer flex flex-col h-full border-t border-gray-200 pt-6 hover:border-black transition-colors duration-300 relative bg-white"
    >
      {/* Header: Category and Date */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="font-mono text-xs tracking-wider uppercase text-gray-400 group-hover:text-black transition-colors">
            [{news.category.title}]
          </span>
        </div>
        <span className="font-mono text-xs tracking-wider uppercase text-gray-500">
          {news.publishedAt}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold leading-tight text-gray-900 mb-3 group-hover:underline decoration-1 underline-offset-4">
          {news.title}
        </h3>

        {/* Subtitle */}
        {news.subtitle && (
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2 mb-4">
            {news.subtitle}
          </p>
        )}

        {/* Image or Body Preview */}
        {hasImage ? (
          <div className="mt-auto mb-4">
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden border border-gray-100">
              <Image
                src={imageUrl}
                alt={news.mainImage?.alt || news.title}
                width={800}
                height={450}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>
        ) : (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-hover:bg-blue-500 transition-colors" />
            <p className="text-xs text-gray-500 leading-relaxed pl-4 line-clamp-[10] font-mono">
              {news.excerpt}...
            </p>
          </div>
        )}
      </div>

      {/* Footer: Read Button */}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between group-hover:bg-gray-50 -mx-0 px-2 pb-2 transition-colors rounded-b-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 group-hover:text-blue-700 transition-colors">
          Read Briefing
        </span>
        <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
