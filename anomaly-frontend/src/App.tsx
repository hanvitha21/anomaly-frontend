import { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, XCircle, Terminal, 
  ShieldCheck, ArrowRight, Activity, Database, 
  FlaskConical, GitBranch, Play, RefreshCw,
  HelpCircle, AlertTriangle, ShieldAlert, Binary, Clock
} from 'lucide-react';

// 1. Types defined directly inside this file (eliminates import errors)
type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETE' | 'ERROR';

interface AgentExecutionState {
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  summary?: string;
  error?: string;
}

interface ParallelBranchState {
  evidenceAgent: AgentExecutionState;
  numericalEngine: AgentExecutionState;
}

interface SequentialAgentsState {
  anomalyAgent: AgentExecutionState;
  hypothesisAgent: AgentExecutionState;
  criticAgent: AgentExecutionState;
  scientificTesting: AgentExecutionState;
  finalInterpretation: AgentExecutionState;
}

interface PipelineExecutionState {
  investigationId: string;
  researchQuestion: string;
  timestamp: string;
  parallelBranches: ParallelBranchState;
  sequentialAgents: SequentialAgentsState;
}

// 2. Integration Config (Backend address)
const BACKEND_API_URL = "http://localhost:8000/api/investigation/state";

export default function App() {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);

  // Exact Agent Execution States for Parallel & Sequential Execution
  const [pipeline, setPipeline] = useState<PipelineExecutionState>({
    investigationId: "INV-2026-PIONEER",
    researchQuestion: "Unmodelled sunward acceleration in Pioneer 10/11 telemetry",
    timestamp: "17:42:00 UTC",
    parallelBranches: {
      evidenceAgent: { status: 'COMPLETE', summary: 'Ingested 44,200 Doppler records & Planetary Ephemeris DE-405' },
      numericalEngine: { status: 'COMPLETE', summary: 'Calculated baseline drift: residual delta = 8.74 × 10⁻¹⁰ m/s²' }
    },
    sequentialAgents: {
      anomalyAgent: { status: 'COMPLETE', summary: 'Anomaly detected and isolated with 6.57 sigma significance' },
      hypothesisAgent: { status: 'COMPLETE', summary: 'Synthesized 3 competing hypotheses (MOND, Thermal, Venting)' },
      criticAgent: { status: 'COMPLETE', summary: 'Falsified H1 (MOND) via planetary orbit constraints' },
      scientificTesting: { status: 'RUNNING', summary: 'Finite Element thermal recoil model running (91% convergence)' },
      finalInterpretation: { status: 'WAITING', summary: 'Awaiting completion of active diagnostic test' }
    }
  });

  // Optional: Connect to local Python backend if available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(BACKEND_API_URL);
        if (res.ok) {
          const data: PipelineExecutionState = await res.json();
          setPipeline(data);
        }
      } catch {
        // Backend not mounted yet - UI operates smoothly on local simulation
      }
    };

    const interval = setInterval(checkBackend, 3000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Event Simulator (Executes Parallel -> Convergence -> Sequential)
  const triggerParallelPipeline = () => {
    setIsSimulating(true);

    // 1. Reset: Input Ready, Branches start simultaneously in ThreadPoolExecutor
    setPipeline(prev => ({
      ...prev,
      parallelBranches: {
        evidenceAgent: { status: 'RUNNING', summary: 'Querying DSN Goldstone archives and JPL telemetry...' },
        numericalEngine: { status: 'RUNNING', summary: 'ThreadPoolExecutor: computing least-squares acceleration fit...' }
      },
      sequentialAgents: {
        anomalyAgent: { status: 'WAITING' },
        hypothesisAgent: { status: 'WAITING' },
        criticAgent: { status: 'WAITING' },
        scientificTesting: { status: 'WAITING' },
        finalInterpretation: { status: 'WAITING' }
      }
    }));

    // 2. Parallel Finish (Both complete independently before convergence)
    setTimeout(() => {
      setPipeline(prev => ({
        ...prev,
        parallelBranches: {
          evidenceAgent: { status: 'COMPLETE', summary: 'Parsed 44,200 telemetry packets and DE-405 ephemeris.' },
          numericalEngine: { status: 'COMPLETE', summary: 'Calculated residual drift: (8.74 ± 1.33) × 10⁻¹⁰ m/s².' }
        },
        sequentialAgents: {
          ...prev.sequentialAgents,
          anomalyAgent: { status: 'RUNNING', summary: 'Converging parallel streams: evaluating statistical anomaly...' }
        }
      }));
    }, 1800);

    // 3. Downstream Sequential Transition (Anomaly -> Hypotheses)
    setTimeout(() => {
      setPipeline(prev => ({
        ...prev,
        sequentialAgents: {
          ...prev.sequentialAgents,
          anomalyAgent: { status: 'COMPLETE', summary: 'Anomaly isolated at 6.57 sigma significance.' },
          hypothesisAgent: { status: 'RUNNING', summary: 'Generating competing mechanisms (MOND, Thermal, Venting)...' }
        }
      }));
    }, 3200);

    // 4. Critic Agent Activated
    setTimeout(() => {
      setPipeline(prev => ({
        ...prev,
        sequentialAgents: {
          ...prev.sequentialAgents,
          hypothesisAgent: { status: 'COMPLETE', summary: 'Constructed H1, H2, and H3.' },
          criticAgent: { status: 'RUNNING', summary: 'Testing H1 against planetary perturbation constraints...' }
        }
      }));
    }, 4500);

    // 5. Scientific Testing Activated
    setTimeout(() => {
      setPipeline(prev => ({
        ...prev,
        sequentialAgents: {
          ...prev.sequentialAgents,
          criticAgent: { status: 'COMPLETE', summary: 'Critic refuted H1 (MOND). H2 & H3 viable.' },
          scientificTesting: { status: 'RUNNING', summary: 'Executing 3D Finite Element thermal recoil simulator...' }
        }
      }));
      setIsSimulating(false);
    }, 6000);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/80 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span> RUNNING
          </span>
        );
      case 'COMPLETE':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold">
            <CheckCircle2 size={11} /> COMPLETE
          </span>
        );
      case 'ERROR':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-red-950 text-red-400 border border-red-800/80 px-2 py-0.5 rounded font-mono font-bold">
            <XCircle size={11} /> ERROR
          </span>
        );
      case 'WAITING':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded font-mono">
            <Clock size={11} /> WAITING
          </span>
        );
    }
  };

  // Static Data
  const hypotheses = [
    {
      id: "H1",
      title: "Modified Gravitational Dynamics (MOND / Dark Matter)",
      status: "REFUTED",
      agentNote: "Critic Agent: Contradicts planetary ephemeris constraints (DE-405)",
      supporting: ["Sunward vector constancy across 20-70 AU"],
      contradictory: ["No perturbation observed in Saturn/Uranus telemetry"],
      assumption: "Gravitational acceleration scales non-linearly below a_0"
    },
    {
      id: "H2",
      title: "Thermal Recoil Force (RTG Waste Heat Asymmetry)",
      status: "TESTING",
      agentNote: "Scientific Testing: Finite element thermal model convergence at 91%",
      supporting: ["Electrical power degradation correlates with acceleration decay slope"],
      contradictory: [],
      assumption: "Louver degradation is forward-biased"
    },
    {
      id: "H3",
      title: "Propellant / Gas Line Micro-Leakage",
      status: "PROVISIONAL",
      agentNote: "Awaiting spin-rate decay differential test",
      supporting: ["Post-maneuver thruster valve seating telemetry"],
      contradictory: ["Spin-rate decay does not correlate with asymmetric exhaust"],
      assumption: "Gas vents symmetrically through opposing nozzles"
    }
  ];

  const uncertainty = {
    missingVariables: [
      "RTG rear fin thermal dissipation curve (1974-1980)",
      "High-gain antenna paint darkening coefficient"
    ],
    unverifiedAssumptions: [
      "Heat reflection off dish back is completely diffuse Lambertian",
      "No micrometeorite perforation altered antenna cross-section"
    ],
    contradictions: [
      "Doppler residual vs. Optical position alignment divergence (1998)"
    ]
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      
      {/* 1. STICKY TOP COMMAND BAR */}
      <header className="sticky top-0 z-50 h-14 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-zinc-100 uppercase tracking-widest bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded">
            <Terminal size={14} className="text-emerald-400" /> ANOMALY
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">
            <strong className="text-zinc-500 uppercase mr-1">RQ:</strong> 
            {pipeline.researchQuestion}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerParallelPipeline}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              isSimulating ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {isSimulating ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
            {isSimulating ? 'EXECUTING PARALLEL RUN...' : 'TRIGGER THREADPOOL PIPELINE'}
          </button>
        </div>
      </header>

      {/* 2. 5-SECOND ARCHITECTURE VISUALIZATION (PARALLEL FORK & JOIN) */}
      <section className="border-b border-zinc-800 bg-zinc-900/40 px-6 py-4 font-mono">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3 text-[11px] text-zinc-500">
            <span className="uppercase font-bold tracking-wider text-zinc-400">
              Agent Execution Architecture (ThreadPoolExecutor Parallelism)
            </span>
            <span>PARALLEL BRANCHES CONVERGE AT ANOMALY AGENT</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col items-center">
            
            {/* Input Node */}
            <div className="px-3 py-1 rounded border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-200">
              User Input / Research Context
            </div>

            {/* Fork Arrow */}
            <div className="text-zinc-600 text-xs my-1 font-mono">
              ┌───────────────────┴───────────────────┐
            </div>

            {/* Parallel Branches Container */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
              
              {/* Branch 1: Evidence Agent */}
              <div className={`p-3 rounded border transition-colors ${
                pipeline.parallelBranches.evidenceAgent.status === 'RUNNING'
                  ? 'border-cyan-500/60 bg-cyan-950/20'
                  : pipeline.parallelBranches.evidenceAgent.status === 'COMPLETE'
                  ? 'border-zinc-700 bg-zinc-900/40'
                  : 'border-zinc-800 bg-zinc-950 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 font-bold text-xs text-zinc-200">
                    <Database size={13} className="text-cyan-400" /> Evidence Agent
                  </span>
                  {renderStatusBadge(pipeline.parallelBranches.evidenceAgent.status)}
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {pipeline.parallelBranches.evidenceAgent.summary || "Extracts telemetry, observation records, and literature."}
                </p>
              </div>

              {/* Branch 2: Numerical Anomaly Engine */}
              <div className={`p-3 rounded border transition-colors ${
                pipeline.parallelBranches.numericalEngine.status === 'RUNNING'
                  ? 'border-cyan-500/60 bg-cyan-950/20'
                  : pipeline.parallelBranches.numericalEngine.status === 'COMPLETE'
                  ? 'border-zinc-700 bg-zinc-900/40'
                  : 'border-zinc-800 bg-zinc-950 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 font-bold text-xs text-zinc-200">
                    <Binary size={13} className="text-purple-400" /> Numerical Anomaly Engine
                  </span>
                  {renderStatusBadge(pipeline.parallelBranches.numericalEngine.status)}
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {pipeline.parallelBranches.numericalEngine.summary || "Runs deterministic math, orbital fits, and residual drift calculations."}
                </p>
              </div>
            </div>

            {/* Join / Convergence Arrow */}
            <div className="text-zinc-600 text-xs my-1 font-mono">
              └───────────────────┬───────────────────┘
            </div>

            {/* Downstream Sequential Pipeline */}
            <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
              
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="font-semibold text-zinc-200">Anomaly Agent</span>
                {renderStatusBadge(pipeline.sequentialAgents.anomalyAgent.status)}
              </div>

              <span className="text-zinc-600 text-xs">→</span>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="font-semibold text-zinc-200">Hypothesis Agent</span>
                {renderStatusBadge(pipeline.sequentialAgents.hypothesisAgent.status)}
              </div>

              <span className="text-zinc-600 text-xs">→</span>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="font-semibold text-zinc-200">Critic Agent</span>
                {renderStatusBadge(pipeline.sequentialAgents.criticAgent.status)}
              </div>

              <span className="text-zinc-600 text-xs">→</span>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="font-semibold text-zinc-200">Scientific Testing</span>
                {renderStatusBadge(pipeline.sequentialAgents.scientificTesting.status)}
              </div>

              <span className="text-zinc-600 text-xs">→</span>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-xs">
                <span className="font-semibold text-zinc-200">Final Result</span>
                {renderStatusBadge(pipeline.sequentialAgents.finalInterpretation.status)}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. SCROLLABLE INVESTIGATION STREAM */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        
        {/* STAGE 01: CONVERGED ANOMALY RESULT */}
        <section className="bg-amber-950/10 border border-amber-500/30 rounded-lg p-5 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/30 mb-3 text-xs">
            <span className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
              <AlertCircle size={16} /> Anomaly Agent: Converged Telemetry & Math Result
            </span>
            <span className="text-zinc-500">Synthesized from Evidence + Numerical Branches</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Constant anomalous sunward deceleration detected</h2>
              <p className="text-xs text-zinc-400 mt-1">Observed trajectory departs from Newtonian and General Relativistic models.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-500 uppercase block mb-0.5">Residual Drift Magnitude</span>
              <span className="text-amber-300 font-mono text-sm bg-amber-950/50 px-3 py-1 rounded border border-amber-800/50 font-bold">
                (8.74 ± 1.33) × 10⁻¹⁰ m/s²
              </span>
            </div>
          </div>
        </section>

        {/* STAGE 02: COMPETING HYPOTHESES */}
        <section className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800">
            <span className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider">
              <GitBranch size={15} className="text-purple-400" /> Hypothesis Agent & Critic Agent Evaluations
            </span>
            <span className="text-zinc-500">Sequential Falsification Phase</span>
          </div>

          <div className="space-y-3">
            {hypotheses.map(h => (
              <div 
                key={h.id} 
                className={`p-4 rounded-lg border text-xs transition-colors ${
                  h.status === 'REFUTED' 
                    ? 'border-red-900/30 bg-red-950/5' 
                    : h.status === 'TESTING'
                    ? 'border-cyan-500/40 bg-cyan-950/10'
                    : 'border-zinc-800 bg-zinc-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-zinc-100 text-sm">{h.id}</span>
                    <h3 className="text-sm font-sans font-semibold text-zinc-100">{h.title}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${
                    h.status === 'REFUTED' ? 'bg-red-950 text-red-400 border border-red-800/60' :
                    h.status === 'TESTING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 animate-pulse' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {h.status}
                  </span>
                </div>

                <div className="text-[11px] bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded text-zinc-400 mb-3">
                  <strong className="text-zinc-500 uppercase mr-1">Critic Agent Telemetry:</strong> {h.agentNote}
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Supporting Evidence</span>
                    {h.supporting.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-zinc-300">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">Contradictory Evidence</span>
                    {h.contradictory.length ? h.contradictory.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-red-300/80">
                        <XCircle size={12} className="text-red-500 shrink-0" />
                        <span>{e}</span>
                      </div>
                    )) : <span className="text-zinc-600 text-[10px]">None observed</span>}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[11px] text-purple-300/80">
                  <span className="text-purple-400 uppercase font-bold mr-1">Active Assumption:</span> {h.assumption}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STAGE 03: SCIENTIFIC TESTING & HUMAN APPROVAL */}
        <section className="grid grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <span className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider">
                <FlaskConical size={14} className="text-cyan-400" /> Scientific Testing Execution
              </span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/70 px-2 py-0.5 rounded text-[10px] font-bold">
                SUPPORTS H2
              </span>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Selected Tool</span>
                <span className="text-zinc-200 font-bold">Finite Element Thermal Recoil Simulator (v2.4)</span>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-zinc-400">RTG Output:</span><span className="text-zinc-200">2.1 kW thermal</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Antenna Emissivity:</span><span className="text-zinc-200">0.82</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Geometry Mesh:</span><span className="text-zinc-200">pioneer_bus_v3.obj</span></div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Test Outcome</span>
                <p className="text-[11px] text-zinc-300">Sunward recoil force accounts for (8.1 ± 1.1) × 10⁻¹⁰ m/s²</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col justify-between ${
            approved ? 'border-emerald-600 bg-emerald-950/20' : 'border-cyan-500/40 bg-cyan-950/15'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  approved ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {approved ? <ShieldCheck size={14} /> : <Activity size={14} />}
                  {approved ? 'Human Approved' : 'Interpretation / Final Recommendation'}
                </span>
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                  Gain: HIGH
                </span>
              </div>
              <p className="text-xs text-zinc-200 mt-2 leading-relaxed">
                Run 3D radiative Monte Carlo model on RTG rear-facing louvers to confirm directional thermal exhaust vector.
              </p>
            </div>

            <button
              onClick={() => setApproved(!approved)}
              className={`w-full py-2 px-3 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-4 ${
                approved
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950'
              }`}
            >
              {approved ? 'Revoke Authorization' : <><span>Authorize Experiment</span> <ArrowRight size={13} /></>}
            </button>
          </div>
        </section>

        {/* STAGE 04: UNCERTAINTY & MISSING DATA REGISTER */}
        <section className="pt-2">
          <footer className="border border-amber-900/60 bg-zinc-950 p-4 rounded-lg font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Epistemic Gaps & Uncertainty Register
              </span>
              <span className="text-zinc-500 text-[11px]">STATUS: CONVERGENCE CONSTRAINED</span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3">
              <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <HelpCircle size={14} />
                  <span>MISSING DATA ({uncertainty.missingVariables.length})</span>
                </div>
                <ul className="text-zinc-400 space-y-1 text-[11px]">
                  {uncertainty.missingVariables.map((v, i) => <li key={i} className="truncate">• {v}</li>)}
                </ul>
              </div>

              <div className="bg-purple-950/20 border border-purple-900/40 p-3 rounded">
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <AlertTriangle size={14} />
                  <span>UNVERIFIED ASSUMPTIONS ({uncertainty.unverifiedAssumptions.length})</span>
                </div>
                <ul className="text-zinc-400 space-y-1 text-[11px]">
                  {uncertainty.unverifiedAssumptions.map((a, i) => <li key={i} className="truncate">• {a}</li>)}
                </ul>
              </div>

              <div className="bg-red-950/20 border border-red-900/40 p-3 rounded">
                <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                  <ShieldAlert size={14} />
                  <span>CONTRADICTIONS IDENTIFIED ({uncertainty.contradictions.length})</span>
                </div>
                <ul className="text-zinc-400 space-y-1 text-[11px]">
                  {uncertainty.contradictions.map((c, i) => <li key={i} className="truncate text-red-300">• {c}</li>)}
                </ul>
              </div>
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
}