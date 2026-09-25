export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETE' | 'ERROR';

export interface AgentExecutionState {
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  summary?: string;
  error?: string;
}

export interface ParallelBranchState {
  evidenceAgent: AgentExecutionState;
  numericalEngine: AgentExecutionState;
}

export interface SequentialAgentsState {
  anomalyAgent: AgentExecutionState;
  hypothesisAgent: AgentExecutionState;
  criticAgent: AgentExecutionState;
  scientificTesting: AgentExecutionState;
  finalInterpretation: AgentExecutionState;
}

export interface PipelineExecutionState {
  investigationId: string;
  researchQuestion: string;
  timestamp: string;
  parallelBranches: ParallelBranchState;
  sequentialAgents: SequentialAgentsState;
}