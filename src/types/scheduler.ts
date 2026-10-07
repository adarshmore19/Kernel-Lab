export type AlgorithmType =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'RR'
  | 'PRIORITY_NP'
  | 'PRIORITY_P';

export interface Process {
  id: string;
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // lower number = higher priority (standard UNIX/POSIX or standard textbook)
  color: string;
}

export interface GanttBlock {
  id: string;
  processId: string | null; // null represents CPU Idle
  processName: string;
  startTime: number;
  endTime: number;
  isIdle: boolean;
  color?: string;
}

export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export interface TimeSliceRecord {
  time: number;
  runningProcessId: string | null;
  readyQueue: string[]; // process IDs
  newQueue: string[];
  terminatedQueue: string[];
  actionDescription: string;
}

export interface ProcessMetric {
  processId: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number; // TAT = CT - AT
  waitingTime: number;    // WT = TAT - BT
  responseTime: number;   // RT = FirstStartTime - AT
}

export interface SimulationMetrics {
  processMetrics: ProcessMetric[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number; // percentage (0 - 100)
  throughput: number;     // processes per unit time
  totalTime: number;
  idleTime: number;
  contextSwitches: number;
}

export interface SchedulingResult {
  algorithm: AlgorithmType;
  algorithmName: string;
  timeQuantum?: number;
  ganttChart: GanttBlock[];
  timeline: TimeSliceRecord[];
  metrics: SimulationMetrics;
  educationalNotes: string[];
}

export interface SchedulerAlgorithm {
  id: AlgorithmType;
  name: string;
  shortDescription: string;
  isPreemptive: boolean;
  requiresQuantum: boolean;
  schedule: (processes: Process[], quantum?: number) => SchedulingResult;
}
