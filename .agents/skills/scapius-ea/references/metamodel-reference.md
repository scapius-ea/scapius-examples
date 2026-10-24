# Scapius Metamodel & Property Reference

This reference documents all architectural entities, their legal properties, allowed enums from `default.yaml`, and semantic validation constraints.

---

## 1. Architectural Layers & Entity Catalog

Scapius workspaces organize architecture into six standard layers:
1. **Strategy Layer**: `goal`, `kpi`
2. **Business Architecture**: `capability`, `process`, `actor`, `value_stream`, `stage`
3. **Application Architecture**: `system`, `app`, `component`, `agent`, `data_object`
4. **Technology Architecture**: `environment`, `infrastructure`
5. **Security Architecture**: `control`, `threat`, `vulnerability`, `trust_boundary`
6. **Governance & Policy**: `policy`, `standard`

---

## 2. Entity Property Matrix

| Entity | Allowed Properties / Blocks | Prohibited / Not Supported |
|---|---|---|
| **`app`** | `description`, `owner`, `tags`, `tier`, `status`, `time`, `internet_facing`, `cost { amount unit }`, `score { business_value tech_fit }`, `security { confidentiality integrity availability }`, `lifecycle { phase ... }`, `ai_governance { autonomy_level human_in_loop }`, `relationships { ... }` | ❌ `technology` (use description/tags/attr), ❌ `maturity`, ❌ `region`, ❌ `pii`/`phi` |
| **`system`** | `description`, `owner`, `tags`, `criticality`, `status`, `tier`, `time`, `cost { amount unit }`, `score { business_value tech_fit }`, `security { confidentiality integrity availability }`, `lifecycle { phase ... }`, `ai_governance { ... }`, `relationships { ... }` | ❌ `technology`, ❌ `maturity`, ❌ `internet_facing` |
| **`component`** | `description`, `owner`, `tags`, `time`, `cost`, `ai_governance { ... }`, `relationships { ... }` | Must be defined inside an `app` or `system`. |
| **`agent`** | `description`, `owner`, `tags`, `model`, `time`, `cost { amount unit }`, `security { confidentiality integrity availability }`, `ai_governance { autonomy_level human_in_loop }`, `relationships { ... }` | ❌ `tier`, ❌ `internet_facing` |
| **`capability`** | `description`, `owner`, `tags`, `number` (e.g. `"1.0"` or `auto`), `maturity`, `score { business_value tech_fit }`, `lifecycle { phase ... }`, nested `capability`, `relationships { ... }` | ❌ **`time` is strictly prohibited** on capabilities (only applications/technology take TIME). |
| **`process`** | `description`, `owner`, `tags`, `automation_level`, `ai_governance { ... }`, `relationships { ... }` | ❌ **`time` is prohibited** on processes, ❌ `score`, ❌ `security` block |
| **`actor`** | `description`, `owner`, `tags`, `role`, `is_external` (bool), `relationships { ... }` | ❌ `time`, ❌ `cost`, ❌ `score` |
| **`value_stream`** | `description`, `owner`, `tags`, nested `stage`, `relationships { ... }` | ❌ `priority`, ❌ `time` |
| **`stage`** | `description`, `order` (int), `relationships { ... }` | Nested inside `value_stream`. |
| **`environment`** | `description`, `owner`, `tags`, `provider`, `region`, `env_type`, `is_production` (bool), nested `infrastructure`, `relationships { ... }` | Root container for physical/cloud deployments. |
| **`infrastructure`** | `description`, `owner`, `tags`, `provider`, `time`, `cost { amount unit }`, `security { confidentiality integrity availability }`, `relationships { ... }` | ❌ `region` (region is defined on parent `environment` and inherited). |
| **`data_object`** | `description`, `owner`, `tags`, `classification`, `pii` (bool), `phi` (bool), `security { confidentiality integrity availability }`, `relationships { ... }` | ❌ `internet_facing` (internet facing applies to apps/infrastructure, not data assets). |
| **`goal`** | `description`, `owner`, `tags`, `priority`, `attr target_date "YYYY-MM-DD"`, `relationships { ... }` | ❌ `time`, ❌ `cost` |
| **`kpi`** | `description`, `owner`, `tags`, `target_value` (number), `current_value` (number), `unit` (string), `trend` (`"Up"`, `"Down"`, `"Stable"`), `relationships { ... }` | Strategic metric definition. |
| **`control`** | `description`, `owner`, `tags`, `control_type`, `control_category`, `implementation_status`, `effectiveness`, `relationships { ... }` | ❌ `framework` as top-level keyword (use `tags` or `attr framework "..."`). |
| **`threat`** | `description`, `category` (STRIDE), `likelihood`, `impact`, `risk_rating`, `mitigation_status`, `relationships { ... }` | Security threat entity. |
| **`vulnerability`** | `description`, `cve_id`, `cvss_score` (number), `relationships { ... }` | ❌ `likelihood`, ❌ `impact`, ❌ `risk_rating`, ❌ `status` (CVSS 1-10 automatically maps to matrix & severity). |
| **`trust_boundary`** | `description`, `boundary_type`, `trust_level`, `attr zone_type`, `relationships { ... }` | Logical, cloud, or network perimeter. |
| **`policy`** | `description`, `owner`, `tags`, `policy_type`, `enforcement`, `priority`, `relationships { ... }` | ❌ `framework` keyword (use `tags` or `attr framework "..."`). |
| **`standard`** | `description`, `owner`, `tags`, `standard_type`, `attr authority`, `relationships { ... }` | ❌ `framework` keyword (use `tags` or `attr framework "..."`). |

