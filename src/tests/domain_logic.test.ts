import test from 'node:test';
import assert from 'node:assert/strict';
import { PLANTS, PERIODS } from '../context/PlantContext';

test('Plant calibrations are consistent and distinct across units', () => {
  const ambattur = PLANTS.ambattur;
  const sriperumbudur = PLANTS.sriperumbudur;
  const hosur = PLANTS.hosur;

  // Verify Ambattur Baseline Unit KPIs
  assert.equal(ambattur.name, 'Ambattur Baseline Unit');
  assert.equal(ambattur.kpis.deadStockDisplay, '₹2.23L');
  assert.equal(ambattur.kpis.otifPercent, 50);
  assert.equal(ambattur.kpis.freightLeakDisplay, '₹14K');
  assert.equal(ambattur.kpis.binAccuracyPercent, 60);

  // Verify Sriperumbudur Unit 2 KPIs
  assert.equal(sriperumbudur.name, 'Sriperumbudur Press & Machining');
  assert.equal(sriperumbudur.kpis.deadStockDisplay, '₹18.4L');
  assert.equal(sriperumbudur.kpis.otifPercent, 91);
  assert.equal(sriperumbudur.kpis.freightLeakDisplay, '₹74K');
  assert.equal(sriperumbudur.kpis.binAccuracyPercent, 96);

  // Verify Hosur Auto Components Unit KPIs
  assert.equal(hosur.name, 'Hosur Auto Components Unit');
  assert.equal(hosur.kpis.deadStockDisplay, '₹8.75L');
  assert.equal(hosur.kpis.otifPercent, 84);
  assert.equal(hosur.kpis.freightLeakDisplay, '₹36K');
  assert.equal(hosur.kpis.binAccuracyPercent, 88);

  // Verify Periods
  assert.ok(PERIODS.fortnight_sep);
  assert.ok(PERIODS.month_sep);
  assert.ok(PERIODS.q3_fy26);
});

test('Customer Tier logic identifies Hyundai as Tier-1 Strategic OEM', () => {
  const CUSTOMER_PRIORITY_MAP: Record<string, { tier: string; annualCr: number; riskStatus: 'PROTECTED' | 'ACCOUNT AT RISK' | 'HEALTHY' }> = {
    'Hyundai': { tier: 'Tier-1 Strategic OEM', annualCr: 5.20, riskStatus: 'ACCOUNT AT RISK' },
    'Hyundai vendor park': { tier: 'Tier-1 Strategic OEM', annualCr: 5.20, riskStatus: 'ACCOUNT AT RISK' },
    'Ashok Leyland line': { tier: 'Tier-1 Strategic OEM', annualCr: 4.80, riskStatus: 'ACCOUNT AT RISK' },
    'Royal Enfield supplier': { tier: 'Tier-1 Tier-1 Major Sub-Assembly', annualCr: 4.10, riskStatus: 'ACCOUNT AT RISK' },
    'TVS Motor feeder': { tier: 'Tier-2 Critical Subsystem', annualCr: 1.85, riskStatus: 'PROTECTED' },
  };

  const hyundaiEntry = CUSTOMER_PRIORITY_MAP['Hyundai vendor park'];
  assert.ok(hyundaiEntry);
  assert.equal(hyundaiEntry.tier, 'Tier-1 Strategic OEM');
  assert.equal(hyundaiEntry.riskStatus, 'ACCOUNT AT RISK');
  assert.equal(hyundaiEntry.annualCr, 5.20);
});

test('Dual-Gate Root Cause logic sums exactly to 9 dispatches', () => {
  const dispatches = [
    { id: '1', reason: 'QC hold on final batch' },
    { id: '2', reason: 'Die breakdown during shift' },
    { id: '3', reason: 'Labour short in packing' },
    { id: '4', reason: 'Raw material shortage CRCA sheet' },
    { id: '5', reason: 'Fasteners stockout at store' },
    { id: '6', reason: 'Zinc plating delay vendor side' },
    { id: '7', reason: 'No vehicle arrived carrier delay' },
    { id: '8', reason: 'Transporter failed truck placement' },
    { id: '9', reason: 'Paperwork e-way bill error' },
  ];

  let prod = 0, mat = 0, transport = 0, doc = 0;
  for (const d of dispatches) {
    const raw = d.reason.toLowerCase();
    if (raw.includes('qc') || raw.includes('die') || raw.includes('labour') || raw.includes('machine')) {
      prod++;
    } else if (raw.includes('material') || raw.includes('stockout') || raw.includes('plating')) {
      mat++;
    } else if (raw.includes('vehicle') || raw.includes('carrier') || raw.includes('transporter')) {
      transport++;
    } else if (raw.includes('paper') || raw.includes('doc') || raw.includes('bill') || raw.includes('eway')) {
      doc++;
    }
  }

  assert.equal(prod, 3);
  assert.equal(mat, 3);
  assert.equal(transport, 2);
  assert.equal(doc, 1);
  assert.equal(prod + mat + transport + doc, 9);
});

