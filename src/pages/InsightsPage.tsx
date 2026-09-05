import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { useCms } from '@/lib/cms-store';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Video,
  Headphones,
  Sparkles,
  Clock,
  Bookmark,
  BookmarkCheck,
  Zap,
} from 'lucide-react';
import { InsightDetailPage } from '@/pages/InsightDetailPage';
import { breadcrumbSchema, personSchema } from '@/lib/seo';
import {
  SearchFilterBar,
  type MediaFilterType,
  type DurationFilterType,
  type SortOptionType,
} from '@/components/blog/SearchFilterBar';
import { BlogSearchModal } from '@/components/blog/BlogSearchModal';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { NewsletterModal } from '@/components/blog/NewsletterModal';
import { BlogAdUnit } from '@/components/ads/BlogAdUnit';

function InsightsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { state } = useCms();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<MediaFilterType>('all');
  const [durationFilter, setDurationFilter] = useState<DurationFilterType>('all');
  const [sortBy, setSortBy] = useState<SortOptionType>('recent');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const [savedQueue, setSavedQueue] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kel_nnorom_reading_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global Keyboard Shortcut for Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleBookmark = (articleSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedQueue((prev) => {
      const next = prev.includes(articleSlug)
        ? prev.filter((s) => s !== articleSlug)
        : [...prev, articleSlug];
      try {
        localStorage.setItem('kel_nnorom_reading_queue', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const allInsights = state.insights.filter((i) => i.published !== false);

  // Extract unique categories & compute counts
  const categories = useMemo(() => {
    const set = new Set<string>();
    allInsights.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [allInsights]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allInsights.forEach((i) => {
      if (i.category) {
        counts[i.category] = (counts[i.category] || 0) + 1;
      }
    });
    return counts;
  }, [allInsights]);

  // Versatile Multi-Factor Filtering & Sorting Engine
  const filteredInsights = useMemo(() => {
    return allInsights
      .filter((item) => {
        // 1. Category Filter
        const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
        if (!matchesCat) return false;

        // 2. Search Query Matching across title, excerpt, body, tags, keywords
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const inTitle = item.title.toLowerCase().includes(q);
          const inExcerpt = item.excerpt.toLowerCase().includes(q);
          const inTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
          const inKeywords = (item.seoKeywords || []).some((k) => k.toLowerCase().includes(q));
          const inFocus = item.focusKeyword?.toLowerCase().includes(q);
          const inBody = item.body?.toLowerCase().includes(q);

          if (!inTitle && !inExcerpt && !inTags && !inKeywords && !inFocus && !inBody) {
            return false;
          }
        }

        // 3. Media Format Filter
        if (mediaFilter === 'video' && !item.videoUrl) return false;
        if (mediaFilter === 'audio' && !item.audioUrl) return false;
        if (mediaFilter === 'framework' && !item.tags?.some((t) => t.toLowerCase().includes('framework') || t.toLowerCase().includes('strategy'))) {
          return false;
        }

        // 4. Reading Duration Filter
        const minutes = parseInt(item.readingTime || '5', 10) || 5;
        if (durationFilter === 'quick' && minutes >= 5) return false;
        if (durationFilter === 'medium' && (minutes < 5 || minutes > 10)) return false;
        if (durationFilter === 'deep' && minutes < 10) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'longest') {
          const minA = parseInt(a.readingTime || '5', 10) || 5;
          const minB = parseInt(b.readingTime || '5', 10) || 5;
          return minB - minA;
        }
        if (sortBy === 'shortest') {
          const minA = parseInt(a.readingTime || '5', 10) || 5;
          const minB = parseInt(b.readingTime || '5', 10) || 5;
          return minA - minB;
        }
        if (sortBy === 'popular') {
          const viewsA = state.analytics?.postsAnalytics[a.slug]?.views || 0;
          const viewsB = state.analytics?.postsAnalytics[b.slug]?.views || 0;
          return viewsB - viewsA;
        }
        if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        // Default: Most Recent
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      });
  }, [allInsights, selectedCategory, searchQuery, mediaFilter, durationFilter, sortBy, state.analytics]);

  const featuredPost = allInsights.find((i) => i.featured) || allInsights[0];

  const jsonLd = [
    breadcrumbSchema([
      { name: 'Home', url: 'https://kelnnorom.com' },
      { name: 'Insights', url: 'https://kelnnorom.com/insights' },
    ]),
    personSchema,
  ];

  // If a slug is present in URL, render the full detailed essay page
  if (slug) {
    return <InsightDetailPage />;
  }

  return (
    <>
      <Seo
        config={{
          title: 'Strategic Insights & Operational Essays | Kel Nnorom Editorial',
          description:
            'Executive-level operational essays, margin turnaround case notes, supply chain telemetry, and programmatic monetization frameworks by Kel Nnorom.',
          canonical: 'https://www.kelnnorom.com/insights',
          keywords: [
            'Kel Nnorom Insights',
            'Operational Essays',
            'Business Turnaround Frameworks',
            'Digital Asset Arbitrage',
            'Logistics Telemetry Route Optimization',
            'Supply Chain Operating Systems',
          ],
          jsonLd,
        }}
      />

      <div className="w-full">
        {/* Dynamic Executive Top Banner Ad Unit */}
        <div className="max-w-7xl mx-auto container-px pt-4">
          <BlogAdUnit placement="header_top_banner" category={selectedCategory} />
        </div>

        {/* Page Hero Header */}
        <section className="pt-8 pb-14 md:pt-14 md:pb-20 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-7xl mx-auto container-px">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] font-mono">
                    Operational Essays & Systems Intelligence
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                  Insights on Operations, <br />
                  <span className="text-[var(--accent-gold)]">Turnarounds & Monetization.</span>
                </h1>

                <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                  Deconstructing structural margin leakages, ad revenue arbitrage, logistics telemetry, and institutional execution frameworks. Written from active battlefield leadership.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                  <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                    <ShieldCheck className="w-4 h-4" /> First-Principles Systems
                  </span>
                  <span>•</span>
                  <span>Multimedia Telemetry</span>
                  <span>•</span>
                  <span>Reading Speed Analytics</span>
                  <span>•</span>
                  <span>Verified Executive Case Studies</span>
                </div>
              </div>

              {/* Quick Executive Memo Subscribe Trigger Card */}
              <div className="lg:w-80 shrink-0 p-5 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--accent-gold)] font-bold uppercase">
                  <Zap size={13} />
                  <span>Private Strategic Memo</span>
                </div>
                <p className="text-xs text-[var(--foreground)] font-bold">
                  Get monthly turnaround debriefs directly in your inbox.
                </p>
                <button
                  onClick={() => setIsNewsletterModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-gold)] text-black text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-xs"
                >
                  <span>Subscribe to Memo</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Spotlight Section (shown when no filter/search active) */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && mediaFilter === 'all' && durationFilter === 'all' && (
          <section className="py-10 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
            <div className="max-w-7xl mx-auto container-px">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-4">
                <Sparkles size={14} />
                <span>Featured Strategic Analysis</span>
              </div>

              <div className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {featuredPost.featuredImage && (
                  <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-video sm:aspect-4/3 bg-[var(--surface-elevated)] border border-[var(--border)]">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.featuredImageAlt || featuredPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className={`${featuredPost.featuredImage ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-bold">
                      {featuredPost.category}
                    </span>
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[var(--muted)]">{featuredPost.readingTime || '6 min read'}</span>
                    {featuredPost.videoUrl && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <Video size={12} /> Video
                      </span>
                    )}
                    {featuredPost.audioUrl && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Headphones size={12} /> Audio
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-['Inter_Tight',sans-serif] hover:text-[var(--accent-gold)] transition-colors leading-tight">
                    <Link to={`/insights/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--muted)]">{featuredPost.date}</span>
                    <Link
                      to={`/insights/${featuredPost.slug}`}
                      className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-sm"
                    >
                      <span>Read Full Briefing</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Stream & Interactive Search Section */}
        <section className="py-12 md:py-16 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto container-px">
            {/* Versatile Search & Filter Matrix */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              mediaFilter={mediaFilter}
              onMediaFilterChange={setMediaFilter}
              durationFilter={durationFilter}
              onDurationFilterChange={setDurationFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              categories={categories}
              totalResultsCount={filteredInsights.length}
              totalAllCount={allInsights.length}
              categoryCounts={categoryCounts}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />

            {filteredInsights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredInsights.map((article, index) => {
                  const isSaved = savedQueue.includes(article.slug);
                  return (
                    <React.Fragment key={article.slug}>
                      {/* Inject Native Sponsored Card after the 2nd article */}
                      {index === 2 && (
                        <div className="md:col-span-2 lg:col-span-1 flex flex-col">
                          <BlogAdUnit placement="feed_card" category={selectedCategory} />
                        </div>
                      )}
                      <article
                        className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/60 transition-all duration-300 shadow-sm flex flex-col justify-between group"
                      >
                      <div>
                        {/* Optional Thumbnail */}
                        {article.featuredImage && (
                          <div className="mb-5 rounded-2xl overflow-hidden aspect-video bg-[var(--surface-elevated)] border border-[var(--border)]">
                            <img
                              src={article.featuredImage}
                              alt={article.featuredImageAlt || article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-[var(--muted)] font-mono mb-3">
                          <span className="text-[var(--accent-gold)] font-bold uppercase">{article.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              <span>{article.readingTime || '5 min read'}</span>
                            </span>
                            <button
                              onClick={(e) => toggleBookmark(article.slug, e)}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                isSaved
                                  ? 'text-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                              }`}
                              title={isSaved ? 'Saved in reading queue' : 'Save for later'}
                            >
                              {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                            </button>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3 group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                          <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                        </h2>

                        <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-3 leading-relaxed mb-6">
                          {article.excerpt}
                        </p>
                      </div>

                      <div>
                        {/* Media Badges & Keyword Tag */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {article.videoUrl && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Video size={11} /> Video
                            </span>
                          )}
                          {article.audioUrl && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Headphones size={11} /> Audio
                            </span>
                          )}
                          {article.focusKeyword && (
                            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)] truncate max-w-[140px]">
                              {article.focusKeyword}
                            </span>
                          )}
                        </div>

                        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                          <span className="text-xs font-mono text-[var(--muted)]">{article.date}</span>
                          <Link
                            to={`/insights/${article.slug}`}
                            className="text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Read Essay</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </React.Fragment>
                );
              })}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto text-center p-10 sm:p-14 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent-gold)] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>

                <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-gold)] font-bold mb-2">
                  Editorial Archive Search
                </div>

                <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                  No operational essays match your criteria
                </h2>

                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                  Try clearing active filters or searching for terms like &quot;turnaround&quot;, &quot;arbitrage&quot;, or &quot;supply chain&quot;.
                </p>

                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setMediaFilter('all');
                    setDurationFilter('all');
                    setSortBy('recent');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Inline Newsletter Subscription Card */}
            <div className="mt-16">
              <NewsletterCard
                title="Join Kel Nnorom's Private Executive Memo"
                subtitle="Receive monthly strategic intelligence on margin turnaround methodologies, high-yield digital asset arbitrage, and supply chain telemetry."
                source="inline_card"
                showChecklistDownload={true}
              />
            </div>
          </div>
        </section>

        {/* Global Bottom Consultation CTA */}
        <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Advisory
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Have an operational bottleneck or system to engineer?
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Consult with Kel Nnorom on supply chain logistics, programmatic revenue scaling, or operational turnarounds.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Start Consultation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/work" variant="secondary">
                  Review Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Global Quick Search Modal */}
      <BlogSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        insights={allInsights}
      />

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        source="modal"
      />
    </>
  );
}

export default InsightsPage;
export { InsightsPage };
