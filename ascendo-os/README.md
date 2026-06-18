# AscendOS - Unified GCC Security Control Plane & Agent Orchestrator

AscendOS is a high-fidelity enterprise control plane built for **GCC ASCEND (The Global Capability Innovation Buildathon)**. It showcases an integrated, responsive solution spanning three critical operational tracks for the autonomous enterprise of 2026:

1. **Track 1: Augmented Workforce Operating System (AWOS)**  
   Orchestrates real-time operations, workflows, and task handoffs between human staff and autonomous AI agents. Includes a live interactive Kanban board and a **Human-in-the-Loop (HITL)** validation gateway for high-risk system processes.
2. **Track 2: Agentic Governance Layer (AGL)**  
   Secures cross-agent requests using a "Proof-of-Authority" (PoA) validation protocol. Maintains a decentralized ledger of cryptographically signed agent handshakes (e.g., Finance Node granting HR requests) and presents verifiable identity authority credentials.
3. **Track 3: The Sentinel Layer (Cyber-Resilience)**  
   Tracks agent behavioral heartbeats (Entropy, Response Latency, and Anomaly Index) in real-time using custom SVG sparklines. Includes interactive triggers to inject active cyber-threats (Prompt Injection, Signature Spoofing, AI Hallucination) and validates automated fail-secure system quarantining.

---

## Technical Stack
- **Framework:** Angular 17.3+ (configured with standalone components, lazy-loaded modules, and child router-outlets)
- **Styling:** Custom Vanilla CSS (configured with 2 custom corporate themes: **Neon Cyberpunk** and **Amber Obsidian**, featuring responsive glassmorphic cards, layout grid panels, and micro-animations)
- **State Management:** Reactive streams driven via RxJS Observables (`SimulationService`, `SecurityService`)
- **Graphics:** Direct custom Math-computed SVG rendering for live real-time sparkline telemetry

---

## File Architecture
- `src/app/services/simulation.service.ts`: Simulates the AI swarm agent status, schedules incoming tasks, coordinates PoA handshakes, and logs action statements.
- `src/app/services/security.service.ts`: Coordinates Sentinel security checks, maintains security audit tables, generates fluctuating behavioral metrics, and handles quarantined/muted nodes.
- `src/app/components/theme-toggle/`: Application layout wrapper providing structural layout, theme switching hooks, visual header area, navigation, and sidebar trust score meters.
- `src/app/components/awos/`: Workspace for dispatching custom tasks, tracking task status, approving high-risk actions, and reading detailed execution console logs.
- `src/app/components/governance/`: Ledger table for inspecting AGL handshakes, verifying cryptographic signature tokens, and searching agent identity authority credentials.
- `src/app/components/sentinel/`: Control room displaying digital threat indicators, real-time SVG charting canvas, cyber exploits matrix, and global security mitigator tools.

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

1. **Verify AWOS (Kanban & HITL):**
   - Head to the **AWOS Console** from the sidebar. You will see default tasks running.
   - Fill out the **Create Swarm Operation** form. Choose *High Risk* as the Risk Audit Tier.
   - Click **Dispatch Operation**. You will see the new task appear under the *Queued* column, transition to *In Progress*, and stop under the *Awaiting HITL* column.
   - Click on the task card to see the logs: *"Risk is HIGH. Redirected to Human-In-The-Loop approval desk."*
   - Click **Approve** on the task card. The task transitions to *Completed* after securing PoA peer signatures.

2. **Verify AGL (Consensus Ledger & Registry):**
   - Click **AGL Governance** in the sidebar.
   - The ledger logs every handshake step that takes place. Click on any row to expand.
   - The **Handshake Signature Proof** drawer shows the cryptographic tokens collected from validator nodes (e.g. `SIG_POA_SECURITY_AGENT_...`). Click any signature hash to copy it.
   - The **Verified Agent Registry** displays each agent's custom **VC Authority Key** (e.g. `KP_ED25519_GCC_...`) and capabilities list.

3. **Verify Sentinel (Real-Time Sparklines & Exploit Injection):**
   - Navigate to **Sentinel Control** in the sidebar.
   - The **Behavioral Heartbeat Monitoring** canvas plots live Entropy and Anomaly Index values. You can change the monitored agent from the dropdown.
   - Under the **Threat Testing Matrix**, select a target node (e.g. `TalentFlow (HR Agent)`) and an exploit payload (e.g. `Prompt Injection`).
   - Click **Inject Exploit**.
   - **Observe Sentinel reactions:**
     - The top header activates a flashing red alarm alert.
     - The global System Trust Score on the sidebar drops from 98% to 45%.
     - The Anomaly Index gauge for the targeted agent spikes, and the chart starts plotting red threat peaks.
     - The agent is marked *Offline/Muted* (Quarantined) in the registry.
     - The Security Logs register a critical quarantine event.
     - Head back to **AWOS Console**. Any active task assigned to the quarantined agent is blocked with logs stating: `[BLOCKED] Task execution suspended. Agent is quarantined.`
   - Click **Reset Swarm / Mitigate All & Sync** (either in the header banner or Sentinel panel).
   - System stats return to normal; the agent is restored, and all blocked workflows resume execution.