---

## 3. Platform Enum Reference (`default.yaml`)

Values are validated case-insensitively, but use canonical casing below:

### `criticality` (Property: `criticality` on `system`)
* Allowed values: `"Mission-Critical"`, `"Business-Critical"`, `"Operational"`, `"Administrative"`, `"Standard"`.
* ⚠️ Do not use plain `"Critical"` or `"High"`—the compiler requires the canonical hyphenated values above.

### `tier` (Property: `tier` on `app` or `system`)
* Allowed values: `"Tier-1"`, `"Tier-2"`, `"Tier-3"`. (Always hyphenated).

### `time_class` (Property: `time`)
* `"Invest"`: Modern, cloud-native, high-strategic-value components to grow.
* `"Tolerate"`: Stable, reliable existing components needing minimal investment.
* `"Migrate"`: Legacy or sub-optimal components actively being replaced or replatformed.
* `"Eliminate"`: Outdated components scheduled for decommissioning / retirement.
* ⚠️ **Allowed only on `app`, `system`, `component`, `infrastructure`, and `agent`**. Prohibited on `capability`, `process`, `actor`, and `goal`.

### `lifecycle` Phase Syntax
* Every `phase` declared inside `lifecycle { ... }` **must specify a `start` date**:
  ```scapius
  // ❌ Syntax Error: mismatched input '}' expecting 'start'
  lifecycle { phase Run }

  // ✅ Valid:
  lifecycle { phase Run start "2024-01-01" }
  lifecycle { phase Retire start "2027-01-15" }
  ```

### Capability Numbering & Clean Label Conventions
* **Clean Display Strings**: Do NOT prefix the capability label string with numeric indicators (e.g. use `"Actuarial Reserving"`, not `"5.2 Actuarial Reserving"`).
  * The Scapius UI renderer automatically reads the `number` property and badges the card in `capability_map` views.
  * Hardcoding numbers into display strings produces redundant text (`[5.2] 5.2 Actuarial Reserving`) and makes re-numbering or moving capabilities brittle.
* **Prefix Alignment**: Child capability numbers must match the parent's prefix (e.g. under `"1.0"`, children must be `"1.1"`, `"1.2"`).
* **Root Domains**: Declare root capability domains (`1.0`, `2.0`, `3.0`) directly at the top level inside `layer "Business Architecture"` rather than wrapped in an unnumbered parent capability.

