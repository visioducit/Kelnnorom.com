import type { Insight } from '@/types/content';

export interface RecommendedPostMatch {
  insight: Insight;
  score: number;
  matchPercentage: number;
  matchReasons: string[];
}

/**
 * Multi-factor recommendation engine for strategic blog insights.
 * Analyzes taxonomy, thematic keywords, tag intersections, and multimedia traits.
 */
export function getRelatedInsights(
  currentInsight: Insight,
  allInsights: Insight[],
  limit: number = 3
): RecommendedPostMatch[] {
  if (!currentInsight || !allInsights || allInsights.length <= 1) {
    return [];
  }

  // Filter out current post and unpublished posts
  const candidates = allInsights.filter(
    (item) => item.slug !== currentInsight.slug && item.published !== false
  );

  const currentTags = new Set((currentInsight.tags || []).map((t) => t.toLowerCase().trim()));
  const currentKeywords = new Set(
    [
      ...(currentInsight.seoKeywords || []),
      currentInsight.focusKeyword || '',
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase().trim())
  );
  
  // Extract key terms from title and excerpt
  const currentTitleWords = new Set(
    currentInsight.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const scored: RecommendedPostMatch[] = candidates.map((candidate) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Category Alignment (Weight: 35)
    if (candidate.category && currentInsight.category) {
      if (candidate.category.toLowerCase() === currentInsight.category.toLowerCase()) {
        score += 35;
        reasons.push(`${currentInsight.category} Series`);
      }
    }

    // 2. Tag Intersection (Weight: up to 30)
    const candidateTags = (candidate.tags || []).map((t) => t.toLowerCase().trim());
    const sharedTags: string[] = [];
    candidateTags.forEach((tag) => {
      if (currentTags.has(tag)) {
        sharedTags.push(tag);
      }
    });

    if (sharedTags.length > 0) {
      const tagBonus = Math.min(30, sharedTags.length * 15);
      score += tagBonus;
      reasons.push(`Shared Focus: ${sharedTags.slice(0, 2).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}`);
    }

    // 3. Keyword / SEO overlap (Weight: up to 20)
    const candidateKeywords = [
      ...(candidate.seoKeywords || []),
      candidate.focusKeyword || '',
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase().trim());

    const sharedKeywords = candidateKeywords.filter((k) => currentKeywords.has(k));
    if (sharedKeywords.length > 0) {
      score += Math.min(20, sharedKeywords.length * 10);
      reasons.push('Strategic Thematic Match');
    }

    // 4. Title Term Affinity (Weight: up to 15)
    const candidateTitleWords = candidate.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const sharedTerms = candidateTitleWords.filter((w) => currentTitleWords.has(w));
    if (sharedTerms.length > 0) {
      score += Math.min(15, sharedTerms.length * 5);
      if (!reasons.includes('Strategic Thematic Match')) {
        reasons.push('Contextual Correlation');
      }
    }

    // 5. Multimedia format bonus (Weight: 5)
    if ((candidate.audioUrl && currentInsight.audioUrl) || (candidate.videoUrl && currentInsight.videoUrl)) {
      score += 5;
      reasons.push('Executive Briefing Media');
    }

    // Ensure fallback baseline score for variety
    const normalizedScore = Math.min(99, Math.max(55, score));
    const finalReasons = reasons.length > 0 ? reasons.slice(0, 2) : ['Editorial Recommendation'];

    return {
      insight: candidate,
      score: normalizedScore,
      matchPercentage: normalizedScore,
      matchReasons: finalReasons,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