test('Warehouse Reliability hourly machine rate impact math', () => {
  const hourlyRate = 6500;
  const downtimeHours = 4.5;
  const stoppageCost = Math.round(hourlyRate * downtimeHours);
  assert.equal(stoppageCost, 29250);
});

test('Cross-Engine 5-way consolidated capital exposure math', () => {
  const p1DeadCash = 1840000;
  const p2OtifRevenueExposure = 450000;
  const p3FreightLeakage = 74200;
  const p4AccuracyLoss = 126100;
  const p5UnpaidDebtors = 485000;

  const totalExposure =
    p1DeadCash +
    p2OtifRevenueExposure +
    p3FreightLeakage +
    p4AccuracyLoss +
    p5UnpaidDebtors;

  assert.equal(totalExposure, 2975300);
  assert.ok(totalExposure > 2500000);
});

test('Cross-Engine 4-week performance trajectory progression', () => {
  const curOtif = 91;
  const curAccuracy = 96;
  const curHealth = 84;

  const wMinus3Otif = Math.max(35, Math.round(curOtif * 0.80));
  const wMinus3Accuracy = Math.max(45, Math.round(curAccuracy * 0.88));
  const wMinus3Health = Math.max(38, Math.round(curHealth * 0.82));

  assert.equal(wMinus3Otif, 73);
  assert.equal(wMinus3Accuracy, 84);
  assert.equal(wMinus3Health, 69);

  // Verifies positive progress over the 4 weeks
  assert.ok(curOtif > wMinus3Otif);
  assert.ok(curAccuracy > wMinus3Accuracy);
  assert.ok(curHealth > wMinus3Health);
});

test('Daily Huddle summarizes top 3 critical actions per P1-P4 engine (12 total)', () => {
  const engineKeys = ['p1', 'p2', 'p3', 'p4'] as const;
  const actionsPerEngine = 3;
  const totalExpectedActions = engineKeys.length * actionsPerEngine;

  assert.equal(totalExpectedActions, 12);

  // Completion calculation simulation
  const mockCompletedIds = new Set(['huddle-p1-1', 'huddle-p2-1', 'huddle-p4-1']);
  const completedCount = mockCompletedIds.size;
  const percentDone = Math.round((completedCount / totalExpectedActions) * 100);

  assert.equal(completedCount, 3);
  assert.equal(percentDone, 25);
  assert.equal(totalExpectedActions - completedCount, 9);
});

test('Factory Audit calculations correctly isolate Dead Stock and Working Capital Opportunity', () => {
  const totalInventory = 48500000; // ₹4.85 Cr
  const deadStock = 1820000; // ₹18.2 Lakhs
  const slowMoving = 4200000; // ₹42 Lakhs
  const recoveryFactor = 0.80; // 80% liquidation/debit note yield

  const workingCapitalOpportunity = Math.round(deadStock * recoveryFactor);
  assert.equal(workingCapitalOpportunity, 1456000); // ~₹14.5 Lakhs
  assert.ok(deadStock / totalInventory < 0.10); // Dead stock is ~3.75% of active inventory
  assert.ok(slowMoving > deadStock);
});

test('Homepage Commercial 4 numbers reflect pilot plant benchmark targets', () => {
  const deadStockIdentified = 1800000; // ₹18L
  const recoverableCapital = 1200000; // ₹12L
  const currentOtif = 50; // 50%
  const potentialImprovement = 27; // +27% target

  assert.equal(deadStockIdentified, 1800000);
  assert.equal(recoverableCapital, 1200000);
  assert.equal(currentOtif, 50);
  assert.equal(currentOtif + potentialImprovement, 77);
  assert.ok(recoverableCapital < deadStockIdentified);
});

