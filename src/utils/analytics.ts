/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AnalyticsEventName =
  | 'hero_primary_cta_clicked'
  | 'sample_report_clicked'
  | 'self_assessment_started'
  | 'self_assessment_completed'
  | 'methodology_opened'
  | 'data_trust_opened'
  | 'pilot_form_started'
  | 'pilot_form_completed'
  | 'platform_view_clicked'
  | 'executive_priority_opened'
  | 'inventory_investigation_opened'
  | 'delivery_failure_explanation_opened'
  | 'metric_methodology_opened'
  | 'evidence_records_opened'
  | 'action_created'
  | 'action_status_changed'
  | 'import_started'
  | 'import_validation_completed'
  | 'report_exported'
  | 'demo_environment_viewed';

export interface AnalyticsPayload {
  source?: string;
  variant?: string;
  role?: string;
  score?: number;
  domain?: string;
  metricId?: string;
  statusFilter?: string;
  category?: string;
  reportType?: string;
  [key: string]: any;
}

const SENSITIVE_KEYS = new Set([
  'sku',
  'skuCode',
  'customer',
  'customerName',
  'orderValue',
  'amount',
  'financialValue',
  'price',
  'unitCost',
]);

/**
 * Lightweight, privacy-respecting conversion and platform analytics dispatcher.
 * Logs structured events without transmitting sensitive manufacturing data (SKU names, customer names, or financial values).
 */
export function trackEvent(name: AnalyticsEventName, payload?: AnalyticsPayload): void {
  try {
    const timestamp = new Date().toISOString();
    const safePayload: Record<string, any> = {};
    if (payload) {
      Object.entries(payload).forEach(([k, v]) => {
        if (!SENSITIVE_KEYS.has(k)) {
          safePayload[k] = v;
        }
      });
    }
    const eventRecord = {
      event: name,
      timestamp,
      ...safePayload,
    };

    // Safe in-browser event dispatch for testability and monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('operationalyst_analytics', { detail: eventRecord }));
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[Operationalyst Analytics] ${name}`, eventRecord);
      }
    }
  } catch (err) {
    // Fail silently without disrupting user interaction
  }
}

export type ServerFunnelEventType =
  | 'LANDING_PAGE_VIEW'
  | 'SCROLL_DEPTH_50_PCT'
  | 'SCROLL_DEPTH_90_PCT'
  | 'SAMPLE_REPORT_CLICKED'
  | 'SELF_ASSESSMENT_COMPLETED'
  | 'AUDIT_MODAL_OPENED'
  | 'DATA_KIT_DOWNLOADED'
  | 'PILOT_AUDIT_SUBMITTED';

export interface ServerFunnelEventMetadata {
  sourceSection?: string;
  buyerPersona?: string;
  sessionId?: string;
}

/**
 * First-party, zero-cookie server conversion funnel dispatcher -> POST /api/analytics/event.
 * Fails silently if offline or in unit-test environments without a DOM fetch server.
 */
export function trackServerFunnelEvent(
  eventType: ServerFunnelEventType,
  metadata?: ServerFunnelEventMetadata
): void {
  try {
    if (typeof window === 'undefined' || typeof fetch !== 'function') return;
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        ...(metadata ? { metadata } : {}),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Fail silently
  }
}


