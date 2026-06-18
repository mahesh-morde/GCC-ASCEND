# ⚡ AscendOS — Unified GCC Security Control Plane

> **Agentic Governance (The Autonomous Enterprise) | Theme: Proof-of-Authority Consent Model**  
> **Original Solution** — Built from scratch using Angular 17/18

---

## 🔗 Quick Links

| Resource | Link |
|:---|:---|
| 🌐 **Interactive Prototype (Live)** | [ascendo-os.onrender.com](https://ascendo-os.onrender.com) |
| 📊 **Presentation (Slides)** | [mahesh-morde.github.io/GCC-ASCEND](https://mahesh-morde.github.io/GCC-ASCEND/) |
| 💻 **Source Code** | [github.com/mahesh-morde/GCC-ASCEND](https://github.com/mahesh-morde/GCC-ASCEND) |

---

## 📸 Live Dashboard Preview

![AscendOS Dashboard](ascendo-os/docs/media__1781762549659.png)

*Driver Dashboard showing: Workforce Kanban board, active task execution statuses, nodes connectivity telemetry pinger console, and simulated orchestrator logs.*

---

## 🎯 Problem Statement

> *"Build a decentralized Agent-Governance Layer (AGL) that acts as the 'Diplomatic Protocol' for a GCC’s digital workforce, shifting beyond simple API keys to a 'Proof-of-Authority' (PoA) consensus model."*

**AscendOS** solves this by unifying specialized swarm agents (Finance, HR, IT, Security) into one secure plane—incorporating ISO-like Verifiable Credentials (VCs), Zero-Knowledge Proof (ZKP) policy validation, and human-led delegation traces.

---

## 🗺️ Focus Areas & Technical Pillars

*   **Identity Verification (VCs)** — Dynamic ED25519 cryptographic public key exchanges for inter-agent authority.
*   **Chain of Command Tracking** — Lightweight audit ledger tracing all agent actions back to Human VP/CFO delegations.
*   **Policy Guardrails (ZKP)** — Cryptographic Zero-Knowledge validation rules checking limits without exposing raw variables.
*   **Rogue Agent Mitigation** — Real-time telemetry monitoring heartbeats and executing immediate **Circuit Breaker** isolations.
*   **Emergency Human Controls** — Globally revoke agent credentials across all nodes in under **0.08 seconds**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend Framework | Angular 18 (Standalone Components) |
| State Orchestration | RxJS Behaviors & Event Stream Mapping |
| Styling | SCSS + Glassmorphism + CSS Animations |
| Deployment | Render.com + Docker + NginX Server |

---

## 🚀 Run Locally

```bash
# 1. Navigate to the application folder
cd ascendo-os

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open in browser
# http://localhost:4200
```

## 🐳 Run with Docker

```bash
# 1. Navigate to the application folder
cd ascendo-os

# 2. Build the Docker container
docker build -t ascendo-os .

# 3. Run the container on port 8080
docker run -p 8080:80 ascendo-os
# http://localhost:8080
```

---

## 📁 Centralized Documentation Layout

All project documentation is centralized in the `ascendo-os/docs` directory:
*   `index.html` — Interactive Slide Deck Presentation (hostable directly via GitHub Pages).
*   `branding.md` — Visual asset guides, design palettes, and vector logo representations.
*   `implementation_plan.md` — High-level technical requirements mapping and consensus flow designs.
*   `task.md` — Implementation progress checklist.
*   `walkthrough.md` — Verification details, screenshots, and test checkpoint summaries.

---

*Built with ❤️ for Swarm Governance — ET AutoTech Hackathon 2026*
