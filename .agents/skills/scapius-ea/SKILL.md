---
name: scapius-ea-architect
description: >-
  Expert architect skill for authoring, scaffolding, refactoring, and validating
  Enterprise Architecture DSL models (.ea files) for Scapius.
  Use this skill whenever the user asks to create .ea files, model enterprise architecture,
  define capabilities, applications, systems, AI agents, technology infrastructure,
  security threat models, or governance policies, or when optimizing .ea models to
  ensure 100% data coverage across the executive dashboard (workspace_home).
---

# Scapius Architecture Modeling Skill

This skill guides you through authoring production-grade, multi-file Enterprise Architecture DSL models (`.ea`) for Scapius that compile cleanly and fully populate every widget and headline card of the default executive dashboard.

---

## Architecture Modeling Workflow

Follow this 5-step procedure whenever scaffolding or extending an architecture workspace:

```
Step 1: Workspace Scaffolding  ──▶ Step 2: Entity Modeling & Metadata
                                                │
Step 4: Dashboard Optimization ◀── Step 3: Relationship Wiring
         │
         ▼
Step 5: CLI Validation & Linting
```

---

### Step 1 — Workspace Scaffolding & Multi-File Layout

Organize models across domain folders representing the 6 core architecture layers:

```text
<workspace_root>/
├── main.ea                          # Workspace root, branding, theme link & overrides
├── default.theme                    # Centralized theme definitions (entity shapes, layer hues, edge styles)
├── views/
│   └── views.ea                     # Dedicated modular views (landscapes, capability maps, value streams, etc.)
├── strategy/
│   └── goals_kpis.ea                # Strategic goals, objectives, and KPIs
├── business/
│   ├── capabilities.ea              # L1-L3 Business Capability hierarchy
│   ├── actors_processes.ea          # Actors, personas, and business processes
│   └── value_streams.ea             # End-to-end customer/operational value streams
├── application/
│   ├── systems_apps.ea              # Core platforms, applications, components, and microservices
│   ├── data_objects.ea              # Core data assets (PII, PHI, telemetry, financial ledgers)
│   └── ai_agents.ea                 # Autonomous and supervised AI agent fleets
├── technology/
│   └── environments.ea              # Cloud and on-premise hosting infrastructure & SaaS
├── security/
│   └── security_architecture.ea     # Threat models (STRIDE), controls, CVEs, trust boundaries
├── governance/
│   └── policies.ea                  # Regulatory standards (PCI, SOX, GDPR) and corporate policies
└── layouts/                         # (Auto-generated) Visual coordinate cache files
```

#### Theme File (`default.theme`) & Root `main.ea` Structure:
> [!TIP]
> **Theme File Best Practice**: Always place global visual styles (node shapes, fills, strokes, layer backgrounds, and relationship verbs) in `default.theme` at the workspace root. Future compiler versions issue a warning if a declared theme file is not found at the specified path. `main.ea` should only reference `theme "default.theme"` and contain context-specific conditional styles or model overrides.

**`main.ea`**:
```scapius
workspace my_enterprise "My Enterprise Architecture" {
    styles {
        theme "default.theme"

        // Context-specific model overrides and conditional callouts
        style * where risk == "Critical" {
            css_class "border-danger bg-danger-subtle text-danger"
            border_width "3px"
        }
    }
}
```

