/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * First-Party Server Conversion Funnel, Click & Scroll-Depth Analytics Store (Phase 9).
 * Persists zero-cookie, privacy-safe B2B landing page milestones to ./data/funnel_analytics.json
 * with serialized atomic write locking and deterministic step-to-step drop-off math.
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const ALLOWED_FUNNEL_EVENT_TYPES = [
  'LANDING_PAGE_VIEW',
  'SCROLL_DEPTH_50_PCT',
  'SCROLL_DEPTH_90_PCT',
  'SAMPLE_REPORT_CLICKED',
  'SELF_ASSESSMENT_COMPLETED',
  'AUDIT_MODAL_OPENED',
  'DATA_KIT_DOWNLOADED',
  'PILOT_AUDIT_SUBMITTED',
] as const;

export type FunnelEventType = (typeof ALLOWED_FUNNEL_EVENT_TYPES)[number];

export interface FunnelEventMetadata {
  sourceSection?: string;
  buyerPersona?: string;
  sessionId?: string;
}

export interface FunnelAnalyticsEventRecord {
  eventId: string;
  timestamp: string;
  eventType: FunnelEventType;
  metadata?: FunnelEventMetadata;
}

export interface RecordFunnelEventInput {
  eventType: FunnelEventType;
  metadata?: FunnelEventMetadata;
  timestamp?: string;
}

export interface FunnelStageBreakdown {
  stageId: FunnelEventType;
  label: string;
  count: number;
  retentionFromPreviousPct: number;
  dropOffFromPreviousPct: number;
  conversionFromTopPct: number;
}

export interface FunnelDropOffReport {
  totalEventsRecorded: number;
  lastEventAt: string | null;
  counts: Record<FunnelEventType, number>;
  rates: {
    first5sHeroRetentionPct: number;
    first5sHeroDropOffPct: number;
    middlePageExplorationRatePct: number;
    sampleReportClickRatePct: number;
    modalOpenRatePct: number;
    modalToSubmissionConversionPct: number;
    modalToSubmissionDropOffPct: number;
    overallVisitorToLeadConversionPct: number;
  };
  stages: FunnelStageBreakdown[];
  primaryBottleneckStage: string;
}

export const DEFAULT_FUNNEL_ANALYTICS_FILE_PATH = path.resolve(
  process.cwd(),
  'data',
  'funnel_analytics.json'
);

const writeLocks = new Map<string, Promise<unknown>>();

function withSerializedLock<T>(filePath: string, task: () => Promise<T>): Promise<T> {
  const prev = writeLocks.get(filePath) ?? Promise.resolve();
  const next = prev.then(task, task);
  writeLocks.set(
    filePath,
    next.catch(() => {})
  );
  return next;
}

export function isValidFunnelEventType(value: unknown): value is FunnelEventType {
  return (
    typeof value === 'string' &&
    (ALLOWED_FUNNEL_EVENT_TYPES as readonly string[]).includes(value)
  );
}

function sanitizeShortString(value: unknown, maxLen: number = 80): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().slice(0, maxLen);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function validateFunnelEventPayload(raw: unknown): {
  ok: boolean;
  data?: RecordFunnelEventInput;
  error?: string;
} {
  if (!raw || typeof raw !== 'object') {
    return {
      ok: false,
      error: 'Funnel analytics payload must be a JSON object.',
    };
  }

  const obj = raw as Record<string, unknown>;
  if (!isValidFunnelEventType(obj.eventType)) {
    return {
      ok: false,
      error: `Invalid eventType '${String(
        obj.eventType ?? ''
      )}'. Must be one of: ${ALLOWED_FUNNEL_EVENT_TYPES.join(', ')}.`,
    };
  }

  let metadata: FunnelEventMetadata | undefined;
  if (obj.metadata && typeof obj.metadata === 'object') {
    const rawMeta = obj.metadata as Record<string, unknown>;
    const sourceSection = sanitizeShortString(rawMeta.sourceSection, 80);
    const buyerPersona = sanitizeShortString(rawMeta.buyerPersona, 60);
    const sessionId = sanitizeShortString(rawMeta.sessionId, 64);
    if (sourceSection || buyerPersona || sessionId) {
      metadata = {
        ...(sourceSection ? { sourceSection } : {}),
        ...(buyerPersona ? { buyerPersona } : {}),
        ...(sessionId ? { sessionId } : {}),
      };
    }
  }

  return {
    ok: true,
    data: {
      eventType: obj.eventType,
      ...(metadata ? { metadata } : {}),
    },
  };
}