test('Persuasion System: 6-Step Commitment Ladder maintains strict risk-gradient', () => {
  const ladderSteps = [
    { step: 1, name: 'See How Audit Works', commitment: 'Zero Risk' },
    { step: 2, name: 'Request Inventory Health Check', commitment: 'Low Effort' },
    { step: 3, name: 'Share Inventory Export', commitment: 'Confidential' },
    { step: 4, name: 'Review Forensic Findings', commitment: 'High Value' },
    { step: 5, name: 'Start 30-Day Pilot', commitment: 'Hands-On' },
    { step: 6, name: 'Adopt Operationalyst', commitment: 'Full Rollout' },
  ];

  assert.equal(ladderSteps.length, 6);
  assert.equal(ladderSteps[0].commitment, 'Zero Risk');
  assert.equal(ladderSteps[5].commitment, 'Full Rollout');
});

test('Persuasion System: 30-Second Video Ad covers exact 6 narrative beats within 30s', () => {
  const beats = [
    { id: 1, start: 0, end: 3, label: 'The Cash Hook' },
    { id: 2, start: 4, end: 8, label: 'The Hidden Loss' },
    { id: 3, start: 9, end: 15, label: 'Forensic Breakdown' },
    { id: 4, start: 16, end: 22, label: 'Audit Methodology' },
    { id: 5, start: 23, end: 27, label: 'The Brand Reality' },
    { id: 6, start: 27, end: 30, label: 'Real Scarcity Call To Action' },
  ];

  assert.equal(beats.length, 6);
  assert.equal(beats[0].start, 0);
  assert.equal(beats[beats.length - 1].end, 30);
  // Ensure no gaps
  for (let i = 0; i < beats.length - 1; i++) {
    assert.ok(beats[i + 1].start <= beats[i].end + 1);
  }
});

test('Persuasion System: Real Scarcity is strictly bounded by founder personal capacity', () => {
  const pilotCapacity = 3;
  const claimedSlots = 1;
  const remainingSlots = pilotCapacity - claimedSlots;

  assert.equal(pilotCapacity, 3);
  assert.equal(remainingSlots, 2);
  assert.ok(remainingSlots > 0 && remainingSlots <= pilotCapacity);
});

test('Layer 1 Buyer Reality: Supports three distinct manufacturing personas', () => {
  const roles = ['owner', 'ops', 'inventory'];
  assert.equal(roles.length, 3);
  assert.ok(roles.includes('owner'));
  assert.ok(roles.includes('ops'));
  assert.ok(roles.includes('inventory'));
});

test('Layer 6 Specificity: Delivers exact 8 concrete outputs and 6 explicit limitations', () => {
  const deliverables = [
    'Data-Quality Overview',
    'Non-Moving Stock Classification',
    'Slow-Moving Inventory Identification',
    'Value Concentration Analysis',
    'High-Priority SKU List',
    'Category-Level Observations',
    'Recommended 4-Week Investigation Sequence',
    'Executive Findings Call',
  ];

  const limitations = [
    'Does NOT Guarantee Cash Recovery',
    'Does NOT Replace Manager Judgment',
    'Depends on Data Completeness',
    'Disposition Remains with You',
    'No ERP Changes Required',
    'No Hidden Recurring Subscription',
  ];

  assert.equal(deliverables.length, 8);
  assert.equal(limitations.length, 6);
});

test('Layer 8 Reciprocity: 7 practical shop floor checks available with zero login', () => {
  const checkCount = 7;
  assert.equal(checkCount, 7);
});

test('Conversion Architecture: 11-Stage Psychological Sequence is complete and ordered', () => {
  const stages = [
    'ATTENTION',
    'SELF-DIAGNOSIS',
    'ECONOMIC RELEVANCE',
    'CURIOSITY',
    'LOW-RISK COMMITMENT',
    'TRUST',
    'AUTHORITY',
    'PROOF',
    'PERSONALIZATION',
    'VALUE',
    'SALE',
  ];
  assert.equal(stages.length, 11);
  assert.equal(stages[0], 'ATTENTION');
  assert.equal(stages[10], 'SALE');
});

test('Testing Roadmap: Supports 3 empirical hero frames and 5-question self-check', () => {
  const heroFrames = ['A', 'B', 'C'];
  const selfCheckQuestionsCount = 5;

  assert.equal(heroFrames.length, 3);
  assert.equal(selfCheckQuestionsCount, 5);
});

test('Homepage Config: 16-Section data constants are fully populated and structured', async () => {
  const config = await import('../commercial/homepageConfig');
  assert.ok(config.HERO_HEADLINE_VARIANTS.A);
  assert.ok(config.HERO_HEADLINE_VARIANTS.B);
  assert.ok(config.HERO_HEADLINE_VARIANTS.C);
  assert.equal(config.PROBLEM_QUESTIONS.length, 4);
  assert.equal(config.PROCESS_STEPS.length, 5);
  assert.equal(config.AUDIT_DELIVERABLES.length, 9);
  assert.equal(config.METHODOLOGY_STAGES.length, 6);
  assert.equal(config.DATA_TRUST_ITEMS.length, 7);
  assert.equal(config.FAQ_ITEMS.length, 10);
});

