'use client';

import { useState } from 'react';
import * as m from '@/paraglide/messages';
import FeaturedNewsCard from './featured-news-card';
import NewsCard from './news-card';
import type { Image as SanityImage } from 'sanity';

type LayoutMode = 'grid' | 'magazine' | 'feed';

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
  featured?: boolean;
}

interface NewsCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

interface NewsroomListProps {
  initialNews: NewsItem[];
  categories: NewsCategory[];
  featuredNews: NewsItem | null;
}

export default function NewsroomList({
  initialNews,
  categories,
  featuredNews,
}: NewsroomListProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter news by category
  const filteredNews = selectedCategory
    ? initialNews.filter((news) => news.category._id === selectedCategory)
    : initialNews;

  // Separate featured from regular news (if not already separated)
  const regularNews = featuredNews
    ? filteredNews.filter((news) => news._id !== featuredNews._id)
    : filteredNews;

  return (
    <div className="newsroom-container">
      <div className="newsroom-content newsroom-section">
        {/* Page Header with Title and Layout Toggle */}
        <div className="mb-8 border-b border-gray-900 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="newsroom-title text-gray-900">
              {m.newsroom_title()}
            </h1>

            {/* Layout Controls */}
            <div className="flex items-center gap-2 border border-gray-200 p-1 bg-white">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 transition-colors ${layoutMode === 'grid' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                title="Grid layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
                </svg>
              </button>

              <button
                onClick={() => setLayoutMode('magazine')}
                className={`p-2 transition-colors ${layoutMode === 'magazine' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                title="Magazine layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2"/>
                </svg>
              </button>

              <button
                onClick={() => setLayoutMode('feed')}
                className={`p-2 transition-colors ${layoutMode === 'feed' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                title="Feed layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" strokeWidth="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" strokeWidth="2"/>
                  <line x1="3" y1="6" x2="4" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="4" y2="12" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="4" y2="18" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`
                px-3 py-1.5 newsroom-label-xs border transition-all duration-200
                ${!selectedCategory
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
              `}
            >
              {m.newsroom_all_categories()}
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`
                  px-3 py-1.5 newsroom-label-xs border transition-all duration-200
                  ${selectedCategory === category._id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'}
                `}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News (if exists and no category filter) */}
        {featuredNews && !selectedCategory && (
          <div className="mb-12 newsroom-animate-in">
            <FeaturedNewsCard news={featuredNews} />
          </div>
        )}

        {/* News Grid/Magazine/Feed */}
        {filteredNews.length > 0 ? (
          <div
            className={`
              ${layoutMode === 'grid' ? 'newsroom-grid' : ''}
              ${layoutMode === 'magazine' ? 'newsroom-magazine' : ''}
              ${layoutMode === 'feed' ? 'newsroom-feed' : ''}
            `}
          >
            {regularNews.map((news, index) => (
              <div
                key={news._id}
                className={`
                  newsroom-animate-in
                  ${index === 0 ? 'newsroom-animate-delay-100' : ''}
                  ${index === 1 ? 'newsroom-animate-delay-200' : ''}
                  ${index === 2 ? 'newsroom-animate-delay-300' : ''}
                  ${index === 3 ? 'newsroom-animate-delay-400' : ''}
                `}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="newsroom-body text-gray-500">
              {selectedCategory
                ? m.newsroom_no_articles_in_category()
                : m.newsroom_no_articles()}
            </p>
          </div>
        )}

        {/* Load More Button (placeholder for future pagination) */}
        {regularNews.length >= 12 && (
          <div className="mt-12 text-center">
            <button
              className="newsroom-filter-btn hover:bg-gray-100 px-8 py-3"
              onClick={() => {
                // TODO: Implement load more functionality
                console.log('Load more articles');
              }}
            >
              {m.newsroom_load_more()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
