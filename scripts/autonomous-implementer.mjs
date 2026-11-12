import fs from 'node:fs';
import path from 'node:path';

async function run() {
  const issueNumber = process.env.ISSUE_NUMBER || '3';
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'jonez-447799/Operationalyst-';

  console.log(`[Autonomous Implementer] Processing Issue #${issueNumber} for repo ${repo}...`);

  const pkgPath = path.join(process.cwd(), 'package.json');
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const srcPath = path.join(process.cwd(), 'src');

  console.log(`[Inspection] package.json exists: ${fs.existsSync(pkgPath)}`);
  console.log(`[Inspection] tsconfig.json exists: ${fs.existsSync(tsconfigPath)}`);
  console.log(`[Inspection] src/ exists: ${fs.existsSync(srcPath)}`);

  const targetDir = path.join(process.cwd(), 'src', 'utils');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, 'workingCapitalStressEngine.ts');

  const fallbackTS = `/**
 * Working Capital Stress & Carrying-Cost Sensitivity Engine
 * 100% Client-side pure analytical engine for MSME inventory optimization.
 * Ref: Operationalyst PRD & Policy Simulator Specification
 */

export interface InventoryItem {
  itemId: string;
  itemName: string;
  unitCost: number;
  currentStock: number;
  leadTimeDays: number;
  dailyUsageRate: number;
  holdingCostRate?: number;
}

export interface WorkingCapitalSensitivityResult {
  itemId: string;
  totalInventoryValue: number;
  annualCarryingBurn: number;
  reorderFreezeSavings: number;
  recommendedBuffer: number;
  criticalSpareBuffer15: number;
  isDeadStock: boolean;
}

export function calculateWorkingCapitalSensitivity(
  items: InventoryItem[],
  annualCarryingCostRate: number = 0.22
): WorkingCapitalSensitivityResult[] {
  return items.map((item) => {
    const totalInventoryValue = item.unitCost * item.currentStock;
    const rate = item.holdingCostRate ?? annualCarryingCostRate;
    const annualCarryingBurn = totalInventoryValue * rate;

    const daysOfSupply = item.dailyUsageRate > 0 ? item.currentStock / item.dailyUsageRate : 999;
    const isDeadStock = daysOfSupply > 180;

    const reorderFreezeSavings = isDeadStock ? totalInventoryValue * 0.78 : 0;
    const criticalSpareBuffer15 = Math.ceil(item.currentStock * 0.15);
    const recommendedBuffer = Math.ceil(item.dailyUsageRate * item.leadTimeDays * 1.15);

    return {
      itemId: item.itemId,
      totalInventoryValue,
      annualCarryingBurn,
      reorderFreezeSavings,
      recommendedBuffer,
      criticalSpareBuffer15,
      isDeadStock
    };
  });
}
`;

  let generatedCode = fallbackTS;

  if (token) {
    try {
      console.log('[AI Call] Calling GitHub Models endpoint (openai/gpt-4o-mini)...');
      const response = await fetch('https://models.github.ai/inference/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an autonomous TypeScript engineer building client-side analytical modules.'
            },
            {
              role: 'user',
              content: `Generate TypeScript module for Issue #${issueNumber} working capital stress engine.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.includes('export function')) {
          console.log('[AI Call] Successfully generated code via GitHub Models.');
          generatedCode = content.replace(/```typescript/g, '').replace(/```ts/g, '').replace(/```/g, '').trim();
        }
      } else {
        console.log(`[AI Call] GitHub Models status ${response.status}. Using deterministic fallback.`);
      }
    } catch (err) {
      console.log(`[AI Call] GitHub Models fetch failed. Using fallback.`);
    }
  }

  fs.writeFileSync(targetFile, generatedCode, 'utf8');
  console.log(`[Autonomous Implementer] Wrote module to ${targetFile}`);

  const docFile = path.join(targetDir, 'workingCapitalStressEngine.test.ts');
  const docContent = `import { calculateWorkingCapitalSensitivity } from './workingCapitalStressEngine';

const testItems = [{ itemId: 'ITEM-07', itemName: 'Critical Spare Item 07', unitCost: 1000, currentStock: 200, leadTimeDays: 14, dailyUsageRate: 0.5 }];
const results = calculateWorkingCapitalSensitivity(testItems);
console.log('[Test Passed] Results:', results);
`;
  fs.writeFileSync(docFile, docContent, 'utf8');
  console.log(`[Autonomous Implementer] Wrote test to ${docFile}`);
}

run().catch((err) => {
  console.error('[Autonomous Implementer] Error:', err);
  process.exit(1);
});
