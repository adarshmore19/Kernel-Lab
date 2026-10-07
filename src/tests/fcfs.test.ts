import { describe, it, expect } from 'vitest';
import { scheduleFCFS } from '../engine/scheduling/algorithms/fcfs';
import { Process } from '../types/scheduler';

describe('FCFS Scheduling Algorithm', () => {
  it('schedules processes in arrival order with zero idle time', () => {
    const procs: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 1, color: '#000' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 2, color: '#000' },
      { id: 'p3', pid: 3, name: 'P3', arrivalTime: 2, burstTime: 1, priority: 3, color: '#000' },
    ];

    const result = scheduleFCFS(procs);
    expect(result.ganttChart.length).toBe(3);
    expect(result.ganttChart[0].processName).toBe('P1');
    expect(result.ganttChart[0].startTime).toBe(0);
    expect(result.ganttChart[0].endTime).toBe(4);

    expect(result.ganttChart[1].processName).toBe('P2');
    expect(result.ganttChart[1].startTime).toBe(4);
    expect(result.ganttChart[1].endTime).toBe(7);

    expect(result.ganttChart[2].processName).toBe('P3');
    expect(result.ganttChart[2].startTime).toBe(7);
    expect(result.ganttChart[2].endTime).toBe(8);

    // Metrics verification
    // P1: CT=4, TAT=4, WT=0, RT=0
    // P2: CT=7, TAT=6, WT=3, RT=3
    // P3: CT=8, TAT=6, WT=5, RT=5
    // Avg WT = (0 + 3 + 5)/3 = 2.67
    expect(result.metrics.avgWaitingTime).toBe(2.67);
  });

  it('inserts CPU IDLE block when arrival time > 0', () => {
    const procs: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 3, burstTime: 2, priority: 1, color: '#000' },
    ];

    const result = scheduleFCFS(procs);
    expect(result.ganttChart.length).toBe(2);
    expect(result.ganttChart[0].isIdle).toBe(true);
    expect(result.ganttChart[0].startTime).toBe(0);
    expect(result.ganttChart[0].endTime).toBe(3);

    expect(result.ganttChart[1].processName).toBe('P1');
    expect(result.ganttChart[1].startTime).toBe(3);
    expect(result.ganttChart[1].endTime).toBe(5);
  });
});
