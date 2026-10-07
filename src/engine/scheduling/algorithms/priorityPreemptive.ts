import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function schedulePriorityPreemptive(processes: Process[]): SchedulingResult {
  if (processes.length === 0) {
    return {
      algorithm: 'PRIORITY_P',
      algorithmName: 'Priority Scheduling (Preemptive)',
      ganttChart: [],
      timeline: [],
      metrics: calculateMetrics([], []),
      educationalNotes: ['No processes provided to schedule.'],
    };
  }

  const validProcs = processes.filter((p) => p.burstTime > 0);
  const remainingBurst: Record<string, number> = {};
  for (const p of validProcs) {
    remainingBurst[p.id] = p.burstTime;
  }

  const rawGantt: GanttBlock[] = [];
  const timeline: TimeSliceRecord[] = [];
  const terminatedQueue: string[] = [];

  let currentTime = 0;
  let completedCount = 0;
  let lastRunningId: string | null = null;

  while (completedCount < validProcs.length) {
    const available = validProcs.filter(
      (p) => p.arrivalTime <= currentTime && remainingBurst[p.id] > 0
    );

    if (available.length === 0) {
      rawGantt.push({
        id: `idle-${currentTime}`,
        processId: null,
        processName: 'IDLE',
        startTime: currentTime,
        endTime: currentTime + 1,
        isIdle: true,
      });

      timeline.push({
        time: currentTime,
        runningProcessId: null,
        readyQueue: [],
        newQueue: validProcs.filter((p) => p.arrivalTime > currentTime).map((p) => p.id),
        terminatedQueue: [...terminatedQueue],
        actionDescription: `Time ${currentTime}: CPU is IDLE, waiting for higher priority processes.`,
      });

      currentTime++;
      lastRunningId = null;
      continue;
    }

    // Lower priority number = higher priority
    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.pid - b.pid;
    });

    const chosen = available[0];
    const isPreemption =
      lastRunningId !== null &&
      lastRunningId !== chosen.id &&
      remainingBurst[lastRunningId] > 0;

    rawGantt.push({
      id: `gantt-${chosen.id}-${currentTime}`,
      processId: chosen.id,
      processName: chosen.name,
      startTime: currentTime,
      endTime: currentTime + 1,
      isIdle: false,
      color: chosen.color,
    });

    const readyQueue = available
      .filter((p) => p.id !== chosen.id)
      .map((p) => p.id);

    const desc = isPreemption
      ? `Time ${currentTime}: PREEMPTION! ${chosen.name} (Priority ${chosen.priority}) preempts running process.`
      : `Time ${currentTime}: ${chosen.name} running (Priority ${chosen.priority}, remaining burst: ${remainingBurst[chosen.id]} → ${remainingBurst[chosen.id] - 1}).`;

    timeline.push({
      time: currentTime,
      runningProcessId: chosen.id,
      readyQueue,
      newQueue: validProcs.filter((p) => p.arrivalTime > currentTime).map((p) => p.id),
      terminatedQueue: [...terminatedQueue],
      actionDescription: desc,
    });

    remainingBurst[chosen.id]--;
    lastRunningId = chosen.id;

    if (remainingBurst[chosen.id] === 0) {
      terminatedQueue.push(chosen.id);
      completedCount++;
    }

    currentTime++;
  }

  timeline.push({
    time: currentTime,
    runningProcessId: null,
    readyQueue: [],
    newQueue: [],
    terminatedQueue: [...terminatedQueue],
    actionDescription: `Time ${currentTime}: Preemptive Priority simulation finished.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'PRIORITY_P',
    algorithmName: 'Priority Scheduling (Preemptive)',
    ganttChart,
    timeline,
    metrics,
    educationalNotes: [
      'Preemptive Priority compares priorities whenever a new process arrives.',
      'If the arriving process has a higher priority than the currently executing process, the CPU is preempted immediately.',
      'Allows urgent real-time or system-critical tasks to be serviced with minimum response latency.',
    ],
  };
}
