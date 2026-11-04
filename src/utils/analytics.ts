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
  | 'platform_view_clicked';

export interface AnalyticsPayload {
  source?: string;
  variant?: string;
  role?: string;
  score?: number;
  [key: string]: any;
}

/**
 * Lightweight, privacy-respecting conversion analytics dispatcher.
 * Logs structured events without transmitting sensitive manufacturing data.
 */
export function trackEvent(name: AnalyticsEventName, payload?: AnalyticsPayload): void {
  try {
    const timestamp = new Date().toISOString();
    const eventRecord = {
      event: name,
      timestamp,
      ...payload,
    };

    // Safe in-browser event dispatch for testability and monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('operationalyst_analytics', { detail: eventRecord }));
      // In development mode, log structured trace to console for auditability
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[Operationalyst Analytics] ${name}`, eventRecord);
      }
    }
  } catch (err) {
    // Fail silently without disrupting user interaction
  }
}
