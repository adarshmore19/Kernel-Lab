import { Process } from '../../types/scheduler';

export interface SchedulerPreset {
  id: string;
  name: string;
  description: string;
  quantum?: number;
  processes: Process[];
}

export const SCHEDULER_PRESETS: SchedulerPreset[] = [
  {
    id: 'silberschatz-classic',
    name: 'Operating System Concepts (Standard)',
    description: 'Classic 5-process scenario from Silberschatz & Galvin textbook showcasing burst and arrival variance.',
    quantum: 3,
    processes: [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 3, color: '#60a5fa' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, color: '#34d399' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 4, color: '#fbbf24' },
      { id: 'p4', pid: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2, color: '#a78bfa' },
      { id: 'p5', pid: 5, name: 'P5', arrivalTime: 4, burstTime: 2, priority: 5, color: '#f87171' },
    ],
  },
  {
    id: 'convoy-effect',
    name: 'Convoy Effect Demonstration',
    description: 'A heavy 24-unit CPU-bound process arrives at time 0, trapping short I/O-bound processes behind it in FCFS.',
    quantum: 4,
    processes: [
      { id: 'p1', pid: 1, name: 'Heavy P1', arrivalTime: 0, burstTime: 24, priority: 3, color: '#f87171' },
      { id: 'p2', pid: 2, name: 'Quick P2', arrivalTime: 1, burstTime: 3, priority: 2, color: '#60a5fa' },
      { id: 'p3', pid: 3, name: 'Quick P3', arrivalTime: 2, burstTime: 3, priority: 1, color: '#34d399' },
      { id: 'p4', pid: 4, name: 'Quick P4', arrivalTime: 3, burstTime: 2, priority: 1, color: '#fbbf24' },
    ],
  },
  {
    id: 'preemption-showdown',
    name: 'Preemption & SRTF Advantage',
    description: 'Demonstrates SRTF and Preemptive Priority interrupting a long-running task to dramatically lower waiting time.',
    quantum: 2,
    processes: [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 10, priority: 4, color: '#818cf8' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 2, burstTime: 2, priority: 1, color: '#34d399' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 4, burstTime: 1, priority: 2, color: '#38bdf8' },
      { id: 'p4', pid: 4, name: 'P4', arrivalTime: 6, burstTime: 3, priority: 1, color: '#fb923c' },
    ],
  },
  {
    id: 'cpu-idle-gaps',
    name: 'Arrival Delays & CPU Idle Gaps',
    description: 'Tests scheduler handling when no processes exist at t=0, or when gaps between arrivals leave the CPU idle.',
    quantum: 2,
    processes: [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 3, burstTime: 4, priority: 2, color: '#60a5fa' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 9, burstTime: 3, priority: 1, color: '#34d399' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 15, burstTime: 2, priority: 3, color: '#fbbf24' },
    ],
  },
];
