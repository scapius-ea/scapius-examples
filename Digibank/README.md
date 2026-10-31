# DigiBank — Reference Example for the Scapius EA Grammar

This project is a **comprehensive reference implementation** of the Scapius EA
Architecture-as-Code language. Every rule in `NexusEAGrammar.g4` is
exercised at least once, across a full retail-and-commercial digibank
architecture spanning nine lines of business, so it can be used both as the
canonical "what's possible" example for new users of the DSL and as a
fixture that gives every widget on the OSS v1 workspace home dashboard
(`workspace-dashboard-spec.yaml`) real, non-trivial data to render.

## Project layout

```
digibank/
  main.ea                                   workspace root + global style overrides
  manifest.yaml                             workspace currency, scoring weights, governance config
  default.theme                             base theme: every entity type, verb, and layer styled
  strategy/goals_kpis.ea                    Strategy Layer: goals, KPIs
  business/capabilities.ea                  Business Architecture: full capability map, L1-L3 (9 domains)
  business/actors_processes.ea              core retail banking actors, processes
  business/backoffice_actors_processes.ea   Treasury/Finance/HR actors, processes
  business/marketing_actors_processes.ea    Marketing actors, processes
  business/regulatory_actors_processes.ea   Regulatory reporting & data privacy actors, processes
  business/personal_banking_actors_processes.ea  Deposits & contact center actors, processes
  business/creditcard_actors_processes.ea   Credit card actors, processes
  business/mortgage_actors_processes.ea     Home lending / mortgage actors, processes
  business/corporate_actors_processes.ea    Corporate & commercial banking actors, processes
  business/value_streams.ea                 6 value streams spanning onboarding through corporate treasury
  application/systems_apps.ea               core banking, payments, compliance, mobile, agents, deposits
  application/backoffice_systems.ea         Finance ERP, Reconciliation, HRIS
  application/marketing_systems.ea          Marketing Cloud, Customer Data Platform, Brand CMS
  application/regulatory_systems.ea         Regulatory Reporting, Data Privacy/Consent platforms
  application/creditcard_systems.ea         Credit Card Platform: issuance, authorization, rewards, disputes
  application/mortgage_systems.ea           Mortgage Origination & Servicing Platform
  application/corporate_banking_systems.ea  Corporate & Commercial Banking Platform
  application/contact_center_systems.ea     IVR, ticketing, and knowledge base
  application/shadow_it.ea                  deliberately orphaned entities (data-quality demo)
  technology/environments.ea                environments, infrastructure, SaaS vendor enclave (incl. non-prod)
  security/security_architecture.ea         trust boundaries, controls, standards, threats,
                                             vulnerabilities, risk scenarios
  governance/policies.ea                    policies + governed_by relationships
  views/views.ea                            every view type in the grammar, incl. per-department landscapes
```

### Capability map (9 L1 domains, all reaching L3)

| L1 | L2 | L3 (sample) |
|---|---|---|
| 1.0 Retail Banking Operations | Consumer Lending, Payments & Transfers | Automated Credit Scoring, Real-Time Payments |
| 2.0 Customer Service & Ops | Digital Onboarding, Customer Support | KYC Verification, Account Provisioning, Case Management, Live Chat, **Contact Center Operations** |
| 3.0 Risk and Compliance Management | Fraud Prevention, AML, Regulatory Reporting, Data Privacy | Transaction Scoring, Fraud Investigation, Sanctions Screening, SAR, Regulatory Filings, Policy Mgmt, Consent Mgmt, Data Subject Rights |
| 4.0 Back Office Operations | Reconciliation & Settlement, Finance & GL, HR & Workforce | Nostro/Vostro Recon, Exception Mgmt, Regulatory Financial Reporting, AP/AR, Employee Onboarding, Payroll |
| 5.0 Marketing & Growth | Campaign Management, Customer Insights, Brand & Content | Digital Advertising, Lifecycle Marketing, Segmentation, Attribution, Content Mgmt, Social Media |
| **6.0 Personal Banking & Deposits** | Deposit Account Management, Personal Banking Advisory | Checking/Savings Servicing, Account Statements, Financial Wellness, Relationship Banking |
| **7.0 Credit Card Services** | Card Issuance & Lifecycle, Card Transaction & Servicing | Card Application Processing, Card Provisioning, Authorization & Settlement, Disputes, Rewards & Loyalty |
| **8.0 Home Lending & Mortgage** | Mortgage Origination, Mortgage Servicing | Loan Application Intake, Underwriting & Appraisal, Escrow Payment Processing, Loan Modification |
| **9.0 Corporate & Commercial Banking** | Business Account Services, Commercial Lending & Trade Finance | Business Account Onboarding (KYB), Cash Management & Treasury, Commercial Underwriting, Trade Finance |