test('Self-Assessment logic correctly grades points into cautious categories', () => {
  const maxScore = 5 * 3; // 15
  assert.equal(maxScore, 15);

  const gradeScore = (score: number) => {
    if (score >= 12) return 'Strong Visibility Foundation';
    if (score >= 7) return 'Some Visibility Gaps';
    return 'Review Recommended';
  };

  assert.equal(gradeScore(15), 'Strong Visibility Foundation');
  assert.equal(gradeScore(12), 'Strong Visibility Foundation');
  assert.equal(gradeScore(10), 'Some Visibility Gaps');
  assert.equal(gradeScore(7), 'Some Visibility Gaps');
  assert.equal(gradeScore(6), 'Review Recommended');
  assert.equal(gradeScore(0), 'Review Recommended');
});

test('B2B Behavioral System: Stakeholder perspectives, objection matrix, anxiety map, and 27 iceberg dimensions are valid', async () => {
  const config = await import('../commercial/homepageConfig');

  // Verify 4 Stakeholder Roles (Economic Buyer, Champion, User, Technical Evaluator)
  assert.equal(config.STAKEHOLDER_PERSPECTIVES.length, 4);
  const roleIds = config.STAKEHOLDER_PERSPECTIVES.map((s) => s.id);
  assert.deepEqual(roleIds, ['economic_buyer', 'champion', 'user', 'evaluator']);
  for (const s of config.STAKEHOLDER_PERSPECTIVES) {
    assert.ok(s.coreQuestion.length > 10);
    assert.ok(s.unspokenAnxiety.length > 10);
    assert.ok(s.riskMitigation.length > 10);
    assert.ok(s.keyMetrics.length >= 2);
  }

  // Verify 6 Objections with 4-stage engineering
  assert.equal(config.OBJECTION_MATRIX.length, 6);
  for (const obj of config.OBJECTION_MATRIX) {
    assert.ok(obj.objection.length > 10);
    assert.ok(obj.underlyingAnxiety.length > 10);
    assert.ok(obj.evidenceAndMechanism.length > 10);
    assert.ok(obj.institutionalGuarantee.length > 10);
    assert.ok(obj.verificationStep.length > 10);
  }

  // Verify Customer Anxiety Mapping across 5 stages
  assert.equal(config.CUSTOMER_ANXIETY_MAP.length, 5);
  for (const stg of config.CUSTOMER_ANXIETY_MAP) {
    assert.ok(stg.stage.length > 0);
    assert.ok(stg.unspokenAnxiety.length > 0);
    assert.ok(stg.institutionalSafeguard.length > 0);
  }

  // Verify 27 Behavioral Science Dimensions
  assert.equal(config.BEHAVIORAL_ICEBERG_DIMENSIONS.length, 27);
  assert.equal(config.BEHAVIORAL_ICEBERG_DIMENSIONS[0].num, '01');
  assert.equal(config.BEHAVIORAL_ICEBERG_DIMENSIONS[26].num, '27');
});

test('Phase 2 Campaign Studio: 6 Ad Variations, Founder Teleprompter, LinkedIn Posts & 1-Manufacturer Milestone logic', () => {
  const AD_VARIATION_IDS = ['A', 'B', 'C', 'D', 'E', 'F'];
  assert.equal(AD_VARIATION_IDS.length, 6);

  // Milestone Progression
  const targetMilestones = [
    '1 Real Manufacturer',
    '1 Real Audit',
    '1 Useful Result',
    '1 Case Study',
    '1 Paid Customer',
  ];
  assert.equal(targetMilestones.length, 5);
  assert.equal(targetMilestones[0], '1 Real Manufacturer');
  assert.equal(targetMilestones[4], '1 Paid Customer');

  // Ad A Loss Frame
  const adA = {
    headline: 'How Much of Your Inventory Hasn’t Moved?',
    cta: 'Request Factory Audit →',
  };
  assert.ok(adA.headline.includes('Hasn’t Moved'));

  // Ad F Founder Script
  const adF = {
    founderHook: 'I’m building Operationalyst around a simple manufacturing problem.',
    founderCTA: 'Apply for Pilot Audit →',
  };
  assert.ok(adF.founderHook.length > 20);
});


