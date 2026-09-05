import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  Eye,
  BookOpen,
  ArrowRight,
  Video,
  Headphones,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';
import { Seo } from '@/components/Seo';
import { blogPostingSchema, breadcrumbSchema, personSchema } from '@/lib/seo';
import { ContentRenderer } from '@/components/blog/ContentRenderer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { SocialShareBar } from '@/components/blog/SocialShareBar';
import { ReadingTrackerHud } from '@/components/blog/ReadingTrackerHud';
import { QuoteShareTooltip } from '@/components/blog/QuoteShareTooltip';
import { RelatedPostsSection } from '@/components/blog/RelatedPostsSection';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { VideoPlayer, AudioPlayer } from '@/components/blog/MultimediaPlayer';
import { BlogAdUnit } from '@/components/ads/BlogAdUnit';

export function InsightDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state, recordPageView, recordReadComplete } = useCms();
  const [isZenMode, setIsZenMode] = useState(false);

  const articleBodyRef = useRef<HTMLDivElement>(null);

  const post = state.insights.find((i) => i.slug === slug && i.published !== false);
  const postAnalytics = slug ? state.analytics?.postsAnalytics[slug] : undefined;

  // Track page view on mount
  useEffect(() => {
    if (post && slug) {
      recordPageView(slug, post.title);
    }
  }, [slug, post, recordPageView]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container-px py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent-gold)] flex items-center justify-center mb-6">
          <BookOpen size={28} />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--foreground)] mb-3">
          Briefing Not Found
        </h1>
        <p className="text-sm text-[var(--muted)] max-w-md mb-8">
          The requested essay or operational analysis may have been archived, unpublished, or moved.
        </p>
        <Link
          to="/insights"
          className="px-6 py-3 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Return to Insights Desk</span>
        </Link>
      </div>
    );
  }

  const postUrl = `https://www.kelnnorom.com/insights/${post.slug}`;
  const wordCount = post.wordCount || (post.body ? post.body.split(/\s+/).length : 800);
  const readingTimeEstimate = post.readingTime || `${Math.max(1, Math.ceil(wordCount / 220))} min read`;

  // Schema.org structured data
  const jsonLdSchemas = [
    blogPostingSchema({
      title: post.title,
      description: post.seoDescription || post.excerpt,
      datePublished: post.date,
      author: post.author,
      url: postUrl,
      category: post.category,
      keywords: post.tags,
      wordCount,
      image: post.featuredImage || post.ogImage,
    }),
    breadcrumbSchema([
      { name: 'Home', url: 'https://www.kelnnorom.com' },
      { name: 'Insights', url: 'https://www.kelnnorom.com/insights' },
      { name: post.title, url: postUrl },
    ]),
    personSchema,
  ];

  return (
    <>
      <Seo
        config={{
          title: post.seoTitle || `${post.title} | Kel Nnorom Essay`,
          description: post.seoDescription || post.excerpt,
          canonical: postUrl,
          type: 'article',
          keywords: post.seoKeywords?.length ? post.seoKeywords : [post.category, ...(post.tags || [])],
          jsonLd: jsonLdSchemas,
        }}
      />

      {/* Floating Active Reading Telemetry HUD & Scroll Indicator */}
      <ReadingTrackerHud
        slug={post.slug}
        wordCount={wordCount}
        onZenModeToggle={setIsZenMode}
        onComplete={() => recordReadComplete(post.slug, post.title)}
      />

      {/* Interactive Floating Quote Share Tooltip */}
      <QuoteShareTooltip
        articleTitle={post.title}
        articleSlug={post.slug}
        containerRef={articleBodyRef}
      />

      <div className={`w-full bg-[var(--background)] transition-all duration-300 ${isZenMode ? 'zen-focus-active' : ''}`}>
        {/* Article Top Navigation Bar */}
        {!isZenMode && (
          <div className="border-b border-[var(--border)] bg-[var(--surface)] py-3.5 sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto container-px flex items-center justify-between gap-4 text-xs font-mono">
              <Link
                to="/insights"
                className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>All Briefings</span>
              </Link>

              <div className="flex items-center gap-2 text-[var(--muted)] hidden sm:flex">
                <span>Home</span>
                <ChevronRight size={12} />
                <span>Insights</span>
                <ChevronRight size={12} />
                <span className="text-[var(--accent-gold)] font-bold truncate max-w-xs">{post.category}</span>
              </div>

              <div className="flex items-center gap-3 text-[var(--muted)]">
                {postAnalytics && (
                  <div className="flex items-center gap-1.5 bg-[var(--surface-elevated)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                    <Eye size={12} className="text-[var(--accent-gold)]" />
                    <span>{postAnalytics.views.toLocaleString()} reads</span>
                  </div>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{readingTimeEstimate}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className={`pt-10 pb-10 sm:pt-14 sm:pb-14 border-b border-[var(--border)] bg-[var(--background)] ${isZenMode ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="max-w-4xl mx-auto container-px">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-bold font-mono uppercase tracking-wider">
                {post.category}
              </span>
              {post.videoUrl && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
                  <Video size={12} /> Video Included
                </span>
              )}
              {post.audioUrl && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                  <Headphones size={12} /> Audio Briefing
                </span>
              )}
              {post.featured && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold">
                  ★ Executive Spotlight
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.12] mb-6">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-8 font-serif italic border-l-2 border-[var(--accent-gold)] pl-4">
              {post.excerpt}
            </p>

            {/* Author Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-3.5">
                <img
                  src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={post.author || 'Kel Nnorom'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--accent-gold)]/40 shadow"
                />
                <div>
                  <div className="text-sm font-bold text-[var(--foreground)]">
                    {post.author || 'Kel Nnorom'}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {post.authorRole || 'Cross-Functional Operations Strategist'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[var(--accent-gold)]" />
                  <span>Published {post.date}</span>
                </div>
                {post.updatedAt && (
                  <span className="hidden sm:inline text-[11px] text-[var(--muted)]/70">
                    (Updated {post.updatedAt})
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && !isZenMode && (
          <div className="max-w-5xl mx-auto container-px my-8">
            <figure className="rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-xl">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                className="w-full h-auto max-h-[520px] object-cover"
              />
              {post.featuredImageCaption && (
                <figcaption className="px-6 py-3.5 bg-[var(--surface-elevated)] border-t border-[var(--border)] text-xs text-[var(--muted)] italic text-center font-mono">
                  {post.featuredImageCaption}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="max-w-7xl mx-auto container-px py-8">
          <div className={`grid grid-cols-1 ${isZenMode ? 'max-w-3xl mx-auto' : 'lg:grid-cols-12'} gap-10`}>
            {/* Desktop Left Floating Share (hidden in Zen mode) */}
            {!isZenMode && (
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28">
                  <SocialShareBar slug={post.slug} title={post.title} orientation="vertical" />
                </div>
              </aside>
            )}

            {/* Article Main Body Container */}
            <main
              ref={articleBodyRef}
              className={`${isZenMode ? 'w-full' : 'lg:col-span-8'} space-y-8`}
            >
              {/* Optional Audio Briefing Player */}
              {post.audioUrl && (
                <AudioPlayer
                  url={post.audioUrl}
                  title={post.audioTitle || `${post.title} (Audio Briefing)`}
                  duration={post.audioDuration}
                  author={post.author}
                  postSlug={post.slug}
                />
              )}

              {/* Optional Video Walkthrough */}
              {post.videoUrl && (
                <VideoPlayer
                  url={post.videoUrl}
                  title={post.videoTitle || 'Executive Video Analysis'}
                  caption={post.videoCaption}
                  postSlug={post.slug}
                />
              )}

              {/* In-Article Inline Partner Briefing / Ad Unit */}
              <div className="my-6">
                <BlogAdUnit placement="in_article_inline" category={post.category} />
              </div>

              {/* Rich Markdown & Block Content */}
              <div className="prose-container">
                <ContentRenderer content={post.body} postSlug={post.slug} />
              </div>

              {/* In-Article Bottom Ad Unit */}
              <div className="my-8">
                <BlogAdUnit placement="in_article_bottom" category={post.category} />
              </div>

              {/* Focus Themes / Tags Matrix */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[var(--muted)] mr-2 flex items-center gap-1">
                    <Tag size={13} /> Focus Themes:
                  </span>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] transition-colors"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* High-Contrast Social Share Bar */}
              <SocialShareBar slug={post.slug} title={post.title} />

              {/* Strategic Newsletter Dispatch & 90-Day Turnaround Framework Card */}
              <NewsletterCard
                title="Get Kel Nnorom's Private Operational Briefing"
                subtitle="Join senior leadership receiving actionable turnaround notes, EBITDA protection audits, and algorithmic yield breakdowns."
                source="footer"
                showChecklistDownload={true}
              />

              {/* Intelligent Thematic Recommendations Section */}
              <RelatedPostsSection
                currentInsight={post}
                allInsights={state.insights}
              />
            </main>

            {/* Right Sticky Sidebar (TOC & Author Profile, hidden in Zen mode) */}
            {!isZenMode && (
              <aside className="lg:col-span-3 space-y-6">
                <div className="sticky top-24 space-y-6">
                  {/* Table of Contents */}
                  <TableOfContents content={post.body} />

                  {/* Author Card */}
                  <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-3">
                      About the Strategist
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt="Kel Nnorom"
                        className="w-11 h-11 rounded-full object-cover border border-[var(--accent-gold)]/40"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--foreground)]">{post.author || 'Kel Nnorom'}</h4>
                        <p className="text-[11px] text-[var(--muted)]">{post.authorRole || 'Operations & Growth'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                      Advising enterprise leadership and high-growth logistics operators on turnaround execution, digital asset monetization, and margin optimization.
                    </p>
                    <Link
                      to="/contact"
                      className="w-full py-2 px-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Consult with Kel</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* Sidebar Sticky Ad Unit */}
                  <BlogAdUnit placement="sidebar_sticky" category={post.category} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InsightDetailPage;
