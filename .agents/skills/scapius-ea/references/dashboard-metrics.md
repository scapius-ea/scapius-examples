# Default Dashboard Metrics & Population Guide

The Scapius platform evaluates an automated, executive-ready dashboard (`workspace_home`) directly from the compiled workspace AST model. This guide explains every tier, headline card, widget, and the exact authoring recipe to achieve 100% active data population.

---

## 1. Executive Briefing (Tier 0 Headline Cards)

The briefing tier presents 7 high-level KPI cards at the top of the dashboard:

| Card ID | Metric Displayed | Required DSL Properties | Suppression Trigger |
|---|---|---|---|
| **`modernization_posture_headline`** | % of portfolio classified as `Invest` or `Tolerate` vs `Migrate`/`Eliminate` | `time` on `app`, `system`, `infrastructure`, or `agent` | Suppressed if `timeEntities.Count == 0` |
| **`risk_exposure_headline`** | Count of unmitigated High/Critical threats + internet-facing entity count | `threat` with `risk_rating` + `mitigation_status` ("Open" or "Accepted"), plus `internet_facing true` on apps | Suppressed if `threats.Count == 0` |
| **`compliance_readiness_headline`** | Highest readiness % across tracked governance frameworks | `policy` (`enforcement "Mandatory"`), `control` (`effectiveness "High"`), tags like `["PCI-DSS"]`, `["GDPR"]` | Suppressed if no policies/controls/standards exist |
| **`spend_concentration_headline`** | Total annualized portfolio spend + currency | `cost { amount <num> unit year/month }` on apps, systems, or infrastructure | **Suppressed if `costAppCount == 0`** |
| **`resilience_headline`** | Vendor concentration % of top cloud/infra provider | `infrastructure` with `provider` (e.g. `"AWS"`, `"IBM"`, `"Azure"`) | Suppressed if no infrastructure exists |
| **`ai_governance_headline`** | Governed agent fleet count + no-human-in-loop count | `agent` with `ai_governance { autonomy_level "..." human_in_loop ... }` | Suppressed if no entities declare `ai_governance` |
| **`architecture_debt_headline`** | % of disconnected orphan entities | Workspace entities and relationships | Suppressed if `entities.Count == 0` |

---

## 2. Tier 1: Estate Shape

Visualizes structural dimensions and lifecycle trajectories.

### `layer_footprint`
* **Visual**: Stacked bar / donut of entities per architecture layer.
* **DSL Rule**: Organize entities inside standard `layer "<Name>" { ... }` blocks.
* **Suppression**: Distinct layer count == 0.

### `time_distribution`
* **Visual**: Donut chart displaying proportions of `Invest`, `Tolerate`, `Migrate`, `Eliminate`, and `Unclassified`.
* **DSL Rule**: Add `time Invest`, `time Tolerate`, `time Migrate`, or `time Eliminate` to applications, systems, and infrastructure.

### `lifecycle_roadmap`
* **Visual**: Timeline highlighting components approaching end-of-life.
* **Unsuppression Recipe**:
  1. Entity must specify `time "Eliminate"`.
  2. Entity must declare a `lifecycle` block with `phase Retire start "YYYY-MM-DD"`.
  3. The `start` date of `phase Retire` must fall between the current date and **6 months in the future** (horizon = 6 months).

---

## 3. Tier 2: Portfolio Value & Modernization

Prioritizes investment, technical debt, and capability health.

### `portfolio_quadrant`
* **Visual**: 2x2 scatter matrix (Business Value vs. Technical Fit).
* **DSL Rule**: Add `score { business_value <0-10> tech_fit <0-10> }` to `app`, `system`, or `capability`.
* **Quadrants**:
  * High BV / High TF: *Invest / Accelerate* (Top-Right)
  * High BV / Low TF: *Migrate / Modernize* (Top-Left)
  * Low BV / High TF: *Tolerate / Maintain* (Bottom-Right)
  * Low BV / Low TF: *Eliminate / Sunset* (Bottom-Left)

