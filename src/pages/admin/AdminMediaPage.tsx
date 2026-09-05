import React, { useState, useRef, useMemo } from 'react';
import { useCms } from '@/lib/cms-store';
import type { MediaAsset, MediaType, MediaCategory } from '@/types/cms';
import {
  Image as ImageIcon,
  Film,
  Music,
  FileText,
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Edit3,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Download,
  Eye,
  Layers,
  HardDrive,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  CheckSquare,
  Square,
  Wand2,
} from 'lucide-react';

export function AdminMediaPage() {
  const {
    state,
    addMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
    batchDeleteMediaAssets,
    resetMediaToSeed,
  } = useCms();

  const mediaAssets = useMemo(() => state.mediaAssets || [], [state.mediaAssets]);

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected for Batch Operations
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [previewModalAsset, setPreviewModalAsset] = useState<MediaAsset | null>(null);

  // New Media Upload Form State
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('url');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<MediaType>('image');
  const [newCategory, setNewCategory] = useState<MediaCategory>('general');
  const [newAltText, setNewAltText] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTagsString, setNewTagsString] = useState('executive, portfolio, strategy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Adjustment preview filter
  const [activeFilterPreset, setActiveFilterPreset] = useState<string>('none');

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Collect All Unique Tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    mediaAssets.forEach((a) => a.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [mediaAssets]);

  // Collect All Unique Categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    mediaAssets.forEach((a) => a.category && set.add(a.category));
    return Array.from(set);
  }, [mediaAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      const matchesSearch =
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.altText && asset.altText.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.tags && asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesType = selectedType === 'all' || asset.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || (asset.tags && asset.tags.includes(selectedTag));

      return matchesSearch && matchesType && matchesCategory && matchesTag;
    });
  }, [mediaAssets, searchQuery, selectedType, selectedCategory, selectedTag]);

  // Storage calculation
  const storageStats = useMemo(() => {
    const totalBytes = mediaAssets.reduce((acc, a) => acc + (a.fileSizeBytes || 500000), 0);
    const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
    const imagesCount = mediaAssets.filter((a) => a.type === 'image').length;
    const audioCount = mediaAssets.filter((a) => a.type === 'audio').length;
    const videoCount = mediaAssets.filter((a) => a.type === 'video').length;
    const docCount = mediaAssets.filter((a) => a.type === 'document').length;
    return { totalMb, imagesCount, audioCount, videoCount, docCount };
  }, [mediaAssets]);

  // Handle Local File Selection
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewUrl(dataUrl);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      if (file.type.startsWith('image/')) setNewType('image');
      else if (file.type.startsWith('video/')) setNewType('video');
      else if (file.type.startsWith('audio/')) setNewType('audio');
      else setNewType('document');
    };
    reader.readAsDataURL(file);
  };

  // Handle Add Asset Submission
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please provide a title and media file/URL');
      return;
    }

    const tags = newTagsString
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const asset: MediaAsset = {
      id: `media-${Date.now()}`,
      title: newTitle.trim(),
      filename: `${newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${newType === 'image' ? 'jpg' : newType === 'video' ? 'mp4' : newType === 'audio' ? 'mp3' : 'pdf'}`,
      url: newUrl.trim(),
      type: newType,
      category: newCategory,
      mimeType:
        newType === 'image'
          ? 'image/jpeg'
          : newType === 'video'
          ? 'video/mp4'
          : newType === 'audio'
          ? 'audio/mpeg'
          : 'application/pdf',
      sizeBytes: 1250000,
      fileSizeBytes: 1250000,
      fileSizeFormatted: '1.25 MB',
      dimensions: newType === 'image' ? { width: 1920, height: 1080 } : undefined,
      durationSeconds: newType === 'audio' ? 142 : newType === 'video' ? 320 : undefined,
      durationFormatted: newType === 'audio' ? '02:22' : newType === 'video' ? '05:20' : undefined,
      altText: newAltText.trim() || newTitle.trim(),
      description: newDescription.trim(),
      tags,
      author: 'Kel Nnorom Executive Office',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMediaAsset(asset);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewAltText('');
    setNewDescription('');
    showNotification(`Added asset "${asset.title}" to multimedia repository.`);
  };

  // Batch Selection Toggle
  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleBatchDelete = () => {
    if (confirm(`Permanently remove ${selectedAssetIds.length} selected multimedia assets?`)) {
      batchDeleteMediaAssets(selectedAssetIds);
      setSelectedAssetIds([]);
      showNotification(`Deleted ${selectedAssetIds.length} assets.`);
    }
  };

  const handleExportManifest = () => {
    const json = JSON.stringify(mediaAssets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kel-nnorom-multimedia-manifest-${Date.now()}.json`;
    a.click();
    showNotification('Exported Multimedia Manifest JSON.');
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs opacity-60">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            CREATIVE & MULTIMEDIA ASSET ENGINE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>State-of-the-Art Multimedia Library</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage high-resolution photography, executive voice briefings, video documentaries, and technical whitepapers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportManifest}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-medium text-[var(--foreground)] flex items-center gap-1.5 transition-all"
            title="Download JSON manifest of all media assets"
          >
            <Download size={14} />
            <span>Export Manifest</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Revert multimedia assets library to standard high-resolution seeds?')) {
                resetMediaToSeed();
                showNotification('Multimedia assets restored to default seed catalog.');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--foreground)] text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw size={14} />
            <span>Reset Seeds</span>
          </button>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center gap-2 transition-all"
          >
            <Upload size={15} />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Storage & Distribution Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono flex items-center gap-1.5">
            <HardDrive size={13} className="text-[var(--accent-gold)]" />
            Total Assets
          </div>
          <div className="text-xl font-bold text-[var(--foreground)] mt-1 font-mono">{mediaAssets.length}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">~{storageStats.totalMb} MB Stored</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono flex items-center gap-1.5">
            <ImageIcon size={13} className="text-blue-400" />
            Images & Banners
          </div>
          <div className="text-xl font-bold text-[var(--foreground)] mt-1 font-mono">{storageStats.imagesCount}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">Retina & WebP</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono flex items-center gap-1.5">
            <Music size={13} className="text-amber-400" />
            Voice Memos & Audio
          </div>
          <div className="text-xl font-bold text-[var(--foreground)] mt-1 font-mono">{storageStats.audioCount}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">Lossless Podcasts</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono flex items-center gap-1.5">
            <Film size={13} className="text-purple-400" />
            Video Features
          </div>
          <div className="text-xl font-bold text-[var(--foreground)] mt-1 font-mono">{storageStats.videoCount}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">4K & 1080p Streams</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-bold text-[var(--muted)] font-mono flex items-center gap-1.5">
            <FileText size={13} className="text-emerald-400" />
            Whitepapers & PDFs
          </div>
          <div className="text-xl font-bold text-[var(--foreground)] mt-1 font-mono">{storageStats.docCount}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">Executive Docs</div>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title, alt text, tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: 'all', label: 'All', icon: Layers },
            { id: 'image', label: 'Images', icon: ImageIcon },
            { id: 'audio', label: 'Audio', icon: Music },
            { id: 'video', label: 'Video', icon: Film },
            { id: 'document', label: 'Docs', icon: FileText },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedType === type.id
                  ? 'bg-[var(--accent-gold)] text-black shadow-sm font-bold'
                  : 'bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <type.icon size={13} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Category & Tag Dropdowns */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-[var(--surface-elevated)] p-0.5 border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[var(--surface)] text-[var(--accent-gold)] shadow-xs' : 'text-[var(--muted)]'}`}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[var(--surface)] text-[var(--accent-gold)] shadow-xs' : 'text-[var(--muted)]'}`}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Action Toolbar */}
      {selectedAssetIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--accent-gold)]">
              {selectedAssetIds.length} asset{selectedAssetIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedAssetIds([])}
              className="text-xs text-[var(--muted)] hover:underline"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchDelete}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                className={`group relative rounded-2xl bg-[var(--surface)] border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]'
                    : 'border-[var(--border)] hover:border-[var(--accent-gold)]/50'
                }`}
              >
                {/* Media Preview Stage */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden flex items-center justify-center">
                  {asset.type === 'image' && (
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {asset.type === 'video' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-950/40 to-black/60 p-4 text-center">
                      <Film className="w-10 h-10 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-mono text-purple-200">
                        {asset.durationFormatted || 'HD Video'}
                      </span>
                    </div>
                  )}

                  {asset.type === 'audio' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-amber-950/40 to-black/60 p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 border border-amber-500/30">
                        <Music className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-amber-200">
                        {asset.durationFormatted || 'Audio Stream'}
                      </span>
                    </div>
                  )}

                  {asset.type === 'document' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-950/40 to-black/60 p-4 text-center">
                      <FileText className="w-10 h-10 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-mono text-emerald-200 uppercase">
                        {asset.mimeType?.split('/')[1] || 'PDF DOC'}
                      </span>
                    </div>
                  )}

                  {/* Multi-Select Checkbox Overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectAsset(asset.id);
                    }}
                    className="absolute top-2.5 left-2.5 p-1 rounded-md bg-black/60 text-white hover:text-[var(--accent-gold)] backdrop-blur-sm z-10"
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-[var(--accent-gold)]" />
                    ) : (
                      <Square size={16} className="opacity-70" />
                    )}
                  </button>

                  {/* Type Badge */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-black/70 backdrop-blur-sm text-[var(--accent-gold)] border border-white/10">
                    {asset.type}
                  </span>

                  {/* Quick Inspect Hover Trigger */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewModalAsset(asset)}
                      className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground)] hover:text-[var(--accent-gold)] border border-[var(--border)]"
                      title="Quick Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedAsset(asset)}
                      className="p-2 rounded-lg bg-[var(--accent-gold)] text-black font-bold"
                      title="Edit Metadata & Adjustments"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(asset.url, `card-${asset.id}`)}
                      className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground)] hover:text-emerald-400 border border-[var(--border)]"
                      title="Copy Public URL"
                    >
                      {copiedKey === `card-${asset.id}` ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xs font-bold text-[var(--foreground)] line-clamp-1" title={asset.title}>
                      {asset.title}
                    </h2>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
                    <span>{asset.fileSizeFormatted || '1.2 MB'}</span>
                    {asset.dimensions && (
                      <span>
                        {asset.dimensions.width}×{asset.dimensions.height}
                      </span>
                    )}
                  </div>

                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {asset.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed List Table View */
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-elevated)] border-b border-[var(--border)] text-[10px] font-mono uppercase text-[var(--muted)]">
                <tr>
                  <th className="p-3.5 w-10">
                    <button onClick={handleSelectAll}>
                      {selectedAssetIds.length === filteredAssets.length ? (
                        <CheckSquare size={15} className="text-[var(--accent-gold)]" />
                      ) : (
                        <Square size={15} />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5">Asset</th>
                  <th className="p-3.5">Type & MIME</th>
                  <th className="p-3.5">Dimensions / Duration</th>
                  <th className="p-3.5">File Size</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAssetIds.includes(asset.id);
                  return (
                    <tr
                      key={asset.id}
                      className={`hover:bg-[var(--surface-elevated)] transition-colors ${
                        isSelected ? 'bg-[var(--accent-gold)]/5' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <button onClick={() => toggleSelectAsset(asset.id)}>
                          {isSelected ? (
                            <CheckSquare size={15} className="text-[var(--accent-gold)]" />
                          ) : (
                            <Square size={15} className="opacity-60" />
                          )}
                        </button>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-9 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-[var(--border)] flex items-center justify-center">
                            {asset.type === 'image' ? (
                              <img
                                src={asset.url}
                                alt={asset.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : asset.type === 'video' ? (
                              <Film size={16} className="text-purple-400" />
                            ) : asset.type === 'audio' ? (
                              <Music size={16} className="text-amber-400" />
                            ) : (
                              <FileText size={16} className="text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--foreground)]">{asset.title}</div>
                            <div className="text-[10px] text-[var(--muted)] font-mono">{asset.filename}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="uppercase font-bold text-[var(--accent-gold)]">{asset.type}</span>
                        <div className="text-[10px] text-[var(--muted)]">{asset.mimeType}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[var(--muted)]">
                        {asset.dimensions
                          ? `${asset.dimensions.width}×${asset.dimensions.height}`
                          : asset.durationFormatted
                          ? asset.durationFormatted
                          : '—'}
                      </td>
                      <td className="p-3.5 font-mono">{asset.fileSizeFormatted || '1.2 MB'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)]">
                          {asset.category || 'General'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewModalAsset(asset)}
                            className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] rounded"
                            title="Preview"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedAsset(asset)}
                            className="p-1.5 text-[var(--muted)] hover:text-[var(--accent-gold)] rounded"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(asset.url, `tbl-${asset.id}`)}
                            className="p-1.5 text-[var(--muted)] hover:text-emerald-400 rounded"
                            title="Copy URL"
                          >
                            {copiedKey === `tbl-${asset.id}` ? <Check size={15} /> : <Copy size={15} />}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove asset "${asset.title}"?`)) {
                                deleteMediaAsset(asset.id);
                                showNotification(`Removed asset "${asset.title}"`);
                              }
                            }}
                            className="p-1.5 text-[var(--muted)] hover:text-red-400 rounded"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Editor & Inspector Drawer / Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--foreground)]">Asset Inspector & Editor</h2>
                  <p className="text-xs text-[var(--muted)] font-mono">{selectedAsset.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              {/* Left Column: Visual Media Stage & Filter Tools */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-black flex items-center justify-center aspect-video relative">
                  {selectedAsset.type === 'image' && (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.title}
                      referrerPolicy="no-referrer"
                      style={{
                        filter:
                          activeFilterPreset === 'warm'
                            ? 'sepia(0.3) contrast(1.1) saturate(1.2)'
                            : activeFilterPreset === 'mono'
                            ? 'grayscale(1) contrast(1.2)'
                            : activeFilterPreset === 'cyber'
                            ? 'hue-rotate(180deg) saturate(1.4)'
                            : activeFilterPreset === 'punch'
                            ? 'contrast(1.3) brightness(1.05)'
                            : 'none',
                      }}
                      className="w-full h-full object-contain"
                    />
                  )}

                  {selectedAsset.type === 'audio' && (
                    <div className="w-full p-6 text-center space-y-3">
                      <Volume2 className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                      <audio controls className="w-full">
                        <source src={selectedAsset.url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {selectedAsset.type === 'video' && (
                    <video controls className="w-full h-full">
                      <source src={selectedAsset.url} type="video/mp4" />
                    </video>
                  )}

                  {selectedAsset.type === 'document' && (
                    <div className="p-6 text-center space-y-2">
                      <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                      <a
                        href={selectedAsset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--accent-gold)]"
                      >
                        <span>Open Document File</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Creative Adjustment Presets for Images */}
                {selectedAsset.type === 'image' && (
                  <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
                    <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <Wand2 size={13} className="text-[var(--accent-gold)]" />
                      <span>Creative Visual Presets</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'none', label: 'Default' },
                        { id: 'warm', label: 'Warm Gold' },
                        { id: 'mono', label: 'Noir' },
                        { id: 'punch', label: 'Punch' },
                        { id: 'cyber', label: 'Cyber' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setActiveFilterPreset(preset.id)}
                          className={`px-2 py-1 rounded text-[10px] font-medium border transition-all ${
                            activeFilterPreset === preset.id
                              ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] font-bold'
                              : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Embed Tag Generators */}
                <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
                  <div className="text-xs font-bold text-[var(--foreground)]">Quick Embed Synthesizers</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] p-2 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">
                      <span className="truncate pr-2">! [{selectedAsset.title}]({selectedAsset.url})</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(`![${selectedAsset.title}](${selectedAsset.url})`, 'md-embed')
                        }
                        className="text-[var(--accent-gold)] hover:underline shrink-0 text-[10px]"
                      >
                        {copiedKey === 'md-embed' ? 'Copied' : 'Markdown'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] p-2 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">
                      <span className="truncate pr-2">
                        &lt;img src=&quot;{selectedAsset.url}&quot; alt=&quot;{selectedAsset.altText || selectedAsset.title}&quot; /&gt;
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `<img src="${selectedAsset.url}" alt="${selectedAsset.altText || selectedAsset.title}" />`,
                            'html-embed'
                          )
                        }
                        className="text-[var(--accent-gold)] hover:underline shrink-0 text-[10px]"
                      >
                        {copiedKey === 'html-embed' ? 'Copied' : 'HTML'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Metadata Form Fields */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Asset Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedAsset.title}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Media Type
                    </label>
                    <select
                      value={selectedAsset.type}
                      onChange={(e) =>
                        setSelectedAsset({ ...selectedAsset, type: e.target.value as MediaType })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="document">Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={selectedAsset.category || ''}
                      onChange={(e) =>
                        setSelectedAsset({ ...selectedAsset, category: e.target.value as MediaCategory })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Direct Asset Source URL
                  </label>
                  <input
                    type="url"
                    value={selectedAsset.url}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Accessibility Alt Text
                  </label>
                  <input
                    type="text"
                    value={selectedAsset.altText || ''}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, altText: e.target.value })
                    }
                    placeholder="Descriptive text for accessibility screen readers"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Tags (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={(selectedAsset.tags || []).join(', ')}
                    onChange={(e) =>
                      setSelectedAsset({
                        ...selectedAsset,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="strategy, boardroom, keynote"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Description & Narrative Context
                  </label>
                  <textarea
                    rows={3}
                    value={selectedAsset.description || ''}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, description: e.target.value })
                    }
                    placeholder="Executive background narrative regarding this asset..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Permanently delete asset "${selectedAsset.title}"?`)) {
                        deleteMediaAsset(selectedAsset.id);
                        setSelectedAsset(null);
                        showNotification('Asset removed.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Delete Asset</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAsset(null)}
                      className="px-4 py-2 rounded-xl text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateMediaAsset(selectedAsset.id, selectedAsset);
                        showNotification(`Saved changes for "${selectedAsset.title}"`);
                        setSelectedAsset(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md"
                    >
                      Save Asset Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Visual Lightbox Preview Modal */}
      {previewModalAsset && (
        <div
          onClick={() => setPreviewModalAsset(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-2xl"
          >
            <div className="p-4 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">{previewModalAsset.title}</h3>
                <span className="text-[10px] font-mono text-[var(--accent-gold)] uppercase">
                  {previewModalAsset.type} • {previewModalAsset.fileSizeFormatted || '1.2 MB'}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalAsset(null)}
                className="text-lg font-bold text-[var(--muted)] hover:text-[var(--foreground)] px-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 min-h-[50vh]">
              {previewModalAsset.type === 'image' && (
                <img
                  src={previewModalAsset.url}
                  alt={previewModalAsset.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] object-contain rounded-lg"
                />
              )}

              {previewModalAsset.type === 'audio' && (
                <div className="p-8 text-center space-y-4 max-w-md w-full">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-500/30">
                    <Music size={36} />
                  </div>
                  <h4 className="text-base font-bold text-[var(--foreground)]">{previewModalAsset.title}</h4>
                  <audio controls className="w-full" autoPlay>
                    <source src={previewModalAsset.url} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {previewModalAsset.type === 'video' && (
                <video controls autoPlay className="max-h-[70vh] rounded-lg">
                  <source src={previewModalAsset.url} type="video/mp4" />
                </video>
              )}

              {previewModalAsset.type === 'document' && (
                <div className="p-8 text-center space-y-3">
                  <FileText className="w-20 h-20 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold">{previewModalAsset.title}</h4>
                  <p className="text-xs text-[var(--muted)] max-w-md mx-auto">{previewModalAsset.description}</p>
                  <a
                    href={previewModalAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs shadow-md"
                  >
                    <span>Download / Open Document</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                  <Upload size={18} />
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)]">Upload New Multimedia Asset</h2>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div className="px-6 pt-4 flex gap-2 border-b border-[var(--border)]">
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                  uploadTab === 'url'
                    ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                    : 'border-transparent text-[var(--muted)]'
                }`}
              >
                Import URL / Cloud Link
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                  uploadTab === 'file'
                    ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                    : 'border-transparent text-[var(--muted)]'
                }`}
              >
                Local File Picker
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-6 space-y-4">
              {uploadTab === 'file' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-gold)] rounded-2xl text-center cursor-pointer bg-[var(--surface-elevated)] transition-colors group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLocalFileChange}
                    accept="image/*,video/*,audio/*,application/pdf"
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 text-[var(--muted)] group-hover:text-[var(--accent-gold)] mx-auto mb-2 transition-colors" />
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    Click to select file from disk
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1">
                    Supports high-res PNG, JPEG, WebP, MP4, MP3, WAV, and PDF
                  </p>
                  {newUrl && (
                    <div className="mt-3 text-[11px] font-mono text-emerald-400 font-bold">
                      File Loaded ({newType.toUpperCase()})
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Media Resource URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Energy Transition Strategy Keynote"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Media Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MediaType)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                  >
                    <option value="image">Image / Banner</option>
                    <option value="audio">Audio Memo / Podcast</option>
                    <option value="video">Video Feature</option>
                    <option value="document">Technical Whitepaper / PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MediaCategory)}
                    placeholder="portfolio"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Tags (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  placeholder="strategy, executive, energy"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Contextual description of this multimedia item..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  <span>Register Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminMediaPage;