**`default.theme`**:
```scapius
theme "default" {
    // Entity shapes and palette
    style capability     { shape "rounded_rectangle" fill "#ede9fe" stroke "#a78bfa" stroke_width "1.5px" color "#4c1d95" }
    style system         { shape "rounded_rectangle" fill "#dbeafe" stroke "#60a5fa" stroke_width "2.5px" color "#1e3a8a" }
    style app            { shape "rounded_rectangle" fill "#e0edfe" stroke "#3b82f6" stroke_width "2px" color "#1e40af" }
    style agent          { shape "hexagon" fill "#dcfce7" stroke "#22c55e" stroke_width "2px" color "#15803d" }
    style actor          { shape "actor" fill "#ffedd5" stroke "#fb923c" stroke_width "2px" color "#7c2d12" }
    style goal           { shape "chevron" fill "#e0f2fe" stroke "#0284c7" stroke_width "1.5px" color "#0369a1" }
    style kpi            { shape "circle" fill "#fef3c7" stroke "#f59e0b" stroke_width "1.5px" color "#78350f" }
    style control        { shape "shield" fill "#d1fae5" stroke "#10b981" stroke_width "1.5px" color "#047857" }
    style threat         { shape "triangle" fill "#fee2e2" stroke "#ef4444" stroke_width "2px" color "#991b1b" }
    style vulnerability  { shape "diamond" fill "#ffe4e6" stroke "#f43f5e" stroke_width "1.5px" color "#881337" }
    style data_object    { shape "octagon" fill "#f3e8ff" stroke "#a855f7" stroke_width "1.5px" color "#6b21a8" }
    style trust_boundary { shape "dashed_rectangle" fill "transparent" stroke "#14b8a6" stroke_width "2px" stroke_style "dashed" color "#0f766e" }
    style policy         { shape "document" fill "#f1f5f9" stroke "#64748b" stroke_width "1.5px" color "#1e293b" }
    style standard       { shape "bookmark" fill "#e0e7ff" stroke "#6366f1" stroke_width "1.5px" color "#312e81" }

    // Relationship verb strokes
    style realizes       { stroke "#34d399" stroke_width "2px" stroke_style "solid" }
    style serves         { stroke "#60a5fa" stroke_width "2px" stroke_style "solid" }
    style flows_to       { stroke "#fbbf24" stroke_width "2px" stroke_style "dashed" }
    style triggers       { stroke "#f87171" stroke_width "2px" stroke_style "dashed" }
    style mitigates      { stroke "#2dd4bf" stroke_width "2px" stroke_style "solid" }
    style protects       { stroke "#5eead4" stroke_width "1.5px" stroke_style "dashed" }
}
```

#### Dedicated Views (`views/views.ea`):
```scapius
views {
    landscape context_view "System Context" {
        include where layer == "Application Architecture"
        auto_layout LeftToRight
    }
    capability_map cap_view "Enterprise Capability Map" {
        include where layer == "Business Architecture"
        auto_layout LeftToRight
    }
    threat_model sec_view "Threat Model" {
        include where layer == "Security Architecture"
        auto_layout LeftToRight
    }
    value_stream_map onboarding_stream "Onboarding Value Stream" {
        include vs_onboarding
        auto_layout LeftToRight
    }
    data_flow data_flow_view "Sensitive Data Flow" {
        include where kind == "DataObject"
        auto_layout LeftToRight
    }
    compliance_matrix compliance_view "Regulatory Compliance Matrix" {
        include where layer == "Governance & Policy"
        include_verb governed_by
    }
}
```

---

### Step 2 — Entity Modeling & Property Compatibility

For full entity definitions, property rules, and enum bindings, always consult:
📖 **[Metamodel & Property Reference](./references/metamodel-reference.md)**

#### Key Authoring Rules:
1. **Capabilities**:
   - Use `maturity` (`"Initial"`, `"Managed"`, `"Defined"`, `"Optimizing"`).
   - Add `score { business_value <0-10> tech_fit <0-10> }` for portfolio positioning.
   - ⚠️ **NEVER add `time` to a capability.** `time` is strictly reserved for application/technology assets.
   - ⚠️ **Clean Display Titles (No Numbers in String)**: Never prefix the display label with numbers (e.g. use `"Actuarial Reserving"`, NOT `"5.2 Actuarial Reserving"`). Scapius's UI renderer automatically badges and prefixes the card with the `number` property (e.g. `number "5.2"`). Including numbers in the label text produces duplicate numbering in the UI (`[5.2] 5.2 Actuarial Reserving`) and makes tree refactoring brittle.
   - ⚠️ **Numbering Prefix Rule**: Child capability numbers must match parent prefix (e.g. `1.1` and `1.2` under `1.0`). Root capability domains (`1.0`, `2.0`, `3.0`) must be defined directly as top-level capabilities inside `layer "Business Architecture"`—do not nest them inside an unnumbered parent capability.
   - ⚠️ **Mandatory Phase Start Date**: When declaring `lifecycle`, `phase` requires a `start` date: `lifecycle { phase Run start "YYYY-MM-DD" }`.