function roundPct(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  const clamped = Math.min(100, Math.max(0, value));
  return Math.round(clamped * 10) / 10;
}

/**
 * Pure deterministic calculation of B2B funnel conversion & drop-off metrics.
 */
export function computeFunnelDropOffReport(
  events: FunnelAnalyticsEventRecord[]
): FunnelDropOffReport {
  const counts: Record<FunnelEventType, number> = {
    LANDING_PAGE_VIEW: 0,
    SCROLL_DEPTH_50_PCT: 0,
    SCROLL_DEPTH_90_PCT: 0,
    SAMPLE_REPORT_CLICKED: 0,
    SELF_ASSESSMENT_COMPLETED: 0,
    AUDIT_MODAL_OPENED: 0,
    DATA_KIT_DOWNLOADED: 0,
    PILOT_AUDIT_SUBMITTED: 0,
  };

  let lastEventAt: string | null = null;

  for (const ev of events) {
    if (ev && isValidFunnelEventType(ev.eventType)) {
      counts[ev.eventType] += 1;
      if (typeof ev.timestamp === 'string' && (!lastEventAt || ev.timestamp > lastEventAt)) {
        lastEventAt = ev.timestamp;
      }
    }
  }

  const views = counts.LANDING_PAGE_VIEW;
  const scroll50 = counts.SCROLL_DEPTH_50_PCT;
  const sampleClicks = counts.SAMPLE_REPORT_CLICKED;
  const modalOpens = counts.AUDIT_MODAL_OPENED;
  const submissions = counts.PILOT_AUDIT_SUBMITTED;

  const first5sHeroRetentionPct = views > 0 ? roundPct((scroll50 / views) * 100) : 0;
  const first5sHeroDropOffPct = views > 0 ? roundPct(100 - first5sHeroRetentionPct) : 0;

  const explorationDenominator = scroll50 > 0 ? scroll50 : views;
  const middlePageExplorationRatePct =
    explorationDenominator > 0
      ? roundPct((sampleClicks / explorationDenominator) * 100)
      : 0;

  const sampleReportClickRatePct = views > 0 ? roundPct((sampleClicks / views) * 100) : 0;
  const modalOpenRatePct = views > 0 ? roundPct((modalOpens / views) * 100) : 0;

  const modalToSubmissionConversionPct =
    modalOpens > 0 ? roundPct((submissions / modalOpens) * 100) : 0;
  const modalToSubmissionDropOffPct =
    modalOpens > 0 ? roundPct(100 - modalToSubmissionConversionPct) : 0;

  const overallVisitorToLeadConversionPct =
    views > 0 ? roundPct((submissions / views) * 100) : 0;

  const rawStages: Array<{ stageId: FunnelEventType; label: string; count: number }> = [
    {
      stageId: 'LANDING_PAGE_VIEW',
      label: '1. Landing Views',
      count: views,
    },
    {
      stageId: 'SCROLL_DEPTH_50_PCT',
      label: '2. 50% Scroll Depth',
      count: scroll50,
    },
    {
      stageId: 'SAMPLE_REPORT_CLICKED',
      label: '3. Sample Report Viewed',
      count: sampleClicks,
    },
    {
      stageId: 'AUDIT_MODAL_OPENED',
      label: '4. Audit Modal Opened',
      count: modalOpens,
    },
    {
      stageId: 'PILOT_AUDIT_SUBMITTED',
      label: '5. Pilot Lead Submitted',
      count: submissions,
    },
  ];

  const stages: FunnelStageBreakdown[] = rawStages.map((stg, idx) => {
    if (idx === 0) {
      return {
        ...stg,
        retentionFromPreviousPct: views > 0 ? 100 : 0,
        dropOffFromPreviousPct: 0,
        conversionFromTopPct: views > 0 ? 100 : 0,
      };
    }
    const prevCount = rawStages[idx - 1].count;
    const retentionFromPreviousPct =
      prevCount > 0 ? roundPct((stg.count / prevCount) * 100) : 0;
    const dropOffFromPreviousPct =
      prevCount > 0 ? roundPct(100 - retentionFromPreviousPct) : 0;
    const conversionFromTopPct = views > 0 ? roundPct((stg.count / views) * 100) : 0;
    return {
      ...stg,
      retentionFromPreviousPct,
      dropOffFromPreviousPct,
      conversionFromTopPct,
    };
  });

  let primaryBottleneckStage = 'Awaiting initial visitor traffic';
  if (views > 0) {
    const transitionStages = stages.slice(1);
    let maxDropStage = transitionStages[0];
    for (const st of transitionStages) {
      if (st.dropOffFromPreviousPct > maxDropStage.dropOffFromPreviousPct) {
        maxDropStage = st;
      }
    }
    primaryBottleneckStage = `${maxDropStage.label} (${maxDropStage.dropOffFromPreviousPct}% drop-off)`;
  }

  return {
    totalEventsRecorded: events.length,
    lastEventAt,
    counts,
    rates: {
      first5sHeroRetentionPct,
      first5sHeroDropOffPct,
      middlePageExplorationRatePct,
      sampleReportClickRatePct,
      modalOpenRatePct,
      modalToSubmissionConversionPct,
      modalToSubmissionDropOffPct,
      overallVisitorToLeadConversionPct,
    },
    stages,
    primaryBottleneckStage,
  };
}

