# Scapius Relationship Verbs Reference

Scapius enforces a closed, semantically typed set of 16 relationship verbs. Free-form verbs are rejected by the grammar parser.

---

## 1. Closed Verb Catalog

| Verb | Direction / Meaning | Typical Source Entities | Typical Target Entities |
|---|---|---|---|
| **`realizes`** | Source implements or fulfills the capability, process, or goal of the target. | `app`, `system`, `component`, `agent`, `process`, `capability` | `capability`, `process`, `stage`, `goal` |
| **`serves`** | Source provides functionality, APIs, or user interfaces directly to the target. | `app`, `system`, `agent` | `actor`, `agent`, `app` |
| **`hosts`** | Source environment or physical compute hosts the application or system. | `environment`, `infrastructure` | `app`, `system`, `component` |
| **`reads`** | Source entity ingests, retrieves, or consumes data from target. | `app`, `system`, `component`, `agent` | `data_object` |
| **`writes`** | Source entity creates, persists, or updates the target data asset. | `app`, `system`, `component`, `agent` | `data_object` |
| **`flows_to`** | Asynchronous or synchronous information / transaction flow between systems. | `app`, `system`, `component` | `app`, `system`, `component` |
| **`triggers`** | Source initiates an event, automated workflow, or process in target. | `actor`, `agent`, `app`, `process` | `process`, `app`, `system` |
| **`composed_of`** | Composite structural aggregation (e.g. system comprised of sub-modules). | `system`, `app` | `component`, `app` |
| **`influences`** | Source metric, capability, or architecture asset impacts the target goal or KPI. | `capability`, `kpi`, `process` | `goal`, `kpi` |
| **`migrates_to`** | Architectural migration path from legacy asset to target destination. | `system`, `app`, `infrastructure` | `system`, `app`, `environment` |
| **`depends_on`** | Direct structural dependency between runtime components. | Any entity | Any entity |
| **`governed_by`** | Architecture asset or control is regulated by or bound to a standard/policy. | `system`, `app`, `control`, `data_object`, `agent` | `policy`, `standard` |
| **`mitigates`** | Security control reduces the risk of a threat. *(⚠️ Target cannot be a `vulnerability`)* | `control` | `threat` |
| **`protects`** | Security control provides perimeter or defense-in-depth shielding to target. | `control` | `app`, `system`, `data_object`, `infrastructure` |
| **`targets`** | Threat or vulnerability compromises or exploits the target system/app/data. | `threat`, `vulnerability` | `app`, `system`, `component`, `data_object`, `vulnerability` |
| **`encloses`** | Trust boundary physically or logically wraps around member assets. | `trust_boundary` | `app`, `system`, `infrastructure` |

---

## 2. Syntax Forms

### Form A: Block-Scoped (Preferred inside entity definitions)
```scapius
app app_mobile_banking "NeoBank Mobile App" {
    relationships {
        this serves customer "Provides mobile banking"
        this realizes cap_digital_onboarding "Delivers digital onboarding"
        this reads data_ledger_tx "Inspects recent transactions"
    }
}
```

### Form B: Standalone Top-Level Statement
```scapius
app_instant_pay flows_to system_core_banking "Posts cleared payments"
inf_ibm_z16 migrates_to env_aws_prod "Planned migration to AWS cloud core by 2027"
```

### Form C: Relationship with Metadata
```scapius
control_waf protects app_mobile_banking "Filters malicious HTTP traffic" {
    mechanism "Monitoring"
}

control_card_tokenization governed_by standard_pci_dss "Requirement 3.4" {
    status Compliant
}
```

---

## 3. `protects` Relationship Mechanism & Target Rules

When authoring `control protects <target>`:
1. **Auto-Derived Mechanisms**:
   * `control_category "Cryptography"` automatically derives `mechanism "Encryption"`. It is valid for applications, systems, infrastructure, and `data_object`s.
   * `control_category "Identity & Access Management"` automatically derives `mechanism "Authentication"`.
2. **Explicit Mechanism Required**:
   * Controls categorized under `"Network Security"`, `"Application Security"`, or `"Data Protection"` protecting an application MUST declare an explicit `{ mechanism "Monitoring" }` block:
     ```scapius
     control_waf protects app_mobile_portal "Inspects incoming HTTPS traffic" {
         mechanism "Monitoring"
     }
     ```
3. **Data Object Target Constraints**:
   * `data_object` **does not support** `mechanism "Monitoring"`:
     ```scapius
     // ❌ Compiler Error: Target entity type 'DataObject' is not allowed for mechanism 'Monitoring'
     control_waf protects data_customer_pii "Logs access" { mechanism "Monitoring" }

     // ✅ Valid: Use a Cryptography control to protect data objects
     control_hsm protects data_customer_pii "Encrypts data at rest"
     ```
