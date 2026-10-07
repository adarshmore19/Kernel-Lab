import { describe, it, expect } from 'vitest';
import { calculateMetrics } from '../engine/scheduling/metrics';
import { GanttBlock, Process } from '../types/scheduler';

describe('CPU Scheduling Metrics Engine', () => {
  it('accurately computes CT, TAT, WT, RT, utilization, and throughput', () => {
    const processes: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 0, burstTime: 3, priority: 1, color: '#000' },
      { id: 'p2', pid: 2, name: 'P2', arrivalTime: 2, burstTime: 6, priority: 1, color: '#000' },
    ];

    const gantt: GanttBlock[] = [
      { id: '1', processId: 'p1', processName: 'P1', startTime: 0, endTime: 3, isIdle: false },
      { id: '2', processId: 'p2', processName: 'P2', startTime: 3, endTime: 9, isIdle: false },
    ];

    const metrics = calculateMetrics(processes, gantt);

    // P1:
    // First start = 0, End = 3
    // CT = 3
    // TAT = 3 - 0 = 3
    // WT = 3 - 3 = 0
    // RT = 0 - 0 = 0
    const m1 = metrics.processMetrics.find((m) => m.processId === 'p1');
    expect(m1?.completionTime).toBe(3);
    expect(m1?.turnaroundTime).toBe(3);
    expect(m1?.waitingTime).toBe(0);
    expect(m1?.responseTime).toBe(0);

    // P2:
    // First start = 3, End = 9
    // CT = 9
    // TAT = 9 - 2 = 7
    // WT = 7 - 6 = 1
    // RT = 3 - 2 = 1
    const m2 = metrics.processMetrics.find((m) => m.processId === 'p2');
    expect(m2?.completionTime).toBe(9);
    expect(m2?.turnaroundTime).toBe(7);
    expect(m2?.waitingTime).toBe(1);
    expect(m2?.responseTime).toBe(1);

    // Averages:
    // Avg WT = (0 + 1)/2 = 0.5
    // Avg TAT = (3 + 7)/2 = 5
    // Avg RT = (0 + 1)/2 = 0.5
    expect(metrics.avgWaitingTime).toBe(0.5);
    expect(metrics.avgTurnaroundTime).toBe(5);
    expect(metrics.avgResponseTime).toBe(0.5);

    // CPU utilization = (9 - 0) / 9 * 100 = 100%
    expect(metrics.cpuUtilization).toBe(100);
    // Throughput = 2 / 9 = 0.222
    expect(metrics.throughput).toBe(0.222);
  });

  it('handles idle gaps in utilization correctly', () => {
    const processes: Process[] = [
      { id: 'p1', pid: 1, name: 'P1', arrivalTime: 2, burstTime: 3, priority: 1, color: '#000' },
    ];

    const gantt: GanttBlock[] = [
      { id: 'idle', processId: null, processName: 'IDLE', startTime: 0, endTime: 2, isIdle: true },
      { id: 'p1', processId: 'p1', processName: 'P1', startTime: 2, endTime: 5, isIdle: false },
    ];

    const metrics = calculateMetrics(processes, gantt);
    expect(metrics.idleTime).toBe(2);
    expect(metrics.totalTime).toBe(5);
    // Busy time = 3 out of 5 -> 60%
    expect(metrics.cpuUtilization).toBe(60);
  });
});