2. **Applications & Systems**:
   - Assign Gartner TIME classification: `time "Invest"`, `time "Tolerate"`, `time "Migrate"`, or `time "Eliminate"`.
   - Specify cost: `cost { amount <num> unit year }` or `cost <num> month`.
   - Specify 2D portfolio scores: `score { business_value 9.5 tech_fit 9.0 }`.
   - Declare CIA security ratings: `security { confidentiality "Critical" integrity "Critical" availability "Critical" }`.
   - `tier`: Must use canonical hyphenated format: `"Tier-1"`, `"Tier-2"`, `"Tier-3"`.
   - `criticality` on `system`: Must use canonical enums: `"Mission-Critical"`, `"Business-Critical"`, `"Operational"`, `"Administrative"`, or `"Standard"`.
   - ⚠️ **Restrictiveness Constraint & System Floor**: Child `app` security ratings cannot be less restrictive than their ancestor `system`. To avoid constraint errors on systems with diverse child apps, declare the parent `system`'s security at the **baseline floor** (e.g. `Medium/Medium/Medium`), allowing child apps to elevate to `High` or `Critical`.
   - ⚠️ **No `technology` property**: Applications do not take `technology "<str>"`. Put technical frameworks in `description`, `tags`, or `attr`.
3. **Processes**:
   - ⚠️ **NEVER add `time` to a process.** Use `automation_level` (`"High"`, `"Partial"`, `"Manual"`).
4. **Infrastructure & Environments**:
   - `environment`: Root container declaring `provider` (e.g. `"Azure"`, `"AWS"`, `"SAP"`), `region` (`"eastus2"`), `env_type "Production"`, and `is_production true`.
   - `infrastructure`: Compute cluster or server declaring `provider` and `cost`. Region is inherited automatically from parent environment.
5. **AI Agents**:
   - Declare model: `model "claude-3-5-sonnet"` or `model "gpt-4o"`.
   - Declare governance block:
     ```scapius
     ai_governance {
         autonomy_level "Autonomous"  // "Autonomous", "SemiAutonomous", "Assisted"
         human_in_loop true           // boolean flag
     }
     ```
   - ⚠️ `tier` and `internet_facing` are prohibited on `agent`.
6. **Data Objects**:
   - Declare `classification` (`"Restricted"`, `"Confidential"`, `"Internal"`, `"Public"`).
   - Declare privacy flags: `pii true`, `phi false`.
   - ⚠️ **No `internet_facing` property**: Only applications/systems/boundaries have network perimeters.
7. **Security & Threat Entities**:
   - `threat`: Must use canonical STRIDE category: `category "DoS"` (not "DenialOfService"), `"Spoofing"`, `"Tampering"`, `"Repudiation"`, `"Info Disclosure"`, `"Privilege Escalation"`.
   - Set 5-level scales: `likelihood "High"`, `impact "High"`, `risk_rating "High"`.
   - `vulnerability`: Must declare `cve_id` and `cvss_score <0.0-10.0>`. Do not declare manual likelihood/impact; the engine computes these directly from CVSS.
   - `control`: `control_category` must use one of the 11 valid categories (e.g., `"Identity & Access Management"`, `"Network Security"`, `"Cryptography"`, `"Application Security"`, `"Data Protection"`).
   - `trust_boundary`: Must declare valid `boundary_type` (`"Zone"`, `"Network"`, `"Cloud"`, `"DMZ"`, `"Logical"`).
8. **Policies & Standards**:
   - ⚠️ `framework` is not a top-level native keyword on `policy` and `standard`. Declare frameworks using `tags ["PCI-DSS", "HIPAA"]` or `attr framework "HIPAA"`.
9. **Extensible Attributes (`attr`)**:
   - Use `attr <identifier> <value>` on any entity to capture SLAs, RTO/RPO, vendor names, runtime languages, and dates cleanly.

---

### Step 3 — Relationship Wiring

For all 16 valid verbs and allowed source/target pairs, consult:
📖 **[Relationship Verbs Reference](./references/relationship-verbs.md)**

```scapius
// 1. Capability Realization (Applications / Processes -> Capabilities)
app_mobile_banking realizes cap_digital_onboarding "Delivers mobile onboarding"
system_core_banking realizes cap_retail_banking "Underpins core deposit ledger"

// 2. Hosting & Lineage (Infra -> Apps -> Systems)
inf_aws_eks hosts app_mobile_banking "Runs container pods"
inf_ibm_z16 migrates_to env_aws_prod "Planned migration to AWS by 2027"

// 3. User & Agent Interaction
app_mobile_banking serves customer "Provides mobile interface"
agent_support_bot serves customer "Resolves customer triage questions"

// 4. Data Lineage
app_instant_pay writes data_ledger_tx "Persists cleared debits/credits"
app_aml_monitor reads data_ledger_tx "Streams live transaction events"

// 5. Security Protection & Threats
control_waf protects app_mobile_banking "Inspects ingress traffic" {
    mechanism "Monitoring"
}
control_waf mitigates threat_ddos "Filters volumetric surges"
threat_credential_stuffing targets app_mobile_banking "Attacks authentication API"
tb_pci_secure_enclave encloses system_core_banking "Enforces enclave boundary"
```

