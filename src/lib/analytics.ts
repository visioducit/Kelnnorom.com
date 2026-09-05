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
  if (typeof window !== 'undefined') {
    const win = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (command: string, actionOrTarget: string, params?: Record<string, unknown>) => void;
    };
    if (typeof win.gtag === 'function') {
      win.gtag('event', event, properties);
    }
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event, ...properties });
    }
  }
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window !== 'undefined') {
    const win = window as unknown as {
      gtag?: (command: string, actionOrTarget: string, params?: Record<string, unknown>) => void;
    };
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || (typeof document !== 'undefined' ? document.title : ''),
        send_to: 'G-6J6W9EEV8C',
      });
    }
  }
}
