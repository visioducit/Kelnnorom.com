import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  Clock,
  Video,
  Headphones,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import type { Insight } from '@/types/content';

interface BlogSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: Insight[];
}

export function BlogSearchModal({ isOpen, onClose, insights }: BlogSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const trendingTopics = [
    'Turnaround',
    'EBITDA',
    'Telemetry',
    'Arbitrage',
    'Supply Chain',
    'Margin Leakage',
    'Yield',
  ];

  // Filtered insights matching query across title, excerpt, body, tags, category, focusKeyword
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return insights.filter((i) => i.published !== false).slice(0, 5);
    }

    return insights
      .filter((insight) => {
        if (insight.published === false) return false;
        const inTitle = insight.title.toLowerCase().includes(q);
        const inExcerpt = insight.excerpt.toLowerCase().includes(q);
        const inCategory = insight.category.toLowerCase().includes(q);
        const inTags = (insight.tags || []).some((t) => t.toLowerCase().includes(q));
        const inKeywords = (insight.seoKeywords || []).some((k) => k.toLowerCase().includes(q));
        const inFocus = insight.focusKeyword?.toLowerCase().includes(q);
        const inBody = insight.body?.toLowerCase().includes(q);

        return inTitle || inExcerpt || inCategory || inTags || inKeywords || inFocus || inBody;
      })
      .slice(0, 8);
  }, [insights, query]);

  // Keyboard navigation inside search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        navigate(`/insights/${filteredResults[selectedIndex].slug}`);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[var(--foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--surface-elevated)]">
          <Search size={18} className="text-[var(--accent-gold)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search executive briefings, turnaround frameworks, telemetry..."
            className="w-full bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
            ESC
          </span>
        </div>

        {/* Trending Chips */}
        <div className="px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase font-bold shrink-0 flex items-center gap-1">
            <TrendingUp size={11} className="text-[var(--accent-gold)]" />
            Trending:
          </span>
          {trendingTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setQuery(topic);
                setSelectedIndex(0);
              }}
              className="px-2.5 py-1 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap cursor-pointer text-xs"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-3 divide-y divide-[var(--border)]">
          {filteredResults.length === 0 ? (
            <div className="p-10 text-center text-xs text-[var(--muted)] space-y-2">
              <BookOpen size={24} className="mx-auto text-[var(--muted)]/50" />
              <p>No operational briefings found matching &ldquo;{query}&rdquo;.</p>
              <p className="text-[10px] font-mono">Try searching for keywords like &quot;turnaround&quot;, &quot;arbitrage&quot;, or &quot;supply chain&quot;.</p>
            </div>
          ) : (
            filteredResults.map((insight, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={insight.slug}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    navigate(`/insights/${insight.slug}`);
                    onClose();
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[var(--surface-elevated)] border border-[var(--accent-gold)]/40 shadow-xs'
                      : 'hover:bg-[var(--surface-elevated)]/60'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] font-mono">
                        {insight.category}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1">
                        <Clock size={10} />
                        {insight.readingTime || '5 min read'}
                      </span>
                      {insight.videoUrl && (
                        <span className="text-[10px] text-blue-400 font-mono flex items-center gap-0.5">
                          <Video size={10} /> Video
                        </span>
                      )}
                      {insight.audioUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                          <Headphones size={10} /> Audio
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                      {insight.title}
                    </h4>

                    <p className="text-xs text-[var(--muted)] line-clamp-1">
                      {insight.excerpt}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`shrink-0 transition-transform ${
                      isSelected
                        ? 'text-[var(--accent-gold)] translate-x-1'
                        : 'text-[var(--muted)]'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-[var(--surface-elevated)] border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--muted)] px-4">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Showing {filteredResults.length} briefings</span>
        </div>
      </div>
    </div>
  );
}
