import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import {
  validatePilotRequestPayload,
  validateAdminLeadPatch,
  dispatchOptionalWebhookNotification,
} from "./src/utils/leadValidation.ts";
import {
  createLeadRecord,
  listLeadRecords,
  updateLeadRecord,
  getLeadRecordById,
} from "./src/utils/leadStore.ts";
import {
  validatePilotWorkspacePayload,
  createPilotWorkspaceSnapshot,
  listPilotWorkspaceSnapshots,
  getAuthorizedPilotWorkspaceSnapshot,
  updatePilotWorkspaceSnapshotRules,
  type UpdateSnapshotRulesPayload,
} from "./src/utils/pilotWorkspaceStore.ts";
import {
  validatePlantWorkspaceUpdatePayload,
  listAllPlantWorkspacesSummary,
  getPlantWorkspaceFromServer,
  updatePlantWorkspaceOnServer,
  resetPlantWorkspaceOnServer,
} from "./src/utils/plantWorkspaceServerStore.ts";
import {
  validateServerAuditEventPayload,
  recordServerAuditEvent,
  listServerAuditEvents,
} from "./src/utils/serverAuditLog.ts";
import {
  executeStep2PilotIngestion,
  listImportRunRecords,
} from "./src/utils/importRunStore.ts";
import {
  listVerifiedProofRecords,
  publishVerifiedProofRecord,
  deleteVerifiedProofRecord,
  buildSandboxDemonstrationProofRecord,
  type PublishVerifiedProofInput,
} from "./src/utils/verifiedProofRegistryStore.ts";
import {
  purgePilotWorkspace,
  extendPilotWorkspaceRetention,
  sweepExpiredWorkspaces,
  getDeletionCertificateById,
  listDeletionCertificates,
  buildPublicDemoDeletionCertificate,
} from "./src/utils/dataPurgeEngine.ts";
import {
  exportSystemBackupBundle,
  restoreSystemBackupBundle,
} from "./src/utils/systemBackupBundle.ts";
import {
  verifyAdminKey,
  DEFAULT_DEV_ADMIN_KEY,
} from "./src/utils/adminAuthGuard.ts";
import {
  recordFunnelAnalyticsEvent,
  getFunnelAnalyticsDropOffReport,
  resetFunnelAnalyticsEvents,
} from "./src/utils/funnelAnalyticsStore.ts";
import { isValidPlantId } from "./src/data/multiPlantBaselines.ts";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

interface RateBucket {
  timestamps: number[];
}

const ipRateBuckets = new Map<string, RateBucket>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim().length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown-ip";
}

function checkRateLimit(ip: string, nowMs: number = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const bucket = ipRateBuckets.get(ip) || { timestamps: [] };
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

  if (bucket.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = bucket.timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - nowMs) / 1000));
    ipRateBuckets.set(ip, bucket);
    return { allowed: false, retryAfterSec };
  }

  bucket.timestamps.push(nowMs);
  ipRateBuckets.set(ip, bucket);
  return { allowed: true, retryAfterSec: 0 };
}

function extractProvidedAdminKey(req: express.Request): string {
  return (
    (typeof req.headers["x-admin-key"] === "string" ? req.headers["x-admin-key"].trim() : "") ||
    (typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7).trim()
      : "")
  );
}

function isAdminAuthenticated(req: express.Request): {
  authenticated: boolean;
  isDefaultDevKey: boolean;
  customAdminKeyConfigured: boolean;
} {
  const providedKey = extractProvidedAdminKey(req);
  return verifyAdminKey(providedKey);
}

