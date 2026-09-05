import React, { useState, useMemo } from 'react';
import { useCms } from '@/lib/cms-store';
import type { AdCampaign, AdPlacementPosition, AdFormat, AdPricingModel } from '@/types/ads';
import { placementZonesInfo } from '@/content/ads-seed';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Power,
  Sparkles,
  ShieldCheck,
  Layout,
  RefreshCw,
  X,
  Layers,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AdminAdsPage: React.FC = () => {
  const {
    state,
    addAdCampaign,
    updateAdCampaign,
    deleteAdCampaign,
    toggleAdCampaignStatus,
    resetAdsToSeed,
  } = useCms();

  const { adCampaigns } = state;
  const adEvents = state.adEvents || [];

  // Active Tab: 'campaigns' | 'zones' | 'analytics'
  const [activeTab, setActiveTab] = useState<'campaigns' | 'zones' | 'analytics'>('campaigns');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlacement, setFilterPlacement] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');

  // Modal: Add / Edit Campaign
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState<Partial<AdCampaign>>({
    title: '',
    advertiser: '',
    companyLogoUrl: '',
    format: 'native_card',
    placement: 'feed_card',
    headline: '',
    description: '',
    ctaText: 'Learn More',
    ctaUrl: 'https://',
    badgeText: 'SPONSORED',
    imageUrl: '',
    active: true,
    priority: 8,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '2026-12-31',
    targetCategories: ['All'],
    pricingModel: 'cpm',
    costPerUnit: 25.0,
    budget: 5000,
  });

  // Selected Zone for live preview inspection
  const [inspectZone, setInspectZone] = useState<AdPlacementPosition>('feed_card');

  // Aggregated Stats
  const stats = useMemo(() => {
    let totalImpressions = 0;
    let totalClicks = 0;
    let estimatedRevenue = 0;

    adCampaigns.forEach((c) => {
      totalImpressions += c.impressionsCount || 0;
      totalClicks += c.clicksCount || 0;

      if (c.pricingModel === 'cpm') {
        estimatedRevenue += ((c.impressionsCount || 0) / 1000) * (c.costPerUnit || 0);
      } else if (c.pricingModel === 'cpc') {
        estimatedRevenue += (c.clicksCount || 0) * (c.costPerUnit || 0);
      } else if (c.pricingModel === 'fixed_sponsor') {
        estimatedRevenue += c.budget || 0;
      }
    });

    const averageCtr =
      totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return {
      totalImpressions,
      totalClicks,
      averageCtr,
      estimatedRevenue: Math.round(estimatedRevenue),
      activeCount: adCampaigns.filter((c) => c.active).length,
      totalCount: adCampaigns.length,
    };
  }, [adCampaigns]);

  // Aggregate 7-Day Performance Chart Data
  const chartDailyData = useMemo(() => {
    const dayMap: Record<string, { date: string; impressions: number; clicks: number }> = {};

    adCampaigns.forEach((camp) => {
      camp.dailyStats?.forEach((d) => {
        if (!dayMap[d.date]) {
          dayMap[d.date] = { date: d.date.slice(5), impressions: 0, clicks: 0 };
        }
        dayMap[d.date].impressions += d.impressions;
        dayMap[d.date].clicks += d.clicks;
      });
    });

    const sorted = Object.values(dayMap).sort((a, b) => (a.date > b.date ? 1 : -1));
    return sorted.length > 0
      ? sorted
      : [
          { date: '08-27', impressions: 12000, clicks: 540 },
          { date: '08-28', impressions: 14500, clicks: 680 },
          { date: '08-29', impressions: 16800, clicks: 820 },
          { date: '08-30', impressions: 19400, clicks: 940 },
          { date: '08-31', impressions: 17200, clicks: 790 },
          { date: '09-01', impressions: 15300, clicks: 690 },
        ];
  }, [adCampaigns]);

  // Placement breakdown data
  const chartPlacementData = useMemo(() => {
    return placementZonesInfo.map((z) => {
      const camps = adCampaigns.filter((c) => c.placement === z.placement);
      const imps = camps.reduce((acc, c) => acc + (c.impressionsCount || 0), 0);
      const clks = camps.reduce((acc, c) => acc + (c.clicksCount || 0), 0);
      return {
        name: z.label.replace(' Announcement Banner', '').replace(' In-Article', ''),
        impressions: imps,
        clicks: clks,
      };
    });
  }, [adCampaigns]);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return adCampaigns.filter((camp) => {
      if (filterPlacement !== 'all' && camp.placement !== filterPlacement) return false;
      if (filterStatus === 'active' && !camp.active) return false;
      if (filterStatus === 'paused' && camp.active) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = camp.title.toLowerCase().includes(q);
        const mAdv = camp.advertiser.toLowerCase().includes(q);
        const mHead = camp.headline.toLowerCase().includes(q);
        if (!mTitle && !mAdv && !mHead) return false;
      }
      return true;
    });
  }, [adCampaigns, filterPlacement, filterStatus, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCampaignId(null);
    setCampaignForm({
      title: '',
      advertiser: '',
      companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      format: 'native_card',
      placement: 'feed_card',
      headline: '',
      description: '',
      ctaText: 'Access Briefing',
      ctaUrl: 'https://',
      badgeText: 'PARTNER BRIEFING',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      active: true,
      priority: 8,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-12-31',
      targetCategories: ['All'],
      pricingModel: 'cpm',
      costPerUnit: 35.0,
      budget: 6000,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (camp: AdCampaign) => {
    setEditingCampaignId(camp.id);
    setCampaignForm({ ...camp });
    setIsModalOpen(true);
  };

  // Save Campaign
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.advertiser || !campaignForm.headline) {
      alert('Please fill out all required campaign fields.');
      return;
    }

    if (editingCampaignId) {
      updateAdCampaign(editingCampaignId, campaignForm);
    } else {
      const newCamp: AdCampaign = {
        id: `camp-${Date.now()}`,
        title: campaignForm.title!,
        advertiser: campaignForm.advertiser!,
        companyLogoUrl: campaignForm.companyLogoUrl,
        format: (campaignForm.format as AdFormat) || 'native_card',
        placement: (campaignForm.placement as AdPlacementPosition) || 'feed_card',
        headline: campaignForm.headline!,
        description: campaignForm.description || '',
        ctaText: campaignForm.ctaText || 'Learn More',
        ctaUrl: campaignForm.ctaUrl || 'https://',
        badgeText: campaignForm.badgeText || 'SPONSORED',
        imageUrl: campaignForm.imageUrl,
        active: campaignForm.active ?? true,
        priority: campaignForm.priority || 5,
        startDate: campaignForm.startDate || new Date().toISOString().slice(0, 10),
        endDate: campaignForm.endDate || '2026-12-31',
        targetCategories: campaignForm.targetCategories || ['All'],
        pricingModel: (campaignForm.pricingModel as AdPricingModel) || 'cpm',
        costPerUnit: campaignForm.costPerUnit || 0,
        budget: campaignForm.budget || 0,
        impressionsCount: 0,
        clicksCount: 0,
        dailyStats: [],
        createdAt: new Date().toISOString(),
      };
      addAdCampaign(newCamp);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8" id="admin-ads-root">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-serif">
                Advert Serving & Sponsorship Management
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-accent-500/20 text-accent-300 border border-accent-500/30">
                Enterprise Ad Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage executive partner sponsorships, native blog placements, CPM/CPC telemetry, and impressions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAdsToSeed}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            title="Revert to default seed inventory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Inventory
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-accent-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">
            {stats.totalImpressions.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% this month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Click-Throughs</span>
            <MousePointerClick className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">
            {stats.totalClicks.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-blue-400 font-mono">
            <span>Blended CTR: {stats.averageCtr}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Monetization & Ad Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">
            ${stats.estimatedRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>Active Partner Bookings</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Units / Inventory</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">
            {stats.activeCount} <span className="text-slate-500 text-base font-normal">/ {stats.totalCount}</span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-purple-400 font-mono">
            <span>6 High-Impact Zones</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'campaigns' as const, label: 'Campaign Inventory', icon: Layers },
          { id: 'zones' as const, label: 'Placement Zones & Inspector', icon: Layout },
          { id: 'analytics' as const, label: 'Telemetry & Analytics', icon: Activity },
        ].map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-accent-500 text-navy-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <IconC className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CAMPAIGN INVENTORY */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaign, advertiser, headline..."
                className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterPlacement}
                onChange={(e) => setFilterPlacement(e.target.value)}
                className="bg-slate-950 text-slate-300 text-xs p-2 rounded-xl border border-slate-800 focus:outline-none"
              >
                <option value="all">All Placements</option>
                {placementZonesInfo.map((z) => (
                  <option key={z.placement} value={z.placement}>
                    {z.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'paused')}
                className="bg-slate-950 text-slate-300 text-xs p-2 rounded-xl border border-slate-800 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="paused">Paused Only</option>
              </select>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Status</th>
                    <th className="p-4">Campaign & Advertiser</th>
                    <th className="p-4">Placement Zone</th>
                    <th className="p-4">Format</th>
                    <th className="p-4 text-right">Impressions</th>
                    <th className="p-4 text-right">Clicks (CTR)</th>
                    <th className="p-4 text-right">Model & Budget</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                        No campaigns found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((camp) => {
                      const ctr =
                        camp.impressionsCount && camp.impressionsCount > 0
                          ? (((camp.clicksCount || 0) / camp.impressionsCount) * 100).toFixed(2)
                          : '0.00';

                      return (
                        <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Active toggle */}
                          <td className="p-4">
                            <button
                              onClick={() => toggleAdCampaignStatus(camp.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                camp.active
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}
                              title={camp.active ? 'Active (Click to pause)' : 'Paused (Click to activate)'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          {/* Campaign title & advertiser */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {camp.companyLogoUrl ? (
                                <img
                                  src={camp.companyLogoUrl}
                                  alt={camp.advertiser}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-accent-500/20 text-accent-400 font-bold flex items-center justify-center text-xs shrink-0">
                                  {camp.advertiser.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-slate-200 truncate">{camp.title}</p>
                                <p className="text-[11px] text-slate-400 font-mono truncate">{camp.advertiser}</p>
                              </div>
                            </div>
                          </td>

                          {/* Placement */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-accent-300 border border-slate-800">
                              {camp.placement}
                            </span>
                          </td>

                          {/* Format */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                              {camp.format}
                            </span>
                          </td>

                          {/* Impressions */}
                          <td className="p-4 text-right font-mono text-slate-200 font-bold">
                            {(camp.impressionsCount || 0).toLocaleString()}
                          </td>

                          {/* Clicks */}
                          <td className="p-4 text-right font-mono">
                            <span className="text-slate-200 font-bold">{(camp.clicksCount || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-accent-400 ml-1.5 font-semibold">({ctr}%)</span>
                          </td>

                          {/* Model & Budget */}
                          <td className="p-4 text-right font-mono text-slate-300">
                            <div className="uppercase text-[10px] text-slate-400">{camp.pricingModel}</div>
                            <div>${(camp.budget || 0).toLocaleString()}</div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(camp)}
                                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Edit Campaign"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete campaign "${camp.title}"?`)) {
                                    deleteAdCampaign(camp.id);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 bg-slate-800 hover:bg-rose-950 rounded-lg transition-colors"
                                title="Delete Campaign"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLACEMENT ZONES & INSPECTOR */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Zones list (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-white font-serif mb-2">
              Registered Blog Placement Zones
            </h3>
            {placementZonesInfo.map((zone) => {
              const isSelected = inspectZone === zone.placement;
              const activeInZone = adCampaigns.filter((c) => c.placement === zone.placement && c.active).length;

              return (
                <div
                  key={zone.placement}
                  onClick={() => setInspectZone(zone.placement)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-accent-500/60 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{zone.label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-accent-400 border border-slate-800">
                      {activeInZone} Active Unit{activeInZone === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    {zone.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>Target CTR: {zone.averageCtrTargetPct}%</span>
                    <span>{zone.recommendedDimensions}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preview Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-accent-400" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">
                    Live Zone Preview: <span className="text-accent-400">{inspectZone}</span>
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Interactive Preview
                </span>
              </div>

              {/* Render preview of chosen ad */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                {(() => {
                  const sampleCamp = adCampaigns.find((c) => c.placement === inspectZone && c.active) || adCampaigns[0];
                  if (!sampleCamp) {
                    return <p className="text-xs font-mono text-slate-500 py-8 text-center">No active campaign for this zone.</p>;
                  }

                  if (inspectZone === 'header_top_banner') {
                    return (
                      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border border-primary-500/30 p-3 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-accent-500/20 text-accent-400">
                            {sampleCamp.badgeText}
                          </span>
                          <span className="font-medium text-slate-200">{sampleCamp.headline}</span>
                        </div>
                        <button className="px-3 py-1 bg-accent-500 text-navy-950 font-bold rounded text-[11px]">
                          {sampleCamp.ctaText}
                        </button>
                      </div>
                    );
                  }

                  if (inspectZone === 'in_article_inline') {
                    return (
                      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-accent-500/30 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-500/20 text-accent-400">
                            {sampleCamp.badgeText}
                          </span>
                          <span className="text-xs font-mono text-slate-400">By {sampleCamp.advertiser}</span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-white mb-1.5">{sampleCamp.headline}</h4>
                        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{sampleCamp.description}</p>
                        <button className="px-4 py-2 bg-accent-500 text-navy-950 font-bold rounded-lg text-xs">
                          {sampleCamp.ctaText}
                        </button>
                      </div>
                    );
                  }

                  // Default card view
                  return (
                    <div className="p-5 rounded-xl bg-slate-900 border border-primary-500/30 text-white max-w-sm mx-auto shadow-lg">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 text-xs">
                        <span className="font-mono text-slate-300">{sampleCamp.advertiser}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-accent-500/20 text-accent-400 font-bold">
                          {sampleCamp.badgeText}
                        </span>
                      </div>
                      {sampleCamp.imageUrl && (
                        <img
                          src={sampleCamp.imageUrl}
                          alt="preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h5 className="font-serif font-bold text-sm mb-1.5 text-white">{sampleCamp.headline}</h5>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-4">{sampleCamp.description}</p>
                      <button className="w-full py-2 bg-accent-500 text-navy-950 font-bold rounded-lg text-xs">
                        {sampleCamp.ctaText}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEMETRY & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day Performance Trend */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">
                    7-Day Impressions & Click Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">Daily volume progression</p>
                </div>
                <span className="text-xs font-mono text-accent-400">Live Sync</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorImps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#f59e0b" fillOpacity={1} fill="url(#colorImps)" />
                    <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#38bdf8" fillOpacity={1} fill="url(#colorClks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance by Zone */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">
                    Placement Zone Engagement Distribution
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">Impressions by editorial position</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartPlacementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="impressions" name="Impressions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicks" name="Clicks" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">
                  Real-Time Event Stream (Last 50 Events)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {adEvents.length} recorded events
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 font-mono text-[11px]">
              {adEvents.length === 0 ? (
                <p className="text-slate-500 py-4 text-center">No telemetry events logged yet this session.</p>
              ) : (
                adEvents.map((evt) => (
                  <div key={evt.id} className="py-2 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          evt.type === 'click'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {evt.type}
                      </span>
                      <span>Campaign: {evt.campaignId}</span>
                      <span className="text-slate-500">[{evt.placement}]</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                      <span>{evt.device}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Campaign Create / Edit Modal */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingCampaignId ? 'Edit Ad Campaign' : 'Create New Sponsor Campaign'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Campaign Internal Title *</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                    placeholder="e.g., AWS Enterprise Telemetry Q3"
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Advertiser / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.advertiser}
                    onChange={(e) => setCampaignForm({ ...campaignForm, advertiser: e.target.value })}
                    placeholder="e.g., Amazon Web Services"
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Placement Zone *</label>
                  <select
                    value={campaignForm.placement}
                    onChange={(e) => setCampaignForm({ ...campaignForm, placement: e.target.value as AdPlacementPosition })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  >
                    {placementZonesInfo.map((z) => (
                      <option key={z.placement} value={z.placement}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Format Type</label>
                  <select
                    value={campaignForm.format}
                    onChange={(e) => setCampaignForm({ ...campaignForm, format: e.target.value as AdFormat })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  >
                    <option value="native_card">Native Grid Card</option>
                    <option value="sponsored_brief">In-Article Briefing</option>
                    <option value="custom_banner">Sticky Banner Widget</option>
                    <option value="house_ad">House Executive Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Display Headline *</label>
                <input
                  type="text"
                  required
                  value={campaignForm.headline}
                  onChange={(e) => setCampaignForm({ ...campaignForm, headline: e.target.value })}
                  placeholder="e.g., Scale Fleet Telemetry & Sub-5ms Decision Latency"
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Description Copy</label>
                <textarea
                  rows={3}
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="High-converting executive copy..."
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={campaignForm.badgeText}
                    onChange={(e) => setCampaignForm({ ...campaignForm, badgeText: e.target.value })}
                    placeholder="e.g., PARTNER BRIEFING"
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={campaignForm.ctaText}
                    onChange={(e) => setCampaignForm({ ...campaignForm, ctaText: e.target.value })}
                    placeholder="e.g., Access Whitepaper"
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Destination URL *</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.ctaUrl}
                    onChange={(e) => setCampaignForm({ ...campaignForm, ctaUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={campaignForm.imageUrl}
                    onChange={(e) => setCampaignForm({ ...campaignForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Logo URL (Optional)</label>
                  <input
                    type="url"
                    value={campaignForm.companyLogoUrl}
                    onChange={(e) => setCampaignForm({ ...campaignForm, companyLogoUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Pricing Model</label>
                  <select
                    value={campaignForm.pricingModel}
                    onChange={(e) => setCampaignForm({ ...campaignForm, pricingModel: e.target.value as AdPricingModel })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  >
                    <option value="cpm">CPM (Per 1k Impressions)</option>
                    <option value="cpc">CPC (Per Click)</option>
                    <option value="fixed_sponsor">Fixed Term Sponsorship</option>
                    <option value="free_house">House / Direct Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Cost / Unit ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={campaignForm.costPerUnit}
                    onChange={(e) => setCampaignForm({ ...campaignForm, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) => setCampaignForm({ ...campaignForm, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/60 -mx-6 -mb-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  {editingCampaignId ? 'Update Campaign' : 'Publish Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
