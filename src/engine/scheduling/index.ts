import { AlgorithmType, Process, SchedulerAlgorithm, SchedulingResult } from '../../types/scheduler';
import { scheduleFCFS } from './algorithms/fcfs';
import { scheduleSJF } from './algorithms/sjf';
import { scheduleSRTF } from './algorithms/srtf';
import { scheduleRoundRobin } from './algorithms/roundRobin';
import { schedulePriorityNonPreemptive } from './algorithms/priorityNonPreemptive';
import { schedulePriorityPreemptive } from './algorithms/priorityPreemptive';

export const schedulers: Record<AlgorithmType, SchedulerAlgorithm> = {
  FCFS: {
    id: 'FCFS',
    name: 'First Come First Serve',
    shortDescription: 'Executes processes strictly in arrival order without preemption.',
    isPreemptive: false,
    requiresQuantum: false,
    schedule: (processes) => scheduleFCFS(processes),
  },
  SJF: {
    id: 'SJF',
    name: 'Shortest Job First',
    shortDescription: 'Dispatches the process with smallest CPU burst non-preemptively.',
    isPreemptive: false,
    requiresQuantum: false,
    schedule: (processes) => scheduleSJF(processes),
  },
  SRTF: {
    id: 'SRTF',
    name: 'Shortest Remaining Time First',
    shortDescription: 'Preempts running process if a new process arrives with smaller remaining burst.',
    isPreemptive: true,
    requiresQuantum: false,
    schedule: (processes) => scheduleSRTF(processes),
  },
  RR: {
    id: 'RR',
    name: 'Round Robin',
    shortDescription: 'Allocates CPU time slices (quanta) in circular FIFO ready queue.',
    isPreemptive: true,
    requiresQuantum: true,
    schedule: (processes, quantum) => scheduleRoundRobin(processes, quantum),
  },
  PRIORITY_NP: {
    id: 'PRIORITY_NP',
    name: 'Priority (Non-Preemptive)',
    shortDescription: 'Runs highest priority arrived task to completion.',
    isPreemptive: false,
    requiresQuantum: false,
    schedule: (processes) => schedulePriorityNonPreemptive(processes),
  },
  PRIORITY_P: {
    id: 'PRIORITY_P',
    name: 'Priority (Preemptive)',
    shortDescription: 'Preempts running task if a higher-priority task arrives.',
    isPreemptive: true,
    requiresQuantum: false,
    schedule: (processes) => schedulePriorityPreemptive(processes),
  },
};

export function runScheduler(
  algorithm: AlgorithmType,
  processes: Process[],
  quantum?: number
): SchedulingResult {
  const engine = schedulers[algorithm];
  if (!engine) {
    throw new Error(`Unknown scheduling algorithm: ${algorithm}`);
  }
  return engine.schedule(processes, quantum);
}