Every leaf capability is realized by at least one process or app, so the
capability map isn't just decorative — it traces all the way down to the
systems that actually deliver each capability, across every line of
business (retail deposits, credit cards, mortgages, corporate/commercial
banking, and the shared risk/compliance/back-office/marketing functions
that support them).

Only `main.ea` contains a `workspace { }` block. Every other `.ea` file is a
**workspace fragment** — a bare sequence of statements — that the tooling
merges into the single DigiBank workspace. `default.theme` is a standalone
`theme { }` document, referenced from `main.ea` via `theme "default.theme"`.
`manifest.yaml` is workspace-scoped configuration (currency, composite
scoring weights, governance/enum-label overrides) — never entities or
relationships.

## Grammar coverage map

| Grammar concept | Where it's demonstrated |
|---|---|
| `workspace` | `main.ea` |
| `themeDefinition` | `default.theme` |
| `workspaceFragment` | every other `.ea` file |
| `layer` (6 layers) | Strategy Layer, Business Architecture, Application Architecture, Technology Architecture, Security Architecture, Governance & Policy |
| `group` | "Customer Digital Channels", "AI Agent Fleet", "Credit Card Platform", "Mortgage Origination & Servicing", "Corporate & Commercial Banking Systems", "Contact Center Platform" (application); "Production Environments", "Non-Production Environments" (technology); "Trust Boundaries", "Security Controls", "Regulatory Standards", "Threats & Vulnerabilities" (security) |
| `system`, `app`, `component` | Core Banking, Payments, Compliance, Credit Card, Mortgage, Corporate Banking, Contact Center systems; Mobile, Ledger, Instant Pay, AML, deposit, card, mortgage, corporate apps; nested components |
| `capability` (recursive) | 9-domain, 3-level capability hierarchy, with `number "x.y"` and `number auto` |
| `actor`, `process` | 18 actors and 25 processes spanning retail, back-office, marketing, regulatory, deposits/contact-center, credit card, mortgage, and corporate banking |
| `environment`, `infrastructure` | AWS prod enclave, on-prem mainframe enclave, vendor SaaS enclave, **staging and dev sandbox non-prod environments** |
| `data_object` | Customer KYC profile, Ledger transaction, card transaction, mortgage application, corporate account, employee, marketing profile records (with `pii`/`phi`), plus two deliberately orphaned records |
| `goal`, `kpi` | 6 goals, 6 KPIs (all four `trend` values incl. `Stable`) |
| `agent` | Support chatbot, fraud review agent (`human_in_loop` true/false) |
| `policy` | Data privacy, access control, AI governance, third-party risk, cloud security baseline policies (`enforcement`: Mandatory/Recommended/Advisory) |
| `control` | MFA, encryption-at-rest, SIEM monitoring, WAF, DLP, privileged access workstations, card tokenization (`implementation_status`: Implemented/Partially Implemented/Planned; `effectiveness`: High/Medium/Low) |
| `threat` | 6 threats, one per STRIDE `category` (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Privilege Escalation), each with `mitigation_status` (Open/Mitigated/Accepted) |
| `riskScenario` | 4 risk scenarios spanning all four `treatment` values used in this model (Mitigate, Accept, Transfer) with distinct inherent/residual ratings |
| `vulnerability` (`cvss_score`, `cve_id`) | 6 vulnerabilities spanning all four CVSS severity bands (Low/Medium/High/Critical) |
| `standard` | PCI-DSS, ISO 27001, SOX, and an Internal secure-coding standard (4 distinct `standard_type` values) |
| `trustBoundary` + `encloses` | Public internet zone, internal corp network, PCI secure enclave (now also enclosing the credit card platform) |
| `relationship` (top-level) | throughout — all 16 relationship verbs used at least once |
| `relationshipBlock` (`relationships { this ... }`) | inside `procOnboarding`, `appLedgerService`, `procCardAuthorization`, `procMortgageUnderwriting`, threats, trust boundaries, and value stream stages |
| `cardinality` | `OneToOne`, `OneToMany`, `ManyToMany` all used |
| `lifecycle` (`Plan`/`Build`/`Run`/`Retire`) | all 4 phases across systems and applications (`app_ledger_service`, `app_deposit_accounts`, `app_instant_pay`, `app_mobile_banking`, `app_card_issuance`, `app_card_authorization`, `app_mortgage_origination`, `app_underwriting_engine`, `system_core_banking`, `system_core_banking_cloud`) |
| `score` | on systems, apps, and capabilities across every major line of business |
| `numberProperty` | explicit (`number "1.0"`) and `number auto` in capabilities |
| `time` (TIME model) | `Tolerate`, `Invest`, `Migrate`, `Eliminate` all used across systems and infrastructure |
| `cost` (both forms) | shorthand form (`cost 1200000 year`) used throughout; currency resolved once, workspace-wide, from `manifest.yaml` |
| `value_stream` / `stage` | 6 value streams (onboarding, lending, fraud resolution, card issuance, mortgage origination, corporate onboarding), each with 3 ordered stages |
| Security/privacy props | `internet_facing`, `pii`, `phi`, `is_external`, `human_in_loop` |
| `views` — all 13 view types | `landscape` (incl. one per new department), `container`, `integration`, `dashboard`, `capability_map`, `threat_model`, `risk_heatmap`, `compliance_matrix`, `data_flow`, `attack_surface`, `value_stream_map`, `lifecycle_roadmap`, `portfolio_matrix` |
| `include` / `include_layer` / `exclude` / `exclude_layer` / `auto_layout` | all used, including both `TopToBottom` and `LeftToRight` |
| `stylesBlock` / `styleRule` / `condition` (`where`) | `main.ea` — type selectors, `*` wildcard with conditions, and an identifier-targeted selector |
| `shapeProperty`, `cssProperty`, `cssClassProperty`, `customCssProperty` | `default.theme` and `main.ea` |
| `attribute` (`attr`) with all 3 `attributeValue` types and namespace prefixes | string attrs everywhere; bool via `is_production true`; numeric via component/infra attrs; namespaced attrs (`attr aws:region "..."`, `attr aws:network:subnet "..."`) on `systemFinanceERP` |

