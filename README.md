# scapius-examples
Repository for publishing the demo workspaces for Scapius EA
# Scapius EA Examples

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Welcome to the **scapius-examples** repository! This repository hosts official demo workspaces, reference architectures, and blueprint models for **Scapius EA**—the modern Architecture-as-Code (AaC) platform for enterprise modeling, visualization, and strategic alignment.

---

## 🌟 Overview

Scapius EA enables organizations to define, version-control, and visualize multi-layer enterprise architecture models using a clean, declarative domain-specific language (`.ea`).

This repository provides realistic, production-grade example models showcasing how Scapius EA models complex domains across:

* **Strategy & Motivation**: Objectives, goals, drivers, and KPIs.
* **Business Architecture**: Hierarchical capability maps, value streams, business processes, and actors.
* **Application Architecture**: Core platforms, microservices, data objects (with PII & classification metadata), and autonomous AI agent fleets.
* **Technology & Cloud Infrastructure**: Multi-region cloud environments (AWS EKS), hybrid hosting, and legacy mainframes.
* **Security & Threat Modeling**: Trust boundaries, STRIDE threat identification, CVE vulnerability tracking, and security controls.
* **Governance, Risk & Compliance (GRC)**: Regulatory mapping for standards like PCI DSS v4.0 and SOX 404.

---

## 📂 Available Workspaces

### 1. NeoBank Reference Architecture (`Neobank/`)

The **NeoBank** workspace models a cloud-native digital banking platform delivering instant payments, automated lending, and AI-assisted customer operations alongside legacy core banking systems.

#### Key Highlights & Capabilities Demonstrated

* **Multi-Layer Cross-Lineage**: Full traceability from top-level corporate growth targets (`Double Active Customer Base`) down through capabilities, processes, containerized services, and AWS Kubernetes infrastructure.
* **Autonomous AI Agent Fleet**: Models autonomous and semi-autonomous AI agents (e.g., `NeoHelp Onboarding Chatbot`, `AI Fraud Investigation Detective`) with AI governance attributes (model specification, autonomy level, and human-in-the-loop flags).
* **Security Architecture & STRIDE Modeling**: Features security trust boundaries (Public Internet vs. PCI Secure Enclave), threat identification (DDoS, Credential Stuffing), vulnerability assessment (CVSS scoring), and mitigations (Cloudflare WAF, PAN tokenization vaults).
* **Regulatory Compliance Matrix**: Maps systems and data stores directly to compliance standards (PCI DSS v4.0, SOX 404) with audit status tracking (`Compliant`, `Exempt`, `Non-Compliant`).
* **Instant Payments & Data Flows**: Documents event-driven transaction flows across Kafka topics, gRPC services, and transactional ledgers.

#### Pre-Configured Views

| View Name | Type | Description |
| :--- | :--- | :--- |
| **`cross_layer_lineage`** | `landscape` | Strategic end-to-end traceability from executive growth goals to EKS infrastructure. |
| **`customer_onboarding_context`** | `landscape` | Interactive customer journey across digital channels and core deposit services. |
| **`capability_map_view`** | `capability_map` | L1 through L3 hierarchical business capability map with maturity and fit ratings. |
| **`threat_model_view`** | `threat_model` | STRIDE threat model mapping threats, vulnerabilities, and security controls across trust zones. |
| **`compliance_matrix_view`** | `compliance_matrix` | Regulatory standard compliance coverage across platforms and data assets. |
| **`data_flow_view`** | `data_flow` | Customer KYC and transaction ledger lifecycle across processing stages. |
| **`customer_onboarding_value_stream`** | `value_stream` | Onboarding stage pipeline mapped to supporting capabilities and applications. |
| **`integration_view`** | `landscape` | Topology of APIs, gRPC streams, and Kafka topics linking systems and AI agents. |
| **`technology_footprint`** | `landscape` | Cloud hosting matrix across AWS production environments and on-premise mainframes. |

---

## 🗂 Repository Structure

```text
scapius-examples/
├── Neobank/
│   ├── main.ea                               # Workspace entrypoint, styling, and view definitions
│   ├── strategy/
│   │   └── goals_kpis.ea                     # Strategic goals, KPIs, and metric influences
│   ├── business/
│   │   ├── capabilities.ea                   # Multi-tier business capability taxonomy & maturity scores
│   │   ├── value_streams.ea                  # Value streams and stage realizations
│   │   └── actors_processes.ea               # Business actors and automated business processes
│   ├── application/
│   │   ├── customer_onboarding.ea            # Digital onboarding applications, systems, and channels
│   │   ├── payment_systems.ea                # Payment hub, instant payment rails, and AML monitors
│   │   ├── data_objects.ea                   # Core ledger data entities, PII, and security classification
│   │   └── ai_agents.ea                      # AI agent fleet definitions, LLM models, and AI governance
│   ├── technology/
│   │   └── environments.ea                   # Cloud (AWS EKS) and on-premises hosting infrastructure
│   ├── security/
│   │   └── security_architecture.ea          # Trust boundaries, controls, threats, and vulnerabilities
│   ├── governance/
│   │   └── policies.ea                       # PCI DSS, SOX standards, and compliance governance links
│   └── layouts/                              # Visual layout arrangements and viewport coordinates (.json)
├── LICENSE                                   # Apache 2.0 license
└── README.md                                 # Repository documentation
```

---

## 🚀 Getting Started

### Using with Scapius EA

1. **Clone the repository:**
   ```bash
   git clone https://github.com/scapius-ea/scapius-examples.git
   cd scapius-examples
   ```

2. **Open in Scapius EA:**
   * Launch **Scapius EA**.
   * Open the `Neobank/` folder or select `Neobank/main.ea` as the workspace entrypoint.
   * Explore the interactive diagrams, capability heatmaps, and lineage views via the view selector.

3. **Syntax Sample:**
   Scapius EA models are written in human-readable, declarative `.ea` code:

   ```ea
   workspace neo_bank "Neo Bank Enterprise Architecture" {
       views {
           landscape customer_onboarding_context "Customer Onboarding Context" {
               include customer
               include app_mobile_banking
               include system_core_banking
               auto_layout TopToBottom
           }
       }
   }
   ```

---

## 📄 License

This repository is licensed under the [Apache License 2.0](LICENSE).
