/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PilotWorkspaceSnapshot } from './pilotWorkspaceStore.ts';
import type { PilotRequestRecord } from './leadValidation.ts';

export type CommercialBillingTier = 'TIER2_FULL_AUDIT' | 'TIER3_MONTHLY_RETAINER';

export type InvoicePaymentStatus =
  | 'UNPAID_PROFORMA'
  | 'UTR_SUBMITTED_PENDING_VERIFICATION'
  | 'PAID_VERIFIED';

export interface FounderBillingConfig {
  beneficiaryName: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  razorpayPaymentLinkTier2: string;
  razorpayPaymentLinkTier3: string;
  tier2FullAuditPriceInr: number;
  tier3MonthlyRetainerInr: number;
  updatedAt: string;
}

export interface ProformaInvoiceLineItem {
  description: string;
  hsnSacCode: string;
  qty: number;
  unitPriceInr: number;
  lineTotalInr: number;
}

export interface ProformaInvoiceRecord {
  invoiceId: string;
  issuedAt: string;
  workspaceId: string;
  leadId?: string;
  companyName: string;
  plantLocation: string;
  clientContactName: string;
  clientEmail?: string;
  tier: CommercialBillingTier;
  amountInr: number;
  currency: 'INR';
  lineItems: ProformaInvoiceLineItem[];
  upiPaymentUri: string;
  neftImpsInstructions: {
    beneficiaryName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    paymentNote: string;
  };
  razorpayPaymentLink?: string;
  paymentStatus: InvoicePaymentStatus;
  utrReferenceNumber?: string;
  paidAt?: string;
}

export interface FounderBillingStoreFile {
  config: FounderBillingConfig;
  invoices: ProformaInvoiceRecord[];
}

export const BROWSER_FOUNDER_BILLING_STORAGE_KEY = 'operationalyst_founder_billing_v1';

const isBrowserEnv =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const DEFAULT_FOUNDER_BILLING_FILE_PATH =
  !isBrowserEnv && typeof process !== 'undefined' && typeof process.cwd === 'function'
    ? `${process.cwd()}/data/founder_billing.json`
    : './data/founder_billing.json';

export const DEFAULT_FOUNDER_BILLING_CONFIG: FounderBillingConfig = {
  beneficiaryName: 'C. Jones Snowin (Operationalyst / Snowin Ventures)',
  upiId: 'cjonessnowin@okaxis',
  bankName: 'HDFC / ICICI / Indian Bank (Configure in Billing Settings)',
  accountNumber: 'Configure in Founder Billing Settings',
  ifscCode: 'Configure in Founder Billing Settings',
  razorpayPaymentLinkTier2: 'https://rzp.io/l/operationalyst-audit',
  razorpayPaymentLinkTier3: '',
  tier2FullAuditPriceInr: 14999,
  tier3MonthlyRetainerInr: 24999,
  updatedAt: '2026-10-26T09:00:00.000Z',
};

function sanitizeText(val: unknown, fallback = '', maxLen = 240): string {
  if (typeof val !== 'string') return fallback;
  const cleaned = val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
  return cleaned || fallback;
}

