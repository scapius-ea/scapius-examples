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
| **`app`** | `description`, `owner`, `tags`, `tier`, `status`, `time`, `internet_facing`, `cost { amount unit }`, `score { business_value tech_fit }`, `security { confidentiality integrity availability }`, `lifecycle { phase ... }`, `ai_governance { autonomy_level human_in_loop }`, `relationships { ... }` | ❌ `technology` (use description/tags), ❌ `maturity`, ❌ `region`, ❌ `pii`/`phi` |
| **`system`** | `description`, `owner`, `tags`, `criticality`, `status`, `tier`, `time`, `cost { amount unit }`, `score { business_value tech_fit }`, `security { confidentiality integrity availability }`, `lifecycle { phase ... }`, `ai_governance { ... }`, `relationships { ... }` | ❌ `technology`, ❌ `maturity`, ❌ `internet_facing` |
| **`component`** | `description`, `owner`, `tags`, `time`, `cost`, `ai_governance { ... }`, `relationships { ... }` | Must be defined inside an `app` or `system`. |
| **`agent`** | `description`, `owner`, `tags`, `model`, `time`, `cost { amount unit }`, `security { confidentiality integrity availability }`, `ai_governance { autonomy_level human_in_loop }`, `relationships { ... }` | ❌ `tier`, ❌ `internet_facing` |
| **`capability`** | `description`, `owner`, `tags`, `number` (e.g. `"1.0"` or `auto`), `maturity`, `score { business_value tech_fit }`, `lifecycle { phase ... }`, nested `capability`, `relationships { ... }` | ❌ **`time` is strictly prohibited** on capabilities (only applications/technology take TIME). |
| **`process`** | `description`, `owner`, `tags`, `automation_level`, `time`, `ai_governance { ... }`, `relationships { ... }` | ❌ `score`, ❌ `security` block |
| **`actor`** | `description`, `owner`, `tags`, `role`, `is_external` (bool), `relationships { ... }` | ❌ `time`, ❌ `cost`, ❌ `score` |
| **`value_stream`** | `description`, `owner`, `tags`, nested `stage`, `relationships { ... }` | ❌ `priority`, ❌ `time` |
| **`stage`** | `description`, `order` (int), `relationships { ... }` | Nested inside `value_stream`. |
| **`environment`** | `description`, `owner`, `tags`, `provider`, `region`, `env_type`, `is_production` (bool), nested `infrastructure`, `relationships { ... }` | Root container for physical/cloud deployments. |
| **`infrastructure`** | `description`, `owner`, `tags`, `provider`, `time`, `cost { amount unit }`, `security { confidentiality integrity availability }`, `relationships { ... }` | ❌ `region` (region is defined on parent `environment` and inherited). |
| **`data_object`** | `description`, `owner`, `tags`, `classification`, `pii` (bool), `phi` (bool), `security { confidentiality integrity availability }`, `relationships { ... }` | ❌ `internet_facing` (internet facing applies to apps/infrastructure, not data assets). |
| **`goal`** | `description`, `owner`, `tags`, `priority`, `attr target_date "YYYY-MM-DD"`, `relationships { ... }` | ❌ `time`, ❌ `cost` |
| **`kpi`** | `description`, `owner`, `tags`, `target_value` (number), `current_value` (number), `unit` (string), `trend` (`"Up"`, `"Down"`, `"Stable"`), `relationships { ... }` | Strategic metric definition. |
| **`control`** | `description`, `owner`, `tags`, `control_type`, `control_category`, `framework`, `implementation_status`, `effectiveness`, `relationships { ... }` | Security control entity. |
| **`threat`** | `description`, `category` (STRIDE), `likelihood`, `impact`, `risk_rating`, `mitigation_status`, `relationships { ... }` | Security threat entity. |
| **`vulnerability`** | `description`, `cve_id`, `cvss_score` (number), `relationships { ... }` | ❌ `likelihood`, ❌ `impact`, ❌ `risk_rating`, ❌ `status` (CVSS 1-10 automatically maps to matrix & severity). |
| **`trust_boundary`** | `description`, `boundary_type`, `trust_level`, `attr zone_type`, `relationships { ... }` | Logical, cloud, or network perimeter. |
| **`policy`** | `description`, `owner`, `tags`, `policy_type`, `enforcement`, `priority`, `framework`, `relationships { ... }` | Governance policy. |
| **`standard`** | `description`, `owner`, `tags`, `standard_type`, `framework`, `attr authority`, `relationships { ... }` | Industry standard or regulatory framework. |

---

## 3. Platform Enum Reference (`default.yaml`)

Values are validated case-insensitively, but use canonical casing below:

### `time_class` (Property: `time`)
* `"Invest"`: Modern, cloud-native, high-strategic-value components to grow.
* `"Tolerate"`: Stable, reliable existing components needing minimal investment.
* `"Migrate"`: Legacy or sub-optimal components actively being replaced or replatformed.
* `"Eliminate"`: Outdated components scheduled for decommissioning / retirement.

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
* **Inheritance Rule**: A nested child (e.g. `app` inside a `system`) **cannot be less restrictive** than its parent container. If a system defines `integrity "Critical"`, its child apps must specify `"Critical"`.

### `data_classification` (Property: `classification` on `data_object`)
* `"Restricted"`: Highest sensitivity (e.g. raw card PAN, cryptokeys).
* `"Confidential"`: High sensitivity (e.g. personal customer balances, transaction logs).
* `"Internal"`: Organization internal operational data.
* `"Public"`: Freely shareable public information.

### `boundary_type` (Property: `boundary_type` on `trust_boundary`)
* Allowed values: `"Zone"`, `"Network"`, `"Cloud"`, `"DMZ"`, `"Process"`, `"Machine"`, `"Data"`, `"System"`, `"Logical"`.

### `ai_governance` (Block: `ai_governance { ... }`)
* `autonomy_level`: `"Autonomous"`, `"SemiAutonomous"`, `"Assisted"`.
* `human_in_loop`: `true` | `false`.

### `control` Properties
* `control_type`: `"Preventive"`, `"Detective"`, `"Corrective"`.
* `control_category`: `"Network Security"`, `"Cryptography"`, `"Access Control"`, `"Identity Management"`.
* `implementation_status`: `"Implemented"`, `"Planned"`, `"In-Progress"`.
* `effectiveness`: `"High"`, `"Medium"`, `"Low"` (or percentage like `"90%"`).

### `policy` Properties
* `enforcement`: `"Mandatory"`, `"Enforced"`, `"Automated"`, `"Advisory"`.
* `policy_type`: `"Security"`, `"Privacy"`, `"AI Governance"`, `"Compliance"`.
