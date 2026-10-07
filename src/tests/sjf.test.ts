import { describe, it, expect } from 'vitest';
import { scheduleSJF } from '../engine/scheduling/algorithms/sjf';
import { Process } from '../types/scheduler';

describe('SJF Non-Preemptive Scheduling Algorithm', () => {
  it('selects the shortest burst among available arrived processes', () => {
    const procs: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 7, priority: 1, color: '#000' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 2, burstTime: 4, priority: 1, color: '#000' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 4, burstTime: 1, priority: 1, color: '#000' },
      { id: 'p4', pid: 4, name: 'P4', arrivalTime: 5, burstTime: 4, priority: 1, color: '#000' },
    ];

    // At t=0, only P1 is available, so P1 runs from 0 to 7 non-preemptively.
    // At t=7, P2 (burst 4), P3 (burst 1), P4 (burst 4) have all arrived.
    // Smallest burst is P3 (1) -> runs 7 to 8.
    // At t=8, P2 and P4 both have burst 4. P2 arrived first (t=2) -> runs 8 to 12.
    // P4 runs 12 to 16.
    const res = scheduleSJF(procs);
    expect(res.ganttChart.map((b) => b.processName)).toEqual(['P1', 'P3', 'P2', 'P4']);
    expect(res.ganttChart[0].endTime).toBe(7);
    expect(res.ganttChart[1].endTime).toBe(8);
    expect(res.ganttChart[2].endTime).toBe(12);
    expect(res.ganttChart[3].endTime).toBe(16);
  });
});
