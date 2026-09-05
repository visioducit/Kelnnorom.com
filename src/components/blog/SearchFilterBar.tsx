import { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Video,
  Headphones,
  ArrowUpDown,
  Command,
} from 'lucide-react';

export type MediaFilterType = 'all' | 'video' | 'audio' | 'framework';
export type DurationFilterType = 'all' | 'quick' | 'medium' | 'deep';
export type SortOptionType = 'recent' | 'longest' | 'shortest' | 'popular' | 'alpha';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  mediaFilter: MediaFilterType;
  onMediaFilterChange: (m: MediaFilterType) => void;
  durationFilter: DurationFilterType;
  onDurationFilterChange: (d: DurationFilterType) => void;
  sortBy: SortOptionType;
  onSortByChange: (s: SortOptionType) => void;
  categories: string[];
  totalResultsCount: number;
  totalAllCount: number;
  categoryCounts: Record<string, number>;
  onOpenSearchModal: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  mediaFilter,
  onMediaFilterChange,
  durationFilter,
  onDurationFilterChange,
  sortBy,
  onSortByChange,
  categories,
  totalResultsCount,
  totalAllCount,
  categoryCounts,
  onOpenSearchModal,
}: SearchFilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    mediaFilter !== 'all' ||
    durationFilter !== 'all' ||
    sortBy !== 'recent';

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onMediaFilterChange('all');
    onDurationFilterChange('all');
    onSortByChange('recent');
  };

  return (
    <div className="space-y-4 mb-10">
      {/* Primary Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-3.5 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search briefings by keyword, strategy, focus metric, or framework..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)] shadow-xs transition-colors"
          />

          <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}

            <button
              onClick={onOpenSearchModal}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
              title="Open Global Search Modal (⌘K)"
            >
              <Command size={10} />
              <span>K</span>
            </button>
          </div>
        </div>

        {/* Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              showAdvancedFilters || mediaFilter !== 'all' || durationFilter !== 'all'
                ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {(mediaFilter !== 'all' || durationFilter !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOptionType)}
              className="px-3.5 py-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none appearance-none pr-8 cursor-pointer shadow-xs"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="popular">Sort: Most Read</option>
              <option value="longest">Sort: Longest Briefing</option>
              <option value="shortest">Sort: Quickest Read</option>
              <option value="alpha">Sort: Title A-Z</option>
            </select>
            <ArrowUpDown
              size={12}
              className="absolute right-3 top-3.5 pointer-events-none text-[var(--muted)]"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            selectedCategory === 'All'
              ? 'bg-[var(--accent-gold)] text-black shadow-xs'
              : 'bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
          }`}
        >
          <span>All Briefings</span>
          <span className="text-[10px] font-mono opacity-80 font-bold">({totalAllCount})</span>
        </button>

        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] font-mono opacity-80 font-bold">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Tray */}
      {showAdvancedFilters && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Media Format Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2">
                Executive Media Format
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: 'video', label: 'Video Briefing', icon: Video },
                  { id: 'audio', label: 'Audio Podcast', icon: Headphones },
                  { id: 'framework', label: 'Lead Framework' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onMediaFilterChange(item.id as MediaFilterType)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all text-left truncate cursor-pointer ${
                      mediaFilter === item.id
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Duration Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2">
                Reading Duration
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'Any Duration' },
                  { id: 'quick', label: '< 5 min (Fast)' },
                  { id: 'medium', label: '5–10 min (Standard)' },
                  { id: 'deep', label: '10+ min (Deep Dive)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onDurationFilterChange(item.id as DurationFilterType)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all text-left truncate cursor-pointer ${
                      durationFilter === item.id
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Action Status */}
            <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-between">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2">
                Active Filter Results
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs text-[var(--foreground)] font-mono">
                  <strong>{totalResultsCount}</strong> of {totalAllCount} match
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-mono text-[var(--accent-gold)] hover:underline font-bold cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Status summary bar when active */}
      {hasActiveFilters && !showAdvancedFilters && (
        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] px-1">
          <span>
            Displaying <strong>{totalResultsCount}</strong> operational briefings
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[var(--accent-gold)] hover:underline font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
