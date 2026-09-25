export interface ScientificTest {
  id: string;
  tool: string;
  inputs: Record<string, string>;
  result: string;
  verdict: 'SUPPORTS' | 'REFUTES' | 'INCONCLUSIVE';
  targetHypothesis: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  status: 'TESTING' | 'REFUTED' | 'PROVISIONAL';
  supportingEvidence: string[];
  contradictoryEvidence: string[];
  assumptions: string[];
}

export interface StatePayload {
  researchQuestion: string;
  activePhase: string;
  anomaly: {
    title: string;
    magnitude: string;
    detectedAt: string;
  };
  hypotheses: Hypothesis[];
  activeTest: ScientificTest;
  uncertainty: {
    missingVariables: string[];
    unverifiedAssumptions: string[];
    contradictions: string[];
  };
  recommendation: {
    id: string;
    text: string;
    expectedGain: string;
    approved: boolean;
  };
}

export const activeInvestigation: StatePayload = {
  researchQuestion: "Unmodelled sunward acceleration in Pioneer 10/11 telemetry",
  activePhase: "CRITIC_FALSIFICATION",
  anomaly: {
    title: "Constant anomalous deceleration detected",
    magnitude: "(8.74 ± 1.33) × 10⁻¹⁰ m/s²",
    detectedAt: "DSN Deep Space Stations 14, 43, 63"
  },
  hypotheses: [
    {
      id: "H1",
      title: "Modified Gravitational Dynamics (MOND / Dark Matter)",
      status: "REFUTED",
      supportingEvidence: ["Sunward vector constancy across 20-70 AU"],
      contradictoryEvidence: ["Planetary ephemerides show no perturbation in Saturn/Uranus orbits"],
      assumptions: ["Gravitational acceleration scales non-linearly below a_0"]
    },
    {
      id: "H2",
      title: "Thermal Recoil Force (RTG Waste Heat Asymmetry)",
      status: "TESTING",
      supportingEvidence: ["Electrical power degradation correlates with acceleration decay slope"],
      contradictoryEvidence: [],
      assumptions: ["Louver degradation is forward-biased"]
    },
    {
      id: "H3",
      title: "Propellant / Gas Line Micro-Leakage",
      status: "PROVISIONAL",
      supportingEvidence: ["Post-maneuver thruster valve seating telemetry"],
      contradictoryEvidence: ["Spin-rate decay does not correlate with asymmetric exhaust"],
      assumptions: ["Gas vents symmetrically through opposing nozzles"]
    }
  ],
  activeTest: {
    id: "T-02",
    tool: "Finite Element Thermal Recoil Simulator (v2.4)",
    inputs: {
      "RTG Output": "2.1 kW thermal",
      "Antenna Emissivity": "0.82",
      "Geometry Mesh": "pioneer_bus_v3.obj"
    },
    result: "Calculated sunward force explains (8.1 ± 1.1) × 10⁻¹⁰ m/s²",
    verdict: "SUPPORTS",
    targetHypothesis: "H2"
  },
  uncertainty: {
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
  },
  recommendation: {
    id: "REC-01",
    text: "Run 3D radiative Monte Carlo model on RTG rear-facing louvers",
    expectedGain: "HIGH",
    approved: false
  }
};