export function normalizeFounderBillingConfig(
  raw?: Partial<FounderBillingConfig> | null
): FounderBillingConfig {
  const src = raw && typeof raw === 'object' ? raw : {};
  const tier2Price = Number(src.tier2FullAuditPriceInr);
  const tier3Price = Number(src.tier3MonthlyRetainerInr);

  return {
    beneficiaryName: sanitizeText(
      src.beneficiaryName,
      DEFAULT_FOUNDER_BILLING_CONFIG.beneficiaryName,
      160
    ),
    upiId: sanitizeText(src.upiId, DEFAULT_FOUNDER_BILLING_CONFIG.upiId, 100),
    bankName: sanitizeText(src.bankName, DEFAULT_FOUNDER_BILLING_CONFIG.bankName, 160),
    accountNumber: sanitizeText(
      src.accountNumber,
      DEFAULT_FOUNDER_BILLING_CONFIG.accountNumber,
      80
    ),
    ifscCode: sanitizeText(src.ifscCode, DEFAULT_FOUNDER_BILLING_CONFIG.ifscCode, 40),
    razorpayPaymentLinkTier2:
      typeof src.razorpayPaymentLinkTier2 === 'string'
        ? src.razorpayPaymentLinkTier2.trim().slice(0, 300)
        : DEFAULT_FOUNDER_BILLING_CONFIG.razorpayPaymentLinkTier2,
    razorpayPaymentLinkTier3:
      typeof src.razorpayPaymentLinkTier3 === 'string'
        ? src.razorpayPaymentLinkTier3.trim().slice(0, 300)
        : DEFAULT_FOUNDER_BILLING_CONFIG.razorpayPaymentLinkTier3,
    tier2FullAuditPriceInr:
      Number.isFinite(tier2Price) && tier2Price > 0
        ? Math.round(tier2Price)
        : DEFAULT_FOUNDER_BILLING_CONFIG.tier2FullAuditPriceInr,
    tier3MonthlyRetainerInr:
      Number.isFinite(tier3Price) && tier3Price > 0
        ? Math.round(tier3Price)
        : DEFAULT_FOUNDER_BILLING_CONFIG.tier3MonthlyRetainerInr,
    updatedAt: sanitizeText(
      src.updatedAt,
      new Date().toISOString(),
      64
    ),
  };
}

/**
 * Generates a deterministic or timestamped invoice ID in format INV-YYYYMMDD-XXXX
 */
export function generateInvoiceId(
  workspaceId?: string,
  now: Date = new Date()
): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  if (workspaceId && workspaceId.trim()) {
    const clean = workspaceId.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const suffix = clean.slice(-4).padStart(4, '0');
    return `INV-${yyyy}${mm}${dd}-${suffix}`;
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    .toString(16)
    .toUpperCase()
    .slice(0, 4)
    .padStart(4, 'A');
  return `INV-${yyyy}${mm}${dd}-${randomSuffix}`;
}

/**
 * Builds standard NPCI UPI payment deep-link:
 * upi://pay?pa=<upiId>&pn=<encodedBeneficiary>&am=<amountInr>&cu=INR&tn=<invoiceId>-<companyName>
 */
export function buildUpiPaymentUri(
  config: Partial<FounderBillingConfig> | undefined,
  amountInr: number,
  invoiceId: string,
  companyName: string
): string {
  const normalized = normalizeFounderBillingConfig(config);
  const upiId = normalized.upiId.trim();
  const encodedBeneficiary = encodeURIComponent(normalized.beneficiaryName.trim());
  const safeAmount =
    Number.isFinite(Number(amountInr)) && Number(amountInr) > 0
      ? Math.round(Number(amountInr))
      : normalized.tier2FullAuditPriceInr;
  const cleanInvoiceId = sanitizeText(invoiceId, 'INV-AUDIT', 40).replace(/\s+/g, '');
  const cleanCompany = sanitizeText(companyName, 'FactoryClient', 40)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const tn = `${cleanInvoiceId}-${cleanCompany || 'FactoryClient'}`;

  return `upi://pay?pa=${upiId}&pn=${encodedBeneficiary}&am=${safeAmount}&cu=INR&tn=${tn}`;
}

/**
 * Generates an official B2B Proforma Invoice (INV-YYYYMMDD-XXXX) for NEFT/IMPS/UPI collection.
 */
