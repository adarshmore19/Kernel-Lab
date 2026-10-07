import { GanttBlock, Process, ProcessMetric, SimulationMetrics } from '../../types/scheduler';

export function calculateMetrics(
  processes: Process[],
  ganttChart: GanttBlock[]
): SimulationMetrics {
  if (processes.length === 0 || ganttChart.length === 0) {
    return {
      processMetrics: [],
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
      totalTime: 0,
      idleTime: 0,
      contextSwitches: 0,
    };
  }

  const totalTime = ganttChart[ganttChart.length - 1].endTime;
  let idleTime = 0;
  let contextSwitches = 0;

  // Track first start time and completion time for each process
  const firstStartTimeMap: Record<string, number> = {};
  const completionTimeMap: Record<string, number> = {};

  let lastActiveProcId: string | null = null;

  for (const block of ganttChart) {
    if (block.isIdle || block.processId === null) {
      idleTime += block.endTime - block.startTime;
    } else {
      if (lastActiveProcId !== null && lastActiveProcId !== block.processId) {
        contextSwitches++;
      }
      lastActiveProcId = block.processId;

      if (firstStartTimeMap[block.processId] === undefined) {
        firstStartTimeMap[block.processId] = block.startTime;
      }
      completionTimeMap[block.processId] = block.endTime;
    }
  }

  const processMetrics: ProcessMetric[] = processes.map((p) => {
    const ct = completionTimeMap[p.id] ?? p.arrivalTime;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = (firstStartTimeMap[p.id] ?? p.arrivalTime) - p.arrivalTime;

    return {
      processId: p.id,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      completionTime: ct,
      turnaroundTime: Math.max(0, tat),
      waitingTime: Math.max(0, wt),
      responseTime: Math.max(0, rt),
    };
  });

  const count = processes.length;
  const totalWT = processMetrics.reduce((acc, m) => acc + m.waitingTime, 0);
  const totalTAT = processMetrics.reduce((acc, m) => acc + m.turnaroundTime, 0);
  const totalRT = processMetrics.reduce((acc, m) => acc + m.responseTime, 0);

  const busyTime = Math.max(0, totalTime - idleTime);
  const cpuUtilization = totalTime > 0 ? (busyTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? count / totalTime : 0;

  return {
    processMetrics,
    avgWaitingTime: count > 0 ? Number((totalWT / count).toFixed(2)) : 0,
    avgTurnaroundTime: count > 0 ? Number((totalTAT / count).toFixed(2)) : 0,
    avgResponseTime: count > 0 ? Number((totalRT / count).toFixed(2)) : 0,
    cpuUtilization: Number(cpuUtilization.toFixed(1)),
    throughput: Number(throughput.toFixed(3)),
    totalTime,
    idleTime,
    contextSwitches,
  };
}

export function mergeGanttBlocks(blocks: GanttBlock[]): GanttBlock[] {
  if (blocks.length <= 1) return blocks;

  const merged: GanttBlock[] = [];
  let current = { ...blocks[0] };

  for (let i = 1; i < blocks.length; i++) {
    const next = blocks[i];
    if (
      current.processId === next.processId &&
      current.isIdle === next.isIdle &&
      current.endTime === next.startTime
    ) {
      current.endTime = next.endTime;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged;
}
