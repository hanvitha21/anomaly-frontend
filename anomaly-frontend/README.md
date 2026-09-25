# ANOMALY - Scientific Investigation Workspace (Frontend UI)

Real-time state-driven Mission Control dashboard built for the ANOMALY multi-agent scientific reasoning system.

## Architecture
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (Dark Mode Mission Control Palette)
- **Icons:** Lucide React

## Key Capabilities
- **ThreadPool Parallel Visualizer:** Visualizes concurrent execution of **Evidence Agent** and **Numerical Anomaly Engine** before converging into **Anomaly Agent**.
- **Sequential Falsification Stream:** Displays downstream reasoning across **Hypothesis Agent**, **Critic Agent**, and **Scientific Testing**.
- **Epistemic Gaps & Uncertainty Register:** Prominently tracks Missing Data, Unverified Assumptions, and Identified Contradictions without vague confidence scores.
- **Human Approval Gate:** Two-phase authorization gate for critical diagnostic tasks.

## Local Setup
```bash
npm install
npm run dev
```
