import { describe, it, expect } from 'vitest';
import { schedulePriorityNonPreemptive } from '../engine/scheduling/algorithms/priorityNonPreemptive';
import { schedulePriorityPreemptive } from '../engine/scheduling/algorithms/priorityPreemptive';
import { Process } from '../types/scheduler';

describe('Priority Scheduling Algorithms', () => {
  const procs: Process[] = [
    { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 3, color: '#000' },
    { id: 'p2', pid: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#000' },
    { id: 'p3', pid: 3, name: 'P3', arrivalTime: 2, burstTime: 2, priority: 2, color: '#000' },
  ];

  it('runs non-preemptive priority respecting initial run and subsequent priority order', () => {
    // Non-preemptive: P1 starts at t=0 and runs to completion (0 to 4) because it cannot be preempted.
    // At t=4, P2 (priority 1) and P3 (priority 2) are available.
    // P2 has higher priority (1 < 2) -> runs 4 to 7.
    // P3 runs 7 to 9.
    const res = schedulePriorityNonPreemptive(procs);
    expect(res.ganttChart.map((b) => b.processName)).toEqual(['P1', 'P2', 'P3']);
    expect(res.ganttChart[0].endTime).toBe(4);
    expect(res.ganttChart[1].endTime).toBe(7);
    expect(res.ganttChart[2].endTime).toBe(9);
  });

  it('runs preemptive priority and interrupts running process when higher priority arrives', () => {
    // Preemptive:
    // t=0: P1 starts (priority 3).
    // t=1: P2 arrives (priority 1 < 3) -> PREEMPTS P1! P2 runs 1 to 4 (completes).
    // t=4: available are P3 (priority 2) and P1 (priority 3, rem: 3).
    // P3 has higher priority (2 < 3) -> runs 4 to 6 (completes).
    // P1 finishes 6 to 9.
    const res = schedulePriorityPreemptive(procs);
    const chart = res.ganttChart.map((b) => ({
      name: b.processName,
      start: b.startTime,
      end: b.endTime,
    }));

    expect(chart).toEqual([
      { name: 'P1', start: 0, end: 1 },
      { name: 'P2', start: 1, end: 4 },
      { name: 'P3', start: 4, end: 6 },
      { name: 'P1', start: 6, end: 9 },
    ]);
  });
});
