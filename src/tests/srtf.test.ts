import { describe, it, expect } from 'vitest';
import { scheduleSRTF } from '../engine/scheduling/algorithms/srtf';
import { Process } from '../types/scheduler';

describe('SRTF Preemptive Scheduling Algorithm', () => {
  it('preempts a running process when a shorter burst arrives', () => {
    const procs: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 1, color: '#000' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, color: '#000' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 1, color: '#000' },
      { id: 'p4', pid: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 1, color: '#000' },
    ];

    // t=0: P1 starts (rem: 8)
    // t=1: P2 arrives with burst 4 < P1's remaining 7 -> P1 preempted! P2 runs.
    // t=2: P3 arrives (rem: 9 > P2's 3). P2 continues.
    // t=3: P4 arrives (rem: 5 > P2's 2). P2 continues.
    // t=5: P2 completes. Arrived remaining: P4 (5), P1 (7), P3 (9).
    // P4 runs 5 to 10 (completes).
    // P1 runs 10 to 17 (completes).
    // P3 runs 17 to 26 (completes).
    const res = scheduleSRTF(procs);
    const order = res.ganttChart.map((b) => ({
      name: b.processName,
      start: b.startTime,
      end: b.endTime,
    }));

    expect(order).toEqual([
      { name: 'P1', start: 0, end: 1 },
      { name: 'P2', start: 1, end: 5 },
      { name: 'P4', start: 5, end: 10 },
      { name: 'P1', start: 10, end: 17 },
      { name: 'P3', start: 17, end: 26 },
    ]);
  });
});
