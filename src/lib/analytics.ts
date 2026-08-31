export type AnalyticsEvent =
  | 'page_view'
  | 'hero_cta_click'
  | 'work_case_open'
  | 'case_study_view'
  | 'capability_select'
  | 'system_node_select'
  | 'timeline_item_open'
  | 'executive_brief_open'
  | 'executive_profile_download'
  | 'linkedin_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'work_with_kel_click'
  | 'insight_open'
  | 'project_filter_use';

type AnalyticsAdapter = {
  track: (event: AnalyticsEvent, properties?: Record<string, unknown>) => void;
};

let adapter: AnalyticsAdapter | null = null;

export function setAnalyticsAdapter(a: AnalyticsAdapter): void {
  adapter = a;
}

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (adapter) {
    adapter.track(event, properties);
  }
  if (typeof window !== 'undefined' && (window as Record<string, unknown>).dataLayer) {
    (window as Record<string, unknown>).dataLayer.push({ event, ...properties });
  }
}