async function ensureFunnelFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]\n', 'utf8');
  }
}

async function readAllFunnelEventsUnsafe(
  filePath: string
): Promise<FunnelAnalyticsEventRecord[]> {
  await ensureFunnelFile(filePath);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FunnelAnalyticsEventRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeAllFunnelEventsUnsafe(
  filePath: string,
  records: FunnelAnalyticsEventRecord[]
): Promise<void> {
  await ensureFunnelFile(filePath);
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  await fs.writeFile(tempPath, JSON.stringify(records, null, 2) + '\n', 'utf8');
  await fs.rename(tempPath, filePath);
}

function generateFunnelEventId(now: Date = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FNLEVT-${yyyy}${mm}${dd}-${suffix}`;
}

export async function recordFunnelAnalyticsEvent(
  rawInput: unknown,
  filePath: string = DEFAULT_FUNNEL_ANALYTICS_FILE_PATH
): Promise<{
  ok: boolean;
  event?: FunnelAnalyticsEventRecord;
  report?: FunnelDropOffReport;
  error?: string;
}> {
  const validation = validateFunnelEventPayload(rawInput);
  if (!validation.ok || !validation.data) {
    return {
      ok: false,
      error: validation.error || 'Invalid funnel analytics event payload.',
    };
  }

  return withSerializedLock(filePath, async () => {
    const existing = await readAllFunnelEventsUnsafe(filePath);
    const now = new Date();
    const record: FunnelAnalyticsEventRecord = {
      eventId: generateFunnelEventId(now),
      timestamp: validation.data!.timestamp || now.toISOString(),
      eventType: validation.data!.eventType,
      ...(validation.data!.metadata ? { metadata: validation.data!.metadata } : {}),
    };
    existing.push(record);
    await writeAllFunnelEventsUnsafe(filePath, existing);
    const report = computeFunnelDropOffReport(existing);
    return {
      ok: true,
      event: record,
      report,
    };
  });
}

export async function listFunnelAnalyticsEvents(
  filePath: string = DEFAULT_FUNNEL_ANALYTICS_FILE_PATH
): Promise<FunnelAnalyticsEventRecord[]> {
  return withSerializedLock(filePath, async () => {
    return readAllFunnelEventsUnsafe(filePath);
  });
}

export async function getFunnelAnalyticsDropOffReport(
  filePath: string = DEFAULT_FUNNEL_ANALYTICS_FILE_PATH
): Promise<FunnelDropOffReport> {
  return withSerializedLock(filePath, async () => {
    const events = await readAllFunnelEventsUnsafe(filePath);
    return computeFunnelDropOffReport(events);
  });
}

export async function resetFunnelAnalyticsEvents(
  filePath: string = DEFAULT_FUNNEL_ANALYTICS_FILE_PATH
): Promise<FunnelDropOffReport> {
  return withSerializedLock(filePath, async () => {
    await writeAllFunnelEventsUnsafe(filePath, []);
    return computeFunnelDropOffReport([]);
  });
}
