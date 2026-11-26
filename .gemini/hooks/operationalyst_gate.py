#!/usr/bin/env python3
import json
import re
import sys

REQUIRED_SHEETS = {
    "01_Health",
    "02_Idle_180d",
    "03_Pareto_Top25",
    "04_AS2_Ageing",
    "05_Burn_Cost",
    "06_Spares_Guard",
}

def respond(decision="allow", reason=None):
    out = {"decision": decision}
    if reason:
        out["reason"] = reason
    sys.stdout.write(json.dumps(out))
    sys.exit(0)

if __name__ == "__main__":
    try:
        data = json.load(sys.stdin)
        event = data.get("hook_event_name", "")

        if event == "BeforeTool":
            inp = data.get("tool_input", {})
            path = str(inp.get("file_path", inp.get("path", "")))
            code = str(inp.get("content", inp.get("new_string", "")))

            if path.endswith((".py", ".ts", ".tsx")):
                if re.search(r"float\s*\(\s*.*?(Unit_Cost_INR|Closing_Stock_Qty|book_value)", code):
                    respond("deny", "Use Decimal or integer paise for Unit_Cost_INR and book_value — never float().")
                if re.search(r"['\"](vendor_name|supplier_name|party_gstin|vendor_phone)['\"]", code, re.IGNORECASE):
                    if "drop" not in code.lower() and "redact" not in code.lower() and "reject" not in code.lower():
                        respond("deny", "Privacy violation: strip or reject supplier PII columns before processing.")
                if "01_Health" in code:
                    missing = [s for s in REQUIRED_SHEETS if s not in code]
                    if missing:
                        respond("deny", f"6-Sheet workbook incomplete — missing: {', '.join(sorted(missing))}")

        elif event == "AfterAgent" and not data.get("stop_hook_active", False):
            text = data.get("prompt_response", "")
            if re.search(r"\b(TODO|TBD|PLACEHOLDER|DUMMY_VALUE)\b", text):
                respond("deny", "Replace all TODO/TBD placeholders with exact reconciled figures before finishing.")

        respond("allow")
    except Exception as exc:
        sys.stderr.write(f"[operationalyst_gate] Warning: {exc}\n")
        respond("allow")