function requireAdminAuth(
  req: express.Request,
  res: express.Response
): { isDefaultDevKey: boolean; customAdminKeyConfigured: boolean } | null {
  const { authenticated, isDefaultDevKey, customAdminKeyConfigured } = isAdminAuthenticated(req);
  if (!authenticated) {
    res.status(401).json({
      ok: false,
      error: "Unauthorized: Valid x-admin-key header is required to access Founder Lead Management.",
    });
    return null;
  }
  return { isDefaultDevKey, customAdminKeyConfigured };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Safe API security headers (without restricting AI Studio preview iframe)
  app.use("/api", (_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Support 5MB payloads for 7-Store System Restore, 2MB for pilot workspaces/upload/plants, and 32KB default
  app.use("/api/admin/system-restore", express.json({ limit: "5mb" }));
  app.use("/api/admin/pilot-workspaces", express.json({ limit: "2mb" }));
  app.use("/api/pilot-upload", express.json({ limit: "2mb" }));
  app.use("/api/plant-workspaces", express.json({ limit: "2mb" }));
  app.use(express.json({ limit: "32kb" }));

  // 1. Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "operationalyst-api",
    });
  });

  // 2. Public Lead Capture Endpoint: POST /api/pilot-requests
  app.post("/api/pilot-requests", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const rateStatus = checkRateLimit(clientIp);
      if (!rateStatus.allowed) {
        return res.status(429).json({
          ok: false,
          error: `Too many pilot requests from this network. Please retry in ${Math.ceil(
            rateStatus.retryAfterSec / 60
          )} minute(s) or email joneszz2004@gmail.com directly.`,
          retryAfterSeconds: rateStatus.retryAfterSec,
        });
      }

      const validation = validatePilotRequestPayload(req.body);
      if (!validation.ok || !validation.data) {
        return res.status(400).json({
          ok: false,
          error: validation.error || "Validation failed",
          fieldErrors: validation.fieldErrors || {},
        });
      }

      // Silent 200 OK for honeypot spam submissions without saving to disk
      if (validation.isSpamTrap) {
        return res.status(200).json({
          ok: true,
          leadId: "PILOT-00000000-0000",
          createdAt: new Date().toISOString(),
          status: "NEW",
        });
      }

      const record = await createLeadRecord(validation.data);

      await recordServerAuditEvent({
        actor: `${record.fullName} (${record.companyName})`,
        category: "LEAD_FUNNEL",
        action: "PILOT_LEAD_CREATED",
        plantId: "global",
        details: `Captured pilot request ${record.leadId} for ${record.companyName} (${record.plantLocation})${
          record.selfAssessmentScore !== undefined ? ` · Diagnostic Score ${record.selfAssessmentScore}/100` : ""
        }`,
      }).catch(() => {});

      console.log(
        `[PILOT_LEAD_CAPTURED] leadId=${record.leadId} company="${record.companyName}" location="${record.plantLocation}"`
      );

      // Non-blocking optional webhook notification (100% optional with silent graceful fallback)
      void dispatchOptionalWebhookNotification({
        event: "pilot_lead_captured",
        leadId: record.leadId,
        companyName: record.companyName,
        plantLocation: record.plantLocation,
        fullName: record.fullName,
        workEmail: record.workEmail,
        phoneOrWhatsapp: record.phoneOrWhatsapp,
        roleTitle: record.roleTitle,
        erpSystem: record.erpSystem,
        approxSkuCount: record.approxSkuCount,
        primaryChallenge: record.primaryChallenge,
        createdAt: record.createdAt,
      });

      return res.status(201).json({
        ok: true,
        leadId: record.leadId,
        createdAt: record.createdAt,
        status: record.status,
      });
    } catch (err) {
      console.error("[PILOT_LEAD_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Unable to save your pilot request right now. Please use the direct email fallback.",
      });
    }
  });

  // 3. Protected Founder Admin Endpoint: GET /api/admin/pilot-requests
  app.get("/api/admin/pilot-requests", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const requests = await listLeadRecords();
      return res.json({
        ok: true,
        isDefaultDevKey: auth.isDefaultDevKey,
        total: requests.length,
        requests,
      });
    } catch (err) {
      console.error("[ADMIN_LIST_LEADS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to read pilot request records.",
      });
    }
  });

  // 4. Protected Founder Admin Endpoint: PATCH /api/admin/pilot-requests/:leadId
  app.patch("/api/admin/pilot-requests/:leadId", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    const leadId = req.params.leadId?.trim();
    if (!leadId) {
      return res.status(400).json({
        ok: false,
        error: "Lead ID parameter is required.",
      });
    }

    const patchValidation = validateAdminLeadPatch(req.body);
    if (!patchValidation.ok || !patchValidation.data) {
      return res.status(400).json({
        ok: false,
        error: patchValidation.error || "Validation failed",
        fieldErrors: patchValidation.fieldErrors || {},
      });
    }

    try {
      const updated = await updateLeadRecord(leadId, patchValidation.data);
      if (!updated) {
        return res.status(404).json({
          ok: false,
          error: `Lead record ${leadId} not found.`,
        });
      }

      await recordServerAuditEvent({
        actor: "C. Jones Snowin (Founder Admin)",
        category: "LEAD_FUNNEL",
        action: patchValidation.data.linkedWorkspaceId
          ? "PILOT_LEAD_SNAPSHOT_LINKED"
          : "PILOT_LEAD_UPDATED",
        plantId: updated.linkedPlantId || "global",
        details: `Updated lead ${updated.leadId} (${updated.companyName}) -> status=${updated.status}${
          updated.linkedWorkspaceId ? `, linkedSnapshot=${updated.linkedWorkspaceId}` : ""
        }`,
      }).catch(() => {});

      return res.json({
        ok: true,
        isDefaultDevKey: auth.isDefaultDevKey,
        record: updated,
      });
    } catch (err) {
      console.error("[ADMIN_UPDATE_LEAD_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to update lead record.",
      });
    }
  });

  // 5. Protected Founder Admin Endpoint: POST /api/admin/pilot-workspaces
  app.post("/api/admin/pilot-workspaces", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    const validation = validatePilotWorkspacePayload(req.body);
    if (!validation.ok || !validation.data) {
      return res.status(400).json({
        ok: false,
        error: validation.error || "Validation failed",
        fieldErrors: validation.fieldErrors || {},
      });
    }

    try {
      const snapshot = await createPilotWorkspaceSnapshot(validation.data);

      await recordServerAuditEvent({
        actor: "C. Jones Snowin (Founder Admin)",
        category: "PILOT_WALKTHROUGH",
        action: "WALKTHROUGH_SNAPSHOT_PUBLISHED",
        plantId: "global",
        details: `Published 4-pillar walkthrough snapshot ${snapshot.workspaceId} for ${snapshot.companyName} (${snapshot.plantLocation}) · ${snapshot.summaryMetrics.totalSkus} SKUs`,
      }).catch(() => {});

      console.log(
        `[PILOT_WORKSPACE_PUBLISHED] workspaceId=${snapshot.workspaceId} company="${snapshot.companyName}" skus=${snapshot.summaryMetrics.totalSkus}`
      );
      return res.status(201).json({
        ok: true,
        isDefaultDevKey: auth.isDefaultDevKey,
        snapshot,
      });
    } catch (err) {
      console.error("[ADMIN_CREATE_WORKSPACE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to create pilot workspace snapshot.",
      });
    }
  });

  // 6. Protected Founder Admin Endpoint: GET /api/admin/pilot-workspaces
  app.get("/api/admin/pilot-workspaces", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const workspaces = await listPilotWorkspaceSnapshots();
      return res.json({
        ok: true,
        isDefaultDevKey: auth.isDefaultDevKey,
        total: workspaces.length,
        workspaces,
      });
    } catch (err) {
      console.error("[ADMIN_LIST_WORKSPACES_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to read pilot workspace snapshots.",
      });
    }
  });

  // 7. Read-Only Client Walkthrough Endpoint: GET /api/pilot-workspaces/:workspaceId
  app.get("/api/pilot-workspaces/:workspaceId", async (req, res) => {
    const workspaceId = req.params.workspaceId?.trim();
    if (!workspaceId) {
      return res.status(400).json({
        ok: false,
        error: "Workspace ID is required.",
      });
    }

    const tokenParam = typeof req.query.token === "string" ? req.query.token.trim() : "";
    const adminCheck = isAdminAuthenticated(req);

    try {
      const result = await getAuthorizedPilotWorkspaceSnapshot(workspaceId, {
        shareToken: tokenParam,
        isAdmin: adminCheck.authenticated,
      });

      if (result.status === "NOT_FOUND") {
        return res.status(404).json({
          ok: false,
          error: `Pilot audit workspace ${workspaceId} not found.`,
        });
      }

      if (result.status === "UNAUTHORIZED") {
        return res.status(401).json({
          ok: false,
          error: "Unauthorized: A valid read-only walkthrough shareToken or x-admin-key is required.",
        });
      }

      return res.json({
        ok: true,
        snapshot: result.snapshot,
      });
    } catch (err) {
      console.error("[GET_PILOT_WORKSPACE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load pilot audit workspace.",
      });
    }
  });

  // 8. Multi-Plant Workspace Summary Endpoint: GET /api/plant-workspaces
  app.get("/api/plant-workspaces", async (_req, res) => {
    try {
      const plants = await listAllPlantWorkspacesSummary();
      return res.json({
        ok: true,
        plants,
      });
    } catch (err) {
      console.error("[LIST_PLANT_WORKSPACES_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to list plant workspace summaries.",
      });
    }
  });

  // 9. Get Single Plant Workspace Endpoint: GET /api/plant-workspaces/:plantId
  app.get("/api/plant-workspaces/:plantId", async (req, res) => {
    const rawPlantId = req.params.plantId?.trim().toLowerCase();
    if (!isValidPlantId(rawPlantId)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid plantId. Must be one of: ambattur, sriperumbudur, hosur.",
      });
    }

    try {
      const workspace = await getPlantWorkspaceFromServer(rawPlantId);
      return res.json({
        ok: true,
        workspace,
      });
    } catch (err) {
      console.error("[GET_PLANT_WORKSPACE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load plant workspace.",
      });
    }
  });

  // 10. Update Single Plant Workspace Endpoint: PUT /api/plant-workspaces/:plantId
  app.put("/api/plant-workspaces/:plantId", async (req, res) => {
    const rawPlantId = req.params.plantId?.trim().toLowerCase();
    if (!isValidPlantId(rawPlantId)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid plantId. Must be one of: ambattur, sriperumbudur, hosur.",
      });
    }

    const validation = validatePlantWorkspaceUpdatePayload(req.body);
    if (!validation.ok || !validation.data) {
      return res.status(400).json({
        ok: false,
        error: validation.error || "Invalid plant workspace payload.",
      });
    }

    try {
      const workspace = await updatePlantWorkspaceOnServer(rawPlantId, validation.data);

      await recordServerAuditEvent({
        actor: "Plant Operations Desk",
        category: "PLANT_WORKSPACE",
        action: "PLANT_WORKSPACE_UPDATED",
        plantId: rawPlantId,
        details: `Synced plant workspace for ${workspace.dataset.plantName} (${workspace.summary.p1.totalSkus} SKUs, ${workspace.summary.p2.totalDispatches} dispatches, ${workspace.summary.p3.totalTrips} trips, ${workspace.summary.p4.totalBins} bins)`,
      }).catch(() => {});

      return res.json({
        ok: true,
        workspace,
      });
    } catch (err) {
      console.error("[UPDATE_PLANT_WORKSPACE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to update plant workspace on server.",
      });
    }
  });

  // 11. Reset Single Plant Workspace to Baseline: POST /api/plant-workspaces/:plantId/reset
  app.post("/api/plant-workspaces/:plantId/reset", async (req, res) => {
    const rawPlantId = req.params.plantId?.trim().toLowerCase();
    if (!isValidPlantId(rawPlantId)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid plantId. Must be one of: ambattur, sriperumbudur, hosur.",
      });
    }

    try {
      const workspace = await resetPlantWorkspaceOnServer(rawPlantId);

      await recordServerAuditEvent({
        actor: "Plant Operations Desk",
        category: "PLANT_WORKSPACE",
        action: "PLANT_WORKSPACE_RESET",
        plantId: rawPlantId,
        details: `Reset ${workspace.dataset.plantName} workspace to deterministic factory baseline (${workspace.summary.p1.totalSkus} SKUs)`,
      }).catch(() => {});

      return res.json({
        ok: true,
        workspace,
      });
    } catch (err) {
      console.error("[RESET_PLANT_WORKSPACE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to reset plant workspace to baseline.",
      });
    }
  });

  // 12. Governance Audit Log Endpoint: GET /api/audit-events
  app.get("/api/audit-events", async (req, res) => {
    try {
      const plantIdFilter = typeof req.query.plantId === "string" ? req.query.plantId.trim() : undefined;
      const limitParam = req.query.limit ? Number(req.query.limit) : 100;
      const [events, leads, snapshots, plantSummaries] = await Promise.all([
        listServerAuditEvents({ plantId: plantIdFilter, limit: limitParam }),
        listLeadRecords(),
        listPilotWorkspaceSnapshots(),
        listAllPlantWorkspacesSummary(),
      ]);

      return res.json({
        ok: true,
        totalEvents: events.length,
        storageCounters: {
          totalLeadsStored: leads.length,
          totalWalkthroughSnapshots: snapshots.length,
          plantSummaries,
        },
        events,
      });
    } catch (err) {
      console.error("[LIST_AUDIT_EVENTS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load governance audit events.",
      });
    }
  });

  // 13. Record Governance Audit Event Endpoint: POST /api/audit-events
  app.post("/api/audit-events", async (req, res) => {
    const validation = validateServerAuditEventPayload(req.body);
    if (!validation.ok || !validation.data) {
      return res.status(400).json({
        ok: false,
        error: validation.error || "Invalid audit event payload.",
      });
    }

    try {
      const event = await recordServerAuditEvent(validation.data);
      return res.status(201).json({
        ok: true,
        event,
      });
    } catch (err) {
      console.error("[RECORD_AUDIT_EVENT_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to record server audit event.",
      });
    }
  });

  // 14. Step-2 Approved Pilot Upload Portal Metadata: GET /api/pilot-upload/:leadId
  app.get("/api/pilot-upload/:leadId", async (req, res) => {
    const leadId = req.params.leadId?.trim();
    if (!leadId) {
      return res.status(400).json({
        ok: false,
        error: "Lead ID parameter is required.",
      });
    }

    // Support interactive Demo Sandbox Mode
    if (leadId === "PILOT-DEMO-SANDBOX" || leadId === "DEMO") {
      return res.json({
        ok: true,
        isDemoSandbox: true,
        lead: {
          leadId: "PILOT-DEMO-SANDBOX",
          companyName: "Ambattur Precision Forge & Valves Pvt Ltd (Step-2 Demo Sandbox)",
          plantLocation: "Ambattur Industrial Estate, Chennai",
          erpSystem: "Tally Prime",
          approxSkuCount: "500 - 2,000 SKUs",
          status: "APPROVED_FOR_UPLOAD",
          uploadPortalUrl: "?view=pilot-upload&demo=true",
        },
      });
    }

    try {
      const record = await getLeadRecordById(leadId);
      if (!record) {
        return res.status(404).json({
          ok: false,
          error: `Lead record ${leadId} not found.`,
        });
      }

      const providedToken = typeof req.query.token === "string" ? req.query.token.trim() : "";
      const adminAuth = isAdminAuthenticated(req);
      const isTokenValid = Boolean(
        providedToken &&
          providedToken !== "PURGED_REVOKED" &&
          record.uploadToken !== "PURGED_REVOKED" &&
          providedToken === record.uploadToken
      );

      if (!adminAuth.authenticated && !isTokenValid) {
        return res.status(401).json({
          ok: false,
          error:
            record.uploadToken === "PURGED_REVOKED"
              ? "Upload token revoked: This pilot dataset was purged per the 14-day data retention policy."
              : "Unauthorized: A valid Step-2 uploadToken or Founder x-admin-key is required to access this Pilot Upload Portal.",
        });
      }

      return res.json({
        ok: true,
        isDemoSandbox: false,
        lead: {
          leadId: record.leadId,
          companyName: record.companyName,
          plantLocation: record.plantLocation,
          erpSystem: record.erpSystem,
          approxSkuCount: record.approxSkuCount,
          status: record.status,
          uploadPortalUrl: record.uploadPortalUrl,
          linkedWorkspaceId: record.linkedWorkspaceId,
          linkedWalkthroughUrl: record.linkedWalkthroughUrl,
          lastImportRunId: record.lastImportRunId,
          lastImportAt: record.lastImportAt,
          dataQualityOverview: record.dataQualityOverview,
          deletionCertificateId: record.deletionCertificateId,
          purgedAt: record.purgedAt,
        },
      });
    } catch (err) {
      console.error("[GET_PILOT_UPLOAD_LEAD_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load Step-2 Pilot Upload metadata.",
      });
    }
  });

  // 15. Step-2 Approved Pilot Upload Ingestion: POST /api/pilot-upload/:leadId/ingest
  app.post("/api/pilot-upload/:leadId/ingest", async (req, res) => {
    const leadId = req.params.leadId?.trim();
    if (!leadId) {
      return res.status(400).json({
        ok: false,
        error: "Lead ID parameter is required.",
      });
    }

    const isDemoLead = leadId === "PILOT-DEMO-SANDBOX" || leadId === "DEMO";
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<
      string,
      unknown
    >;

    try {
      if (!isDemoLead) {
        const record = await getLeadRecordById(leadId);
        if (!record) {
          return res.status(404).json({
            ok: false,
            error: `Lead record ${leadId} not found.`,
          });
        }

        const providedToken =
          (typeof body.uploadToken === "string" ? body.uploadToken.trim() : "") ||
          (typeof req.query.token === "string" ? req.query.token.trim() : "");
        const adminAuth = isAdminAuthenticated(req);
        const isTokenValid = Boolean(
          providedToken &&
            providedToken !== "PURGED_REVOKED" &&
            record.uploadToken !== "PURGED_REVOKED" &&
            providedToken === record.uploadToken
        );

        if (!adminAuth.authenticated && !isTokenValid) {
          return res.status(401).json({
            ok: false,
            error:
              record.uploadToken === "PURGED_REVOKED"
                ? "Upload token revoked: This pilot dataset was purged per the 14-day data retention policy."
                : "Unauthorized: Valid Step-2 uploadToken or Founder x-admin-key is required to ingest ERP data.",
          });
        }
      }

      const p1Rows = Array.isArray(body.p1Rows)
        ? (body.p1Rows as Array<Record<string, unknown>>)
        : [];
      const p2Rows = Array.isArray(body.p2Rows)
        ? (body.p2Rows as Array<Record<string, unknown>>)
        : undefined;
      const p3Rows = Array.isArray(body.p3Rows)
        ? (body.p3Rows as Array<Record<string, unknown>>)
        : undefined;
      const p4Rows = Array.isArray(body.p4Rows)
        ? (body.p4Rows as Array<Record<string, unknown>>)
        : undefined;

      const ingestionResult = await executeStep2PilotIngestion({
        leadId: isDemoLead ? "PILOT-DEMO-SANDBOX" : leadId,
        companyName: typeof body.companyName === "string" ? body.companyName : undefined,
        plantLocation: typeof body.plantLocation === "string" ? body.plantLocation : undefined,
        plantId:
          body.plantId === "ambattur" ||
          body.plantId === "sriperumbudur" ||
          body.plantId === "hosur" ||
          body.plantId === "custom"
            ? body.plantId
            : "ambattur",
        p1Rows,
        p2Rows,
        p3Rows,
        p4Rows,
        excludeReserveSpares: Boolean(body.excludeReserveSpares),
        anonymizationApplied: Boolean(body.anonymizationApplied),
        applyServerSideAnonymization: Boolean(body.applyServerSideAnonymization),
        rules:
          body.rules && typeof body.rules === "object"
            ? (body.rules as Record<string, unknown>)
            : undefined,
        executiveNotes:
          typeof body.executiveNotes === "string" ? body.executiveNotes : undefined,
      });

      if (!ingestionResult.ok || !ingestionResult.importRun || !ingestionResult.snapshot) {
        return res.status(400).json({
          ok: false,
          error: ingestionResult.error || "Step-2 ingestion validation failed.",
          quarantinedByPillar: ingestionResult.quarantinedByPillar,
        });
      }

      return res.status(201).json({
        ok: true,
        importRun: ingestionResult.importRun,
        snapshot: ingestionResult.snapshot,
        updatedLead: ingestionResult.updatedLead || null,
        quarantinedByPillar: ingestionResult.quarantinedByPillar,
      });
    } catch (err) {
      console.error("[STEP2_PILOT_INGEST_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to process Step-2 Pilot Audit ingestion.",
      });
    }
  });

  // 16. Protected Founder Admin Endpoint: GET /api/admin/import-runs
  app.get("/api/admin/import-runs", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const importRuns = await listImportRunRecords();
      return res.json({
        ok: true,
        isDefaultDevKey: auth.isDefaultDevKey,
        total: importRuns.length,
        importRuns,
      });
    } catch (err) {
      console.error("[ADMIN_LIST_IMPORT_RUNS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to list Step-2 ImportRun ledger records.",
      });
    }
  });

  // 17. Phase 7 Server Scenario Lock: PATCH /api/admin/pilot-workspaces/:workspaceId/rules
  app.patch("/api/admin/pilot-workspaces/:workspaceId/rules", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    const workspaceId = req.params.workspaceId?.trim();
    if (!workspaceId) {
      return res.status(400).json({
        ok: false,
        error: "Workspace ID parameter is required.",
      });
    }

    const body = (req.body && typeof req.body === "object" ? req.body : {}) as UpdateSnapshotRulesPayload;

    try {
      const updated = await updatePilotWorkspaceSnapshotRules(workspaceId, body);
      if (updated.status === "NOT_FOUND") {
        return res.status(404).json({
          ok: false,
          error: `Pilot Audit Workspace Snapshot '${workspaceId}' not found.`,
        });
      }

      const snap = updated.snapshot;
      await recordServerAuditEvent({
        actor: "C. Jones Snowin",
        category: "PILOT_WALKTHROUGH",
        action: "WALKTHROUGH_RULES_LOCKED",
        details: `Locked agreed scenario thresholds into snapshot ${snap.workspaceId} (${snap.companyName}): Dead > ${snap.rules.deadThresholdDays}d, Slow > ${snap.rules.slowThresholdDays}d, Carrying Cost ${snap.rules.holdingCostPercent}% p.a., Reserve Spares Excluded=${String(snap.assumptionsAndExclusions?.excludeReserveSpares ?? true)}.`,
      });

      return res.json({
        ok: true,
        snapshot: snap,
      });
    } catch (err) {
      console.error("[PATCH_PILOT_WORKSPACE_RULES_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to lock scenario thresholds into Pilot Audit Snapshot.",
      });
    }
  });

  // 18. Phase 7 Public Verified Proof Registry: GET /api/verified-proofs
  app.get("/api/verified-proofs", async (_req, res) => {
    try {
      const proofs = await listVerifiedProofRecords();
      const sandboxDemonstrationProof = buildSandboxDemonstrationProofRecord();
      return res.json({
        ok: true,
        total: proofs.length,
        proofs,
        sandboxDemonstrationProof,
      });
    } catch (err) {
      console.error("[GET_VERIFIED_PROOFS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load Verified Proof Registry records.",
      });
    }
  });

  // 19. Phase 7 Protected Publish Verified Proof: POST /api/admin/verified-proofs
  app.post("/api/admin/verified-proofs", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const result = await publishVerifiedProofRecord(req.body as PublishVerifiedProofInput);
      if (!result.ok || !result.proof) {
        return res.status(400).json({
          ok: false,
          error: result.error || "Failed to validate Verified Proof payload.",
        });
      }

      return res.status(201).json({
        ok: true,
        proof: result.proof,
      });
    } catch (err) {
      console.error("[PUBLISH_VERIFIED_PROOF_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to publish Verified Proof record.",
      });
    }
  });

  // 20. Phase 7 Protected Delete Verified Proof: DELETE /api/admin/verified-proofs/:proofId
  app.delete("/api/admin/verified-proofs/:proofId", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    const proofId = req.params.proofId?.trim();
    if (!proofId) {
      return res.status(400).json({
        ok: false,
        error: "Proof ID parameter is required.",
      });
    }

    try {
      const result = await deleteVerifiedProofRecord(proofId);
      if (!result.ok) {
        return res.status(404).json({
          ok: false,
          error: result.error || `Verified proof '${proofId}' not found.`,
        });
      }

      return res.json({
        ok: true,
        removed: result.removed,
      });
    } catch (err) {
      console.error("[DELETE_VERIFIED_PROOF_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to remove Verified Proof record.",
      });
    }
  });

  // 21. Phase 8 Data Retention & Purge Action: POST /api/pilot-workspaces/:workspaceId/retention
  app.post("/api/pilot-workspaces/:workspaceId/retention", async (req, res) => {
    const workspaceId = req.params.workspaceId?.trim();
    if (!workspaceId) {
      return res.status(400).json({
        ok: false,
        error: "Workspace ID parameter is required.",
      });
    }

    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<
      string,
      unknown
    >;
    const shareToken =
      (typeof req.query.token === "string" ? req.query.token.trim() : "") ||
      (typeof body.shareToken === "string" ? body.shareToken.trim() : "") ||
      (typeof body.token === "string" ? body.token.trim() : "");
    const adminAuth = isAdminAuthenticated(req);

    try {
      const authLookup = await getAuthorizedPilotWorkspaceSnapshot(workspaceId, {
        shareToken,
        isAdmin: adminAuth.authenticated,
      });

      if (authLookup.status === "NOT_FOUND") {
        return res.status(404).json({
          ok: false,
          error: `Pilot Audit Workspace '${workspaceId}' not found.`,
        });
      }
      if (authLookup.status === "UNAUTHORIZED") {
        return res.status(401).json({
          ok: false,
          error:
            "Unauthorized: Valid shareToken (?token=...) or Founder x-admin-key is required to manage workspace data retention.",
        });
      }

      const action = typeof body.action === "string" ? body.action.trim() : "";
      const requestedBy =
        typeof body.requestedBy === "string" && body.requestedBy.trim()
          ? body.requestedBy.trim()
          : typeof body.actor === "string" && body.actor.trim()
          ? body.actor.trim()
          : adminAuth.authenticated
          ? "Founder / C. Jones Snowin"
          : `${authLookup.snapshot.companyName} (Walkthrough Share Token)`;

      if (action === "EXTEND_30_DAYS") {
        const extendRes = await extendPilotWorkspaceRetention(workspaceId, {
          requestedBy,
          additionalDays: 30,
        });
        if (!extendRes.ok || !extendRes.snapshot) {
          return res.status(400).json({
            ok: false,
            error: extendRes.error || "Failed to extend workspace retention window.",
          });
        }
        return res.json({
          ok: true,
          action: "EXTEND_30_DAYS",
          snapshot: extendRes.snapshot,
        });
      }

      if (action === "PURGE_IMMEDIATELY") {
        const purgeRes = await purgePilotWorkspace(workspaceId, {
          requestedBy,
          purgeReason: "IMMEDIATE_CLIENT_OR_ADMIN_PURGE",
        });
        if (!purgeRes.ok || !purgeRes.certificate) {
          return res.status(400).json({
            ok: false,
            error: purgeRes.error || "Failed to execute immediate data purge.",
          });
        }
        const isDemo = Boolean(purgeRes.isDemoProtected || purgeRes.demoProtected);
        return res.json({
          ok: true,
          action: "PURGE_IMMEDIATELY",
          isDemoProtected: isDemo,
          demoProtected: isDemo,
          certificate: purgeRes.certificate,
          snapshot: purgeRes.snapshot,
        });
      }

      return res.status(400).json({
        ok: false,
        error: "Invalid retention action. Expected 'EXTEND_30_DAYS' or 'PURGE_IMMEDIATELY'.",
      });
    } catch (err) {
      console.error("[WORKSPACE_RETENTION_ACTION_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to process workspace retention request.",
      });
    }
  });

  // 22. Phase 8 Sweep Expired (>14d) Workspaces: POST /api/admin/data-purge/sweep-expired
  app.post("/api/admin/data-purge/sweep-expired", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const result = await sweepExpiredWorkspaces({
        requestedBy: "Founder Admin Sweep (14-Day Expiry Enforcement)",
      });
      return res.json({
        ok: true,
        sweptCount: result.sweptCount,
        certificates: result.certificates,
      });
    } catch (err) {
      console.error("[SWEEP_EXPIRED_WORKSPACES_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to sweep expired Pilot Audit Workspaces.",
      });
    }
  });

  // 23. Phase 8 Public Deletion Certificate List & Verifier: GET /api/deletion-certificates & GET /api/deletion-certificates/:certificateId
  app.get("/api/deletion-certificates", async (_req, res) => {
    try {
      const certificates = await listDeletionCertificates();
      const sampleDemoCertificate = buildPublicDemoDeletionCertificate();
      return res.json({
        ok: true,
        total: certificates.length,
        certificates,
        sampleDemoCertificate,
      });
    } catch (err) {
      console.error("[LIST_DELETION_CERTIFICATES_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to list Deletion Certificates.",
      });
    }
  });

  app.get("/api/deletion-certificates/:certificateId", async (req, res) => {
    const certificateId = req.params.certificateId?.trim();
    if (!certificateId) {
      return res.status(400).json({
        ok: false,
        error: "Certificate ID parameter is required.",
      });
    }

    try {
      const certificate = await getDeletionCertificateById(certificateId);
      if (!certificate) {
        return res.status(404).json({
          ok: false,
          error: `Cryptographic Deletion Certificate '${certificateId}' not found.`,
        });
      }
      return res.json({
        ok: true,
        certificate,
      });
    } catch (err) {
      console.error("[GET_DELETION_CERTIFICATE_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to verify Cryptographic Deletion Certificate.",
      });
    }
  });

  // 24. Phase 8 Cloud Run 7-Store System Backup Export: GET /api/admin/system-backup
  app.get("/api/admin/system-backup", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const bundle = await exportSystemBackupBundle({}, "C. Jones Snowin");
      return res.json({
        ok: true,
        bundle,
      });
    } catch (err) {
      console.error("[EXPORT_SYSTEM_BACKUP_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to export 7-Store System Backup Bundle.",
      });
    }
  });

  // 25. Phase 8 Cloud Run 7-Store System Backup Restore (with Dry-Run): POST /api/admin/system-restore
  app.post("/api/admin/system-restore", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<
      string,
      unknown
    >;
    const dryRun =
      typeof body.dryRun === "boolean"
        ? body.dryRun
        : req.query.dryRun === "true" || req.query.dryRun === "1";
    const bundlePayload =
      body.bundle && typeof body.bundle === "object" ? body.bundle : body;

    try {
      const result = await restoreSystemBackupBundle(bundlePayload, {
        dryRun,
        actor: "C. Jones Snowin (Founder Admin Restore)",
      });

      if (!result.ok) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (err) {
      console.error("[RESTORE_SYSTEM_BACKUP_ERROR]", err);
      return res.status(500).json({
        ok: false,
        dryRun,
        integrityVerified: false,
        error: "Failed to process 7-Store System Backup Restore.",
      });
    }
  });

  // 26. Phase 8 Pre-Publish Production Readiness Scorecard: GET /api/admin/production-readiness
  app.get("/api/admin/production-readiness", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const backupSnapshot = await exportSystemBackupBundle({}, "Readiness Prober");
      const demoSnapshot = getAuthorizedPilotWorkspaceSnapshot("AUDIT-DEMO-P1P4", {
        isAdmin: true,
      });
      const resolvedDemo = await demoSnapshot;
      const enginesHealthy =
        resolvedDemo.status === "OK" &&
        resolvedDemo.snapshot.summaryMetrics.totalStockValue === 645650 &&
        resolvedDemo.snapshot.summaryMetrics.deadStockValue === 223110;

      return res.json({
        ok: true,
        enginesHealthy,
        storesHealthy: Boolean(backupSnapshot.bundleIntegrityHash),
        customAdminKeyConfigured: Boolean(process.env.ADMIN_ACCESS_KEY?.trim()),
        isDefaultDevKey: auth.isDefaultDevKey,
        timingSafeAuthActive: true,
        retentionPolicyDays: 14,
        storeCounts: backupSnapshot.storeCounts,
        bundleIntegrityHashPrefix: backupSnapshot.bundleIntegrityHash.slice(0, 16),
        readyForPublish: enginesHealthy && Boolean(backupSnapshot.bundleIntegrityHash),
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[PRODUCTION_READINESS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to evaluate Pre-Publish Production Readiness.",
      });
    }
  });

  // 27. Phase 9 First-Party Conversion & Scroll-Depth Funnel Event Tracker: POST /api/analytics/event
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const result = await recordFunnelAnalyticsEvent(req.body);
      if (!result.ok || !result.event) {
        return res.status(400).json({
          ok: false,
          error: result.error || "Invalid funnel analytics event payload.",
        });
      }
      return res.status(201).json({
        ok: true,
        event: result.event,
        report: result.report,
      });
    } catch (err) {
      console.error("[RECORD_FUNNEL_EVENT_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to record funnel analytics event.",
      });
    }
  });

  // 28. Phase 9 Protected Funnel Drop-Off Report: GET /api/admin/funnel-analytics
  app.get("/api/admin/funnel-analytics", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const report = await getFunnelAnalyticsDropOffReport();
      return res.json({
        ok: true,
        report,
      });
    } catch (err) {
      console.error("[GET_FUNNEL_ANALYTICS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to load B2B conversion funnel analytics.",
      });
    }
  });

  // 29. Phase 9 Protected Funnel Analytics Reset: POST /api/admin/funnel-analytics/reset
  app.post("/api/admin/funnel-analytics/reset", async (req, res) => {
    const auth = requireAdminAuth(req, res);
    if (!auth) return;

    try {
      const report = await resetFunnelAnalyticsEvents();
      return res.json({
        ok: true,
        report,
      });
    } catch (err) {
      console.error("[RESET_FUNNEL_ANALYTICS_ERROR]", err);
      return res.status(500).json({
        ok: false,
        error: "Failed to reset conversion funnel analytics.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
      plugins: [
        {
          name: "operationalyst-silence-hmr-ws",
          enforce: "post",
          transform(code, id) {
            if (id.includes("vite/dist/client/client.mjs")) {
              return code.replace(
                "transport.connect(createHMRHandler(handleMessage));",
                "/* HMR WebSocket disabled in Cloud Run preview */"
              );
            }
            return null;
          },
        },
      ],
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