export function generateProformaInvoice(
  workspace: Partial<PilotWorkspaceSnapshot> & {
    workspaceId?: string;
    companyName?: string;
    plantLocation?: string;
    leadId?: string;
    invoiceId?: string;
    commercialAccessMode?: string;
    submittedUtrNumber?: string;
    paymentVerifiedAt?: string;
    paidByEmail?: string;
  },
  lead?: Partial<PilotRequestRecord> | null,
  config?: Partial<FounderBillingConfig> | null,
  tier: CommercialBillingTier = 'TIER2_FULL_AUDIT'
): ProformaInvoiceRecord {
  const normalizedConfig = normalizeFounderBillingConfig(config);
  const effectiveTier: CommercialBillingTier =
    tier === 'TIER3_MONTHLY_RETAINER' ? 'TIER3_MONTHLY_RETAINER' : 'TIER2_FULL_AUDIT';

  const amountInr =
    effectiveTier === 'TIER3_MONTHLY_RETAINER'
      ? normalizedConfig.tier3MonthlyRetainerInr
      : normalizedConfig.tier2FullAuditPriceInr;

  const workspaceId = sanitizeText(workspace?.workspaceId, 'AUDIT-DEMO-P1P4', 64);
  const companyName = sanitizeText(
    workspace?.companyName || lead?.companyName,
    'Ambattur Manufacturing Plant',
    160
  );
  const plantLocation = sanitizeText(
    workspace?.plantLocation || lead?.plantLocation,
    'Chennai Industrial Cluster',
    160
  );
  const invoiceId =
    workspace?.invoiceId && workspace.invoiceId.startsWith('INV-')
      ? workspace.invoiceId
      : generateInvoiceId(workspaceId);

  const upiPaymentUri = buildUpiPaymentUri(
    normalizedConfig,
    amountInr,
    invoiceId,
    companyName
  );

  const lineItems: ProformaInvoiceLineItem[] =
    effectiveTier === 'TIER3_MONTHLY_RETAINER'
      ? [
          {
            description:
              'Tier 3: Monthly Multi-Pillar Executive Control Tower & Working-Capital Governance Retainer (P1–P4 Refresh + Monthly Floor Review)',
            hsnSacCode: '998311',
            qty: 1,
            unitPriceInr: amountInr,
            lineTotalInr: amountInr,
          },
        ]
      : [
          {
            description:
              'Tier 2: Complete 4-Pillar Plant Diagnostic Audit (P1 Dead Stock, P2 Gate OTIF, P3 Freight Leakage, P4 Bin Variance) + 6-Sheet Action Workbook (.XLSX) & 45-Min Founder Walkthrough',
            hsnSacCode: '998311',
            qty: 1,
            unitPriceInr: amountInr,
            lineTotalInr: amountInr,
          },
        ];

  let paymentStatus: InvoicePaymentStatus = 'UNPAID_PROFORMA';
  if (
    workspace?.paymentVerifiedAt ||
    (workspace?.commercialAccessMode === 'FULL_UNLOCKED' && workspace?.submittedUtrNumber)
  ) {
    paymentStatus = 'PAID_VERIFIED';
  } else if (
    workspace?.commercialAccessMode === 'UTR_PENDING_VERIFICATION' ||
    workspace?.submittedUtrNumber
  ) {
    paymentStatus = 'UTR_SUBMITTED_PENDING_VERIFICATION';
  }

  return {
    invoiceId,
    issuedAt: new Date().toISOString(),
    workspaceId,
    ...(workspace?.leadId || lead?.leadId
      ? { leadId: workspace?.leadId || lead?.leadId }
      : {}),
    companyName,
    plantLocation,
    clientContactName: sanitizeText(
      lead?.fullName,
      'Managing Director / VP Operations / Accounts Desk',
      120
    ),
    ...(lead?.workEmail || workspace?.paidByEmail
      ? { clientEmail: lead?.workEmail || workspace?.paidByEmail }
      : {}),
    tier: effectiveTier,
    amountInr,
    currency: 'INR',
    lineItems,
    upiPaymentUri,
    neftImpsInstructions: {
      beneficiaryName: normalizedConfig.beneficiaryName,
      bankName: normalizedConfig.bankName,
      accountNumber: normalizedConfig.accountNumber,
      ifscCode: normalizedConfig.ifscCode,
      upiId: normalizedConfig.upiId,
      paymentNote: `${invoiceId} - ${companyName}`,
    },
    ...(effectiveTier === 'TIER3_MONTHLY_RETAINER'
      ? normalizedConfig.razorpayPaymentLinkTier3
        ? { razorpayPaymentLink: normalizedConfig.razorpayPaymentLinkTier3 }
        : {}
      : normalizedConfig.razorpayPaymentLinkTier2
      ? { razorpayPaymentLink: normalizedConfig.razorpayPaymentLinkTier2 }
      : {}),
    paymentStatus,
    ...(workspace?.submittedUtrNumber
      ? { utrReferenceNumber: workspace.submittedUtrNumber }
      : {}),
    ...(workspace?.paymentVerifiedAt ? { paidAt: workspace.paymentVerifiedAt } : {}),
  };
}

