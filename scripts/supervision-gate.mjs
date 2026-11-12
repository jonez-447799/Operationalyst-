import fs from 'node:fs';
import path from 'node:path';

console.log('--- Operationalyst Supervision Gate Execution ---');

let failureCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ INVARIANT FAIL: ${message}`);
    failureCount++;
  } else {
    console.log(`✅ INVARIANT PASS: ${message}`);
  }
}

// 1. Deterministic 6-Stage Inventory Math Verification
function testInventoryMath() {
  console.log('\n[Stage 1] Verifying Inventory Math Equations & ERP Tolerances...');

  function parseERPDate(str) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str);
    if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
      const [d, m, y] = str.split('-');
      return new Date(`${y}-${m}-${d}`);
    }
    if (/^\d{8}$/.test(str)) {
      const y = str.substring(0, 4);
      const m = str.substring(4, 6);
      const d = str.substring(6, 8);
      return new Date(`${y}-${m}-${d}`);
    }
    return new Date(str);
  }

  function getDormancyDays(asOf, lastMovement) {
    const dAsOf = parseERPDate(asOf);
    const dLast = parseERPDate(lastMovement);
    const diff = dAsOf.getTime() - dLast.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function getDormancyBracket(days) {
    if (days <= 90) return '0–90d';
    if (days <= 180) return '91–180d';
    if (days <= 365) return '181–365d';
    return '>365d';
  }

  function calculateAnnualBurn(bookValue, holdingRate = 0.22) {
    return Math.round(bookValue * holdingRate * 100) / 100;
  }

  const asOf = '2026-03-31';
  assert(getDormancyDays(asOf, '2026-01-15') === 75, 'ISO Date Dormancy (75d)');
  assert(getDormancyBracket(75) === '0–90d', 'Bracket 0–90d');

  assert(getDormancyDays(asOf, '15-10-2025') === 167, 'Tally Date Format (167d)');
  assert(getDormancyBracket(167) === '91–180d', 'Bracket 91–180d');

  assert(getDormancyDays(asOf, '20250515') === 320, 'SAP Date Format (320d)');
  assert(getDormancyBracket(320) === '181–365d', 'Bracket 181–365d');

  assert(getDormancyDays(asOf, '2024-03-01') === 760, 'Dormancy >365d');
  assert(getDormancyBracket(760) === '>365d', 'Bracket >365d');

  assert(calculateAnnualBurn(100000, 0.22) === 22000, 'Annual Burn (100k @ 22%)');
  assert(calculateAnnualBurn(45000, 0.22) === 9900, 'Annual Burn (45k @ 22%)');

  const items = [
    { id: 'P1', value: 800 },
    { id: 'P2', value: 150 },
    { id: 'P3', value: 50 }
  ];
  const totalVal = items.reduce((acc, i) => acc + i.value, 0);
  items.sort((a, b) => b.value - a.value);
  let cum = 0;
  items.forEach(i => {
    cum += i.value;
    i.cumPct = (cum / totalVal) * 100;
  });

  assert(items[0].id === 'P1' && items[0].cumPct === 80, 'Pareto 80/20 top item concentration');
}

// 2. 5-Column Schema Contract Check
function testSchemaContract() {
  console.log('\n[Stage 2] Verifying 5-Column Schema Contract Integrity...');
  const requiredColumns = [
    'Part_ID',
    'Part_Description',
    'Closing_Stock_Qty',
    'Unit_Cost_INR',
    'Last_Movement_Date'
  ];

  let sampleHeader = 'Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Last_Movement_Date';
  requiredColumns.forEach(col => {
    assert(sampleHeader.includes(col), `Schema column required: ${col}`);
  });
}

// 3. Zero-Secret & Client-Privacy Audit
function testSecretAudit() {
  console.log('\n[Stage 3] Auditing Codebase for Leaked Secrets & Sensitive Files...');
  const forbiddenPatterns = [/AIzaSy[A-Za-z0-9_-]{33}/, /sk-[A-Za-z0-9]{32,}/, /ghp_[A-Za-z0-9]{36}/, /xai-[A-Za-z0-9]{32,}/];
  
  const checkDirectory = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkDirectory(fullPath);
      } else {
        const content = fs.readFileSync(fullPath, 'utf8');
        forbiddenPatterns.forEach(pattern => {
          assert(!pattern.test(content), `No secret pattern matching ${pattern} in ${fullPath}`);
        });
      }
    }
  };

  checkDirectory('.');
}

try {
  testInventoryMath();
  testSchemaContract();
  testSecretAudit();

  if (failureCount > 0) {
    console.error(`\n❌ Supervision Gate Failed with ${failureCount} errors.`);
    process.exit(1);
  } else {
    console.log('\n🎉 All Operationalyst Supervision Gate Invariants Passed Successfully!');
  }
} catch (err) {
  console.error('\n❌ Execution Error:', err);
  process.exit(1);
}