## The narrative

DigiBank runs a legacy mainframe-based core (`systemCoreBanking`, TIME =
**Migrate**) alongside a modern payments and AI stack, and is mid-flight on
a multi-year modernization programme (`migrates_to systemCoreBankingCloud`,
`envOnPremMainframe migrates_to envAwsProd`, with a **staging** environment
rehearsing the cutover) — while operating nine lines of business end to
end: retail deposits, consumer lending, real-time payments, **credit
cards**, **home lending/mortgage**, **corporate & commercial banking**, AML
and regulatory compliance, back-office operations, and marketing — all
wrapped in a full security and governance layer (trust boundaries,
controls, threats, vulnerabilities, risk scenarios, standards, and
policies). A small amount of deliberate mess — an unsanctioned "shadow IT"
integration with a critical hardcoded-credential vulnerability, sitting
outside any governed layer — gives the data-quality-oriented dashboard
widgets something real to catch, rather than a uniformly tidy estate.

## Dashboard metric coverage

Every widget in the OSS v1 workspace home dashboard
(`workspace-dashboard-spec.yaml`) has real data behind it in this model,
specifically:

- **Portfolio & Value** — `score{}` blocks on a spread of systems, apps,
  and capabilities across every line of business; `cost` on nearly every
  system/agent/control, resolved against the single workspace `currency`
  in `manifest.yaml`.
- **Risk & Security Posture** — threats covering all 6 STRIDE categories
  and all 3 `mitigation_status` values; vulnerabilities spanning all 4
  CVSS bands; risk scenarios spanning `Mitigate`/`Accept`/`Transfer`
  treatments; `pii`/`phi`/`internet_facing` flags set to both `true` and
  `false` in multiple places.
- **Compliance & Governance** — `compliance` tags across a dozen+
  frameworks; controls spanning all three `implementation_status` values
  and `effectiveness` from Low to High; policies spanning
  `Mandatory`/`Recommended`/`Advisory` enforcement.
- **AI Governance** — 2 agents with different `autonomy_level` and both
  `human_in_loop` values.
- **Environment & Infrastructure** — 5 environments spanning
  `Production`/`Staging`/`Development`/`SaaS` `env_type`, 3 distinct
  `provider` values, and both `is_production` values.
- **Relationship Health** — a rich relationship graph for the
  most-connected ranking; `depends_on` edges that explicitly cross
  Business→Application, Application→Technology, and Security→Technology
  layer boundaries; and two deliberately orphaned entities
  (`application/shadow_it.ea`) for the orphan-entity data-quality widget.

## Validation performed

Since a live parser wasn't available in this environment, the files were
validated with a quote-and-comment-aware structural checker (correctly
treating `//` inside string literals like `"git://...`" as data, not a
comment, matching the grammar's `QuotedString`-has-priority lexing) that
confirmed:
- every `{`/`}` and `"`/`"` pair balances in every file,
- all entity identifiers are defined exactly once, and every identifier
  referenced in a relationship, `encloses`, or view `include` resolves to
  one of them — zero dangling references,
- every one of the 22 relationship verbs is used at least once,
- every one of the 13 view types is used at least once,
- `cardinality`, `phase`, and `time` values are all drawn from their valid
  keyword sets.

You should still run this through the real ANTLR-generated parser as a
final check before treating it as a shipped reference artifact.