#### Key Relationship Rules:
* ⚠️ **`mitigates` Target Restriction**: Controls only mitigate **threats** (`control mitigates threat`). `control mitigates vulnerability` is rejected by the compiler.
* ⚠️ **`protects` Mechanism Rules**:
  * Controls categorized as `"Network Security"`, `"Application Security"`, or `"Data Protection"` require `{ mechanism "Monitoring" }` (or similar mechanism) when protecting an application.
  * Controls categorized as `"Cryptography"` auto-derive `mechanism "Encryption"` (valid for apps and `data_object`s).
  * Target type `data_object` does NOT support `mechanism "Monitoring"` (only `"Encryption"`).

---

### Step 4 — Ensuring 100% Default Dashboard Coverage

To ensure all 7 Tier 0 headline cards and 24 widgets populate without suppression, check:
📖 **[Dashboard Metrics & Population Guide](./references/dashboard-metrics.md)**

#### Essential Unsuppression Checklist:
- [ ] **Spend Concentration Headline & Cost Rollup**: At least one entity has `cost { amount <num> unit year }`.
- [ ] **Lifecycle Roadmap (Tier 1)**: At least one entity has `time "Eliminate"` AND `lifecycle { phase Retire start "YYYY-MM-DD" }` where the retire start date is within **6 months** of the current date.
- [ ] **TIME Distribution**: Diverse representation of `Invest`, `Tolerate`, `Migrate`, and `Eliminate`.
- [ ] **Capability Maturity**: Capabilities must have incoming `... realizes cap_name` relationships from active `Invest` or `Tolerate` software assets in `Run` or `Build` phases to avoid scoring `0.0 ("At Risk")`.
- [ ] **Risk Rating Matrix & STRIDE**: Threats declare `likelihood`, `impact`, `category`, and varied `mitigation_status` (`"Mitigated"`, `"Accepted"`, `"Open"`).
- [ ] **Vendor Concentration**: Infrastructures declare `provider` (`"Azure"`, `"AWS"`, `"SAP"`, `"Databricks"`).
- [ ] **AI Governance**: Agents declare `ai_governance` with standard autonomy levels and both `human_in_loop false` (autonomous) and `true` (supervised) flags.
- [ ] **KPI Scorecards**: KPIs declare both `target_value` and `current_value` with `trend`.

---

### Step 5 — CLI Validation & Verification

Always validate the generated or edited `.ea` workspace using the CLI compiler:

```bash
scapius validate <path_to_workspace>
# Or via Docker:
docker run --rm -v <path_to_workspace>:/workspace ghcr.io/scapius-ea/scapius-community:latest validate /workspace
```

#### Diagnostic Resolution Cheat-Sheet:
* **"Syntax error: mismatched input '}' expecting 'start'"**: A `phase` block is missing its start date. Add `start "YYYY-MM-DD"`.
* **"Entity does not support property X"**:
  * If on `process`: Remove `time`.
  * If on `policy` or `standard`: Remove `framework` keyword and use `tags` or `attr framework "..."`.
  * If on `capability`: Remove `time`.
* **"Explicit capability number 'X' does not match parent number prefix 'Y'"**: Make sure root capabilities are top-level inside `layer "Business Architecture"` rather than wrapped in an unnumbered parent capability.
* **"Explicit value is less restrictive than ancestor"**: Elevate child security CIA rating (e.g. from `High` to `Critical`) or lower the parent system's security to `Medium/Medium/Medium` (baseline floor).
* **"Relationship 'protects' requires an explicit 'mechanism' property"**: Add `{ mechanism "Monitoring" }` to the `protects` statement.
* **"Target entity type 'DataObject' is not allowed for mechanism 'Monitoring'"**: Use a Cryptography control to protect data objects.
* **"Verb 'mitigates' is not allowed from type 'Control' to 'Vulnerability'"**: Change target of `mitigates` to a `threat`.
* **"Property criticality has invalid value X"**: Use one of: `"Mission-Critical"`, `"Business-Critical"`, `"Operational"`, `"Administrative"`, `"Standard"`.
* **"Property control_category has invalid value X"**: Use `"Identity & Access Management"` (not `"Access Control"` or `"Identity Management"`).
