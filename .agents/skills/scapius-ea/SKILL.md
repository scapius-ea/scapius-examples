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
├── main.ea                          # Workspace root with theme, styles, and view definitions
├── strategy/
│   └── goals_kpis.ea                # Strategic goals, objectives, and KPIs
├── business/
│   ├── capabilities.ea              # L1-L3 Business Capability hierarchy
│   ├── actors_processes.ea          # Actors, personas, and business processes
│   └── value_streams.ea             # End-to-end customer/operational value streams
├── application/
│   ├── systems_apps.ea              # Core platforms, applications, components, and data objects
│   └── ai_agents.ea                 # Autonomous and supervised AI agent fleets
├── technology/
│   └── environments.ea              # Cloud and on-premise hosting infrastructure
├── security/
│   └── security_architecture.ea     # Threat models (STRIDE), controls, CVEs, trust boundaries
├── governance/
│   └── policies.ea                  # Regulatory standards (PCI, SOX, GDPR) and corporate policies
└── layouts/                         # (Auto-generated) Visual coordinate cache files
```

#### Root `main.ea` Structure:
```scapius
workspace my_enterprise "My Enterprise Architecture" {
    styles {
        style "system" { shape "rounded_rectangle" css_class "card shadow-sm border-primary" }
        style "app" { shape "pill" css_class "card border-secondary text-primary" }
        style "actor" { shape "actor" css_class "actor-node text-center" }
    }

    views {
        landscape context_view "System Context" {
            include * where layer == "Application Architecture"
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
2. **Applications & Systems**:
   - Assign Gartner TIME classification: `time "Invest"`, `time "Tolerate"`, `time "Migrate"`, or `time "Eliminate"`.
   - Specify cost: `cost { amount <num> unit year }` or `cost <num> month`.
   - Specify 2D portfolio scores: `score { business_value 9.5 tech_fit 9.0 }`.
   - Declare CIA security ratings: `security { confidentiality "Critical" integrity "Critical" availability "Critical" }`.
   - ⚠️ **Restrictiveness Constraint**: Child `app` security ratings cannot be less restrictive than their ancestor `system`.
   - ⚠️ **No `technology` property**: Applications do not take `technology "<str>"`. Put technical frameworks in `description` or `tags`.
3. **Infrastructure & Environments**:
   - `environment`: Root container declaring `provider` (e.g. `"AWS"`, `"IBM"`), `region` (`"us-east-1"`), `env_type "Production"`, and `is_production true`.
   - `infrastructure`: Compute cluster or server declaring `provider` and `cost`. Region is inherited automatically from parent environment.
4. **AI Agents**:
   - Declare model: `model "claude-3-5-sonnet"` or `model "gpt-4o"`.
   - Declare governance block:
     ```scapius
     ai_governance {
         autonomy_level "Autonomous"  // "Autonomous", "SemiAutonomous", "Assisted"
         human_in_loop true           // boolean flag
     }
     ```
5. **Data Objects**:
   - Declare `classification` (`"Restricted"`, `"Confidential"`, `"Internal"`, `"Public"`).
   - Declare privacy flags: `pii true`, `phi false`.
   - ⚠️ **No `internet_facing` property**: Only applications/systems/boundaries have network perimeters.
6. **Security & Threat Entities**:
   - `threat`: Must use canonical STRIDE category: `category "DoS"` (not "DenialOfService"), `"Spoofing"`, `"Tampering"`, `"Repudiation"`, `"Info Disclosure"`, `"Privilege Escalation"`.
   - Set 5-level scales: `likelihood "High"`, `impact "High"`, `risk_rating "High"`.
   - `vulnerability`: Must declare `cve_id` and `cvss_score <0.0-10.0>`. Do not declare manual likelihood/impact; the engine computes these directly from CVSS.
   - `trust_boundary`: Must declare valid `boundary_type` (`"Zone"`, `"Network"`, `"Cloud"`, `"DMZ"`, `"Logical"`).

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
control_waf protects app_mobile_banking "Inspects ingress traffic"
control_waf mitigates threat_ddos "Filters volumetric surges"
threat_credential_stuffing targets app_mobile_banking "Attacks authentication API"
tb_pci_secure_enclave encloses system_core_banking "Enforces enclave boundary"
```

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
- [ ] **Vendor Concentration**: Infrastructures declare `provider` (`"AWS"`, `"Azure"`, `"IBM"`).
- [ ] **AI Governance**: Agents declare `ai_governance` with standard autonomy levels and human-in-the-loop flags.
- [ ] **KPI Scorecards**: KPIs declare both `target_value` and `current_value` with `trend`.

---

### Step 5 — CLI Validation & Verification

Always validate the generated or edited `.ea` workspace using the CLI compiler:

```bash
scapius validate <path_to_workspace>
```

#### Diagnostic Resolution:
* **"Entity does not support property X"**: Review [Metamodel Reference](./references/metamodel-reference.md) and remove illegal property.
* **"Explicit value is less restrictive than ancestor"**: Elevate child security CIA rating (e.g. from `High` to `Critical`) to match parent container.
* **"Property boundary_type has invalid value"**: Use standard types (`"Zone"`, `"Network"`, `"Cloud"`, `"DMZ"`).
* **"extraneous input X"**: Check for syntax errors or keyword misplacement (e.g. `technology` keyword on app).
