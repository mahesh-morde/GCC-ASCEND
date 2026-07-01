# Ascendo-OS — Agentic Governance Operating System
> **Trust Before Execution**

Ascendo-OS is a production-grade enterprise governance platform built for **GCC ASCEND (The Global Capability Innovation Hackathon)**. It serves as an Agentic Governance Operating System that coordinates, validates, and audits collaboration across hundreds of autonomous AI agents using cryptographic consensus, Zero-Knowledge verification, and strict human delegation guardrails.

---

## Architecture & Tracks

### 1. Enterprise Command Center (Governance Workspace)
* **Purpose:** Orchestrates task pipelines and handles secure operations across 10 specialized enterprise AI nodes.
* **Flows:**
  * Interactive Kanban dashboard mapping operations from `Queue` through `Active Consensus` to `Ledger Committed`.
  * **Human-in-the-Loop (HITL)** approval gateway for high-risk operations requiring manual supervisor keys.
  * Real-time ledger logging rendering cryptographic consensus actions.

### 2. Immutable Ledger & Agent Registry
* **Purpose:** Enforces authority bounds and registers peer credentials.
* **Flows:**
  * **Immutable Agent Governance Ledger (AGL):** Audits and archives inter-agent consensus handshakes.
  * **Proof-of-Authority (PoA):** Requires Ed25519-like credentials and signatures from verifying nodes before executing tasks.
  * **Zero-Knowledge Proofs (ZKP):** Validates policy checks without exposing private agent payload fields.
  * **Verified Agent Registry:** Displays identity keys, system health, and capabilities for all 10 core agents.

### 3. Trust Dashboard (Circuit Breaker Center)
* **Purpose:** Tracks behavioral heartbeats and handles threat quarantine.
* **Flows:**
  * **Live Sparkline Telemetry:** Plots real-time request entropy and anomaly threat indices using math-computed SVG paths.
  * **Vulnerability Testing Matrix:** Simulates active privilege escalations, identity spoofing, and out-of-bound operations against AI nodes.
  * **System Circuit Breaker:** Instantly isolates anomalous agents (Quarantine) and rolls back pending ledger proposals to protect critical infrastructure.

---

## Technical Stack
* **Core:** Angular 17.3+ (configured with standalone components, lazy-loaded modules, and child router-outlets)
* **Design System:** Custom CSS glassmorphism styling styled for deep enterprise aesthetics (Azure/Palantir look) with 3 persistent corporate color themes (Neon Tech, Amber Gold, and Crystal Light)
* **Reactive Core:** Event-driven state streams driven via RxJS Observables (`SimulationService`, `SecurityService`)
* **Graphics:** Native SVG render path calculations for high-performance sparkline graphs

---

## File Architecture
* `src/app/services/simulation.service.ts`: Swarm agent registry, task dispatch pipelines, PoA handshake generators, and audit log streams.
* `src/app/services/security.service.ts`: Real-time telemetry heartbeat metrics generation, quarantine/mitigation state, and incident history ledger.
* `src/app/components/theme-toggle/`: Application layout wrapper providing structural layout, theme switching hooks, visual header area, navigation, and sidebar trust score meters.
* `src/app/components/awos/`: Command Center view for dispatching requests, tracking Kanban states, approving high-risk actions, and reading detailed logs.
* `src/app/components/governance/`: Ledger table for inspecting handshakes, verifying cryptographic signature tokens, and searching agent identity authority credentials.
* `src/app/components/sentinel/`: Trust Dashboard room displaying digital threat indicators, real-time SVG charting canvas, cyber exploits matrix, and global security mitigator tools.

---

## Running the Application Locally

### Prerequisite
Ensure you have Node.js (version 18 or 20) and the Angular CLI installed on your machine.

### Installation
Clone the project, navigate to the `ascendo-os` folder, and run:
```bash
npm install
```

### Run Dev Server
Launch the development server:
```bash
npm run start
```
Navigate your browser to `http://localhost:4200/`.

### Production Build
To bundle the project assets for deployment:
```bash
npm run build
```
Build files will be generated in `dist/ascendo-os`.

---

## Interactive Walkthrough: How to Verify Features

1. **Verify Command Center & HITL Delegation:**
   - Head to the **Command Center** from the sidebar. You will see default tasks running.
   - Fill out the **Dispatch Governance Request** form. Choose *High Risk* as the Risk Audit Tier.
   - Click **Dispatch Operation**. You will see the new task appear under the *Queue Workspace* column, transition to *Active Consensus*, and halt under the *HITL Delegation* column.
   - Click on the task card to see the logs: *"Risk is HIGH: routed to Human-In-The-Loop supervisor."*
   - Click **Approve** on the task card. The task transitions to *Ledger Committed* after securing PoA peer signatures.

2. **Verify Agent Registry & Consensus Ledger:**
   - Click **Agent Registry** in the sidebar.
   - The ledger logs every handshake step that takes place. Click on any row to expand.
   - The **Zero-Knowledge Proof Audit** drawer shows the cryptographic tokens collected from validator nodes (e.g. `SIG_POA_SECURITY_AGENT_...`). Click any signature hash to copy it.
   - The **Verified Agent Registry** displays each agent's custom **VC Authority Key** (e.g. `KP_ED25519_GCC_...`) and capabilities list.

3. **Verify Trust Dashboard & Circuit Breaker:**
   - Navigate to **Trust Dashboard** in the sidebar.
   - The **Behavioral Heartbeat Monitoring** canvas plots live Entropy and Anomaly Index values. You can change the monitored agent from the dropdown.
   - Under the **Policy Violation & Threat Testing Matrix**, select a target node and an exploit payload (e.g. `Identity Spoofing`).
   - Click **Inject Exploit**.
   - **Observe TrustOS reactions:**
     - The top header activates a flashing red alarm alert.
     - The global Mesh Trust Score on the sidebar drops from 99% to 32%.
     - The Anomaly Index gauge for the targeted agent spikes, and the chart starts plotting red threat peaks.
     - The agent is marked *Offline/Quarantined* in the registry.
     - The Security Logs register a critical quarantine event.
     - Head back to **Command Center**. Any active task assigned to the quarantined agent is blocked with logs stating: `[BLOCKED] Task execution suspended. Agent is quarantined.`
   - Click **Reset Swarm / Reset Circuit Breaker** (either in the header banner or Sentinel panel).
   - System stats return to normal; the agent is restored, and all blocked workflows resume execution.
