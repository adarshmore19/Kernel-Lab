import { describe, it, expect } from 'vitest';
import { scheduleRoundRobin } from '../engine/scheduling/algorithms/roundRobin';
import { Process } from '../types/scheduler';

describe('Round Robin Scheduling Algorithm', () => {
  it('schedules processes round-robin using specified time quantum', () => {
    const procs: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1, color: '#000' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#000' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 2, burstTime: 1, priority: 1, color: '#000' },
    ];

    // Quantum = 2
    // t=0: P1 runs (0 to 2). Remaining: P1 (3). Arrived at t=1: P2, t=2: P3.
    // Queue after t=2: [P2, P3, P1]
    // P2 runs (2 to 4). Remaining: P2 (1). Queue: [P3, P1, P2]
    // P3 runs (4 to 5). Remaining: 0 (terminates). Queue: [P1, P2]
    // P1 runs (5 to 7). Remaining: P1 (1). Queue: [P2, P1]
    // P2 runs (7 to 8). Terminates. Queue: [P1]
    // P1 runs (8 to 9). Terminates.
    const res = scheduleRoundRobin(procs, 2);
    const chart = res.ganttChart.map((b) => ({
      name: b.processName,
      start: b.startTime,
      end: b.endTime,
    }));

    expect(chart).toEqual([
      { name: 'P1', start: 0, end: 2 },
      { name: 'P2', start: 2, end: 4 },
      { name: 'P3', start: 4, end: 5 },
      { name: 'P1', start: 5, end: 7 },
      { name: 'P2', start: 7, end: 8 },
      { name: 'P1', start: 8, end: 9 },
    ]);
  });
});