### `control_category` (Property: `control_category` on `control`)
* Exactly 11 allowed values:
  1. `"Technical"`
  2. `"Administrative"`
  3. `"Physical"`
  4. `"Identity & Access Management"` (⚠️ Single category; `"Access Control"` and `"Identity Management"` are rejected)
  5. `"Cryptography"`
  6. `"Security Monitoring"`
  7. `"Network Security"`
  8. `"Application Security"`
  9. `"Data Protection"`
  10. `"Infrastructure Security"`
  11. `"Data Security"`

### `stride_category` (Property: `category` on `threat`)
* `"Spoofing"`: Identity spoofing / unauthorized masquerading.
* `"Tampering"`: Data or code integrity manipulation.
* `"Repudiation"`: Inability to prove action occurrence.
* `"Info Disclosure"`: Data breach / confidential information leaks.
* `"DoS"`: Denial of Service / resource exhaustion (**Note**: Use `"DoS"`, not `"DenialOfService"`).
* `"Privilege Escalation"`: Elevation of privilege / bypass of access boundaries.

### `mitigation_status` (Property: `mitigation_status` on `threat`)
* `"Open"`: Active unmitigated threat.
* `"Accepted"`: Formally accepted operational risk.
* `"Mitigated"`: Fully addressed by one or more protective controls.

### `security_rating` (CIA Triad on `security { ... }`)
* Allowed values for `confidentiality`, `integrity`, and `availability`:
  * `"Critical"` (Score: 4)
  * `"High"` (Score: 3)
  * `"Medium"` (Score: 2)
  * `"Low"` (Score: 1)
* **Inheritance & Floor Rule**:
  * A nested child (e.g. `app` inside a `system`) **cannot be less restrictive** than its parent container. Explicit values cannot loosen inherited restrictiveness.
  * **Architectural Best Practice**: To support child apps with mixed security classifications, define the parent `system`'s security block at the **baseline floor** (e.g., `Medium/Medium/Medium`), allowing individual child apps to elevate to `High` or `Critical`.

### `data_classification` (Property: `classification` on `data_object`)
* `"Restricted"`: Highest sensitivity (e.g. raw card PAN, cryptokeys, PHI).
* `"Confidential"`: High sensitivity (e.g. customer profiles, claims dossiers, financial ledgers).
* `"Internal"`: Organization internal operational data (e.g. telematics sensor feeds).
* `"Public"`: Freely shareable public information.

### `boundary_type` (Property: `boundary_type` on `trust_boundary`)
* Allowed values: `"Zone"`, `"Network"`, `"Cloud"`, `"DMZ"`, `"Process"`, `"Machine"`, `"Data"`, `"System"`, `"Logical"`.

### `ai_governance` (Block: `ai_governance { ... }`)
* `autonomy_level`: `"Autonomous"`, `"SemiAutonomous"`, `"Assisted"`.
* `human_in_loop`: `true` | `false`.

---

## 4. Extensible Metadata with `attr`

Scapius EA DSL allows arbitrary custom key-value metadata on **all** architectural entities using the syntax `attr <identifier> <value>`. Use `attr` to capture operational SLAs, compliance tags, vendor names, runtime languages, and dates without breaking metamodel validation:

```scapius
app app_claims_engine "Claims Engine" {
    attr delivery_model "In_House_Cloud_Native"
    attr runtime_language "Go_1.22"
    attr rto "15_minutes"
    attr rpo "0_seconds"
    attr sla_availability "99.99%"
}

agent agent_claims_bot "Claims Bot" {
    attr inference_endpoint "Azure_OpenAI_EastUS2"
    attr max_context_window "128k_tokens"
    attr hallucination_threshold "<0.01%"
    attr prompt_shield_enabled true
}

trust_boundary tb_phi_enclave "HIPAA PHI Enclave" {
    attr zone_type "HIPAA_PHI_Enclave"
    attr zero_trust_policy "mTLS_Strict"
}

standard standard_pci "PCI DSS" {
    attr authority "PCI_Security_Standards_Council"
    attr standard_version "4.0"
}
```
