import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function scheduleSRTF(processes: Process[]): SchedulingResult {
  if (processes.length === 0) {
    return {
      algorithm: 'SRTF',
      algorithmName: 'Shortest Remaining Time First (SRTF - Preemptive)',
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
    // Available processes with remaining burst > 0 and arrived <= currentTime
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
        actionDescription: `Time ${currentTime}: CPU is IDLE, awaiting process arrival.`,
      });

      currentTime++;
      lastRunningId = null;
      continue;
    }

    // Sort by remaining burst time ascending
    available.sort((a, b) => {
      const remA = remainingBurst[a.id];
      const remB = remainingBurst[b.id];
      if (remA !== remB) return remA - remB;
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
      ? `Time ${currentTime}: PREEMPTION! ${chosen.name} (remaining: ${remainingBurst[chosen.id]}) preempts previous process.`
      : `Time ${currentTime}: ${chosen.name} running (remaining burst: ${remainingBurst[chosen.id]} → ${remainingBurst[chosen.id] - 1}).`;

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
    actionDescription: `Time ${currentTime}: All processes completed under SRTF scheduling.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'SRTF',
    algorithmName: 'Shortest Remaining Time First (SRTF - Preemptive)',
    ganttChart,
    timeline,
    metrics,
    educationalNotes: [
      'SRTF is the preemptive version of Shortest Job First.',
      'Whenever a new process arrives with a remaining burst time less than that of the currently running process, the CPU preempts the running process.',
      'It provides theoretically optimal average waiting times among all scheduling algorithms, but incurs context switch overhead.',
    ],
  };
}