/**
 * Browser localStorage helpers for static hosting (Vercel) fallback
 */
export function readFounderBillingFromBrowser(): FounderBillingConfig {
  if (!isBrowserEnv) return { ...DEFAULT_FOUNDER_BILLING_CONFIG };
  try {
    const raw = window.localStorage.getItem(BROWSER_FOUNDER_BILLING_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FOUNDER_BILLING_CONFIG };
    const parsed = JSON.parse(raw);
    return normalizeFounderBillingConfig(parsed?.config || parsed);
  } catch {
    return { ...DEFAULT_FOUNDER_BILLING_CONFIG };
  }
}

export function saveFounderBillingToBrowser(
  patch: Partial<FounderBillingConfig>
): FounderBillingConfig {
  const current = readFounderBillingFromBrowser();
  const updated = normalizeFounderBillingConfig({
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  if (isBrowserEnv) {
    try {
      window.localStorage.setItem(
        BROWSER_FOUNDER_BILLING_STORAGE_KEY,
        JSON.stringify({ config: updated })
      );
    } catch {}
  }
  return updated;
}

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

async function readStoreFileNode(filePath: string): Promise<FounderBillingStoreFile> {
  if (isBrowserEnv) {
    return {
      config: readFounderBillingFromBrowser(),
      invoices: [],
    };
  }
  try {
    const fsMod = 'fs/promises';
    const pathMod = 'path';
    const fs = await import(/* @vite-ignore */ fsMod);
    const path = await import(/* @vite-ignore */ pathMod);
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        config: normalizeFounderBillingConfig(parsed?.config || parsed),
        invoices: Array.isArray(parsed?.invoices) ? parsed.invoices : [],
      };
    } catch {
      const initial: FounderBillingStoreFile = {
        config: { ...DEFAULT_FOUNDER_BILLING_CONFIG },
        invoices: [],
      };
      await fs.writeFile(filePath, JSON.stringify(initial, null, 2) + '\n', 'utf8');
      return initial;
    }
  } catch {
    return {
      config: { ...DEFAULT_FOUNDER_BILLING_CONFIG },
      invoices: [],
    };
  }
}

async function writeStoreFileNode(
  filePath: string,
  storeData: FounderBillingStoreFile
): Promise<void> {
  if (isBrowserEnv) {
    saveFounderBillingToBrowser(storeData.config);
    return;
  }
  const fsMod = 'fs/promises';
  const pathMod = 'path';
  const fs = await import(/* @vite-ignore */ fsMod);
  const path = await import(/* @vite-ignore */ pathMod);
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  await fs.writeFile(tempPath, JSON.stringify(storeData, null, 2) + '\n', 'utf8');
  await fs.rename(tempPath, filePath);
}

export async function getFounderBillingConfig(
  filePath: string = DEFAULT_FOUNDER_BILLING_FILE_PATH
): Promise<FounderBillingConfig> {
  return withSerializedLock(filePath, async () => {
    const store = await readStoreFileNode(filePath);
    return store.config;
  });
}

export async function updateFounderBillingConfig(
  patch: Partial<FounderBillingConfig>,
  filePath: string = DEFAULT_FOUNDER_BILLING_FILE_PATH
): Promise<FounderBillingConfig> {
  return withSerializedLock(filePath, async () => {
    const store = await readStoreFileNode(filePath);
    const updatedConfig = normalizeFounderBillingConfig({
      ...store.config,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    await writeStoreFileNode(filePath, {
      ...store,
      config: updatedConfig,
    });
    return updatedConfig;
  });
}