### `kpi_scorecards`
* **Visual**: Target vs. current metric cards with trend indicators.
* **DSL Rule**: Add `kpi` with `target_value`, `current_value`, `unit`, and `trend` (`"Up"`, `"Down"`, `"Stable"`).

### `cost_rollup_by_layer`
* **Visual**: Financial bar breakdown by architectural layer.
* **DSL Rule**: Add `cost { amount <num> unit year }` or shorthand `cost <num> year` to apps, systems, and infrastructure. Monthly costs are automatically annualized ($\times 12$).

### `capability_maturity`
* **Visual**: Automated capability maturity scorecard.
* **Formula**:
  $$\text{Score} = (0.5 \times \text{SupporterTimeMix} + 0.3 \times \text{FanInDensity} + 0.2 \times \text{PhaseCurrency}) \times 100$$
* **Authoring Recipe to avoid 0.0 ("At Risk") scores**:
  * The dashboard searches for incoming `... realizes <capability>` relationships.
  * Connect active apps/systems in `Invest` or `Tolerate` with `lifecycle { phase Run ... }` to capabilities using:
    `app_name realizes cap_name "Delivers capability"`
  * Capabilities without realizing supporters automatically score 0.0.

### `modernization_urgency_index`
* **Visual**: Ranked index of systems needing immediate modernization.
* **Trigger**: Entities with `time "Migrate"`, `time "Eliminate"`, or `phase Retire`, weighted by incoming dependencies (`fan-in`).

---

## 4. Tier 3: Risk & Security Posture

Evaluates cyber defense readiness and threat containment.

### `security_posture_score`
* Evaluates mitigating control coverage against threats targeting applications (`threat targets app`, `control mitigates threat`).

### `critical_threats_and_controls_spotlight`
* Spotlights highest CVSS vulnerabilities (`cvss_score >= 7.0`), critical threats (`risk_rating "Critical"`), and weak controls (`effectiveness "Low"` or `< 60%`).

### `threat_landscape_stride`
* Bar chart across STRIDE categories.
* Ensure threats declare standard categories: `"Spoofing"`, `"Tampering"`, `"Repudiation"`, `"Info Disclosure"`, `"DoS"`, `"Privilege Escalation"`.

### `risk_rating_matrix`
* 5x5 Likelihood vs. Impact heatmap.
* Set `likelihood` and `impact` on threats to: `"Critical"` (5), `"High"` (4), `"Medium"` (3), `"Low"` (2), or `"Very Low"` (1).

### `mitigation_status`
* Donut showing distribution of `"Mitigated"`, `"Accepted"`, and `"Open"` threats.
* Author threats with varied mitigation statuses to populate all three segments.

### `vulnerability_severity`
* Bar breakdown by CVSS severity (Critical: 9.0-10.0, High: 7.0-8.9, Medium: 4.0-6.9, Low: 0.1-3.9).
* Define `vulnerability` with `cvss_score <number>`.

### `data_exposure_risk_ranked`
* Evaluates sensitive data exposure based on `classification` (`Restricted`/`Confidential`), `pii true`, `phi true`, and relationship edge crossings.

### `vendor_concentration_risk`
* Tracks third-party infrastructure dependence.
* Add `provider` (e.g. `"AWS"`, `"Azure"`, `"GCP"`, `"IBM"`) to `infrastructure` entities.

---

## 5. Tier 4: Compliance & Governance

### `compliance_readiness_pct`
* Calculates readiness % per framework.
* Add tags or framework properties to policies and controls: `tags ["PCI-DSS", "SOX", "GDPR"]` or `framework "PCI-DSS"`.

### `control_effectiveness`
* Shows status vs effectiveness matrix.
* Set `implementation_status "Implemented"` and `effectiveness "High"` on controls.

---

## 6. Tier 5: AI Governance

### `agent_autonomy_risk`
* Evaluates autonomous agency risks.
* Set `ai_governance { autonomy_level "Autonomous" human_in_loop false }` on high-agency agents.
* Set `ai_governance { autonomy_level "SemiAutonomous" human_in_loop true }` for supervised assistants.

### `process_automation_ratio`
* % of business processes driven by AI agents.
* Add relationship: `agent realizes process` or `agent triggers process`.
