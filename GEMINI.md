# Operationalyst — Deterministic Manufacturing Audit Engine

## 1. Strict 5-Column Input CSV Contract
Accept and validate only these 5 supplier-stripped columns:
- `Part_ID`: Alphanumeric SKU identifier (string)
- `Part_Description`: Item description (string)
- `Closing_Stock_Qty`: Physical closing stock balance (Decimal / numeric)
- `Unit_Cost_INR`: Unit cost in INR (Decimal or integer paise — NEVER binary float)
- `Last_Movement_Date`: Parse both `YYYY-MM-DD` and Indian `DD/MM/YYYY`

Immediately reject or strip any file containing `vendor_name`, `supplier_name`, `party_gstin`, or `vendor_phone`.

## 2. Mandatory 6-Sheet .XLSX Hitlist Output
1. `01_Health`: Reconcile `Closing_Stock_Qty * Unit_Cost_INR` line-by-line to General Ledger stock summary (0 paise variance).
2. `02_Idle_180d`: Isolate inventory where `(Audit_Date - Last_Movement_Date) > 180` days, excluding `Retain` spares.
3. `03_Pareto_Top25`: Rank the top 15–25 non-spare stagnant SKUs locking up ~76–80% of idle working capital.
4. `04_AS2_Ageing`: Classify into AS-2 & CARO Clause 3(ii) brackets: `0-90d` (Active), `91-180d` (Slow-Moving), `181-365d` (Non-Moving), `>365d` (Obsolete).
5. `05_Burn_Cost`: Compute 22.0%/yr carrying cost drain (`11.5%` OD interest + `4.5%` warehouse space + `2.5%` insurance + `3.5%` scrap/damage).
6. `06_Spares_Guard`: Tag critical CNC breakdown/maintenance spares as `Retain` and shield them from disposal hitlists.
