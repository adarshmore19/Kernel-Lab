import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function scheduleSJF(processes: Process[]): SchedulingResult {
  if (processes.length === 0) {
    return {
      algorithm: 'SJF',
      algorithmName: 'Shortest Job First (Non-Preemptive)',
      ganttChart: [],
      timeline: [],
      metrics: calculateMetrics([], []),
      educationalNotes: ['No processes provided to schedule.'],
    };
  }

  const validProcs = processes.filter((p) => p.burstTime > 0);
  const rawGantt: GanttBlock[] = [];
  const timeline: TimeSliceRecord[] = [];
  const terminatedQueue: string[] = [];

  let currentTime = 0;
  const remainingProcesses = [...validProcs];

  while (remainingProcesses.length > 0) {
    // Find available processes
    const available = remainingProcesses.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // Find the next arrival time
      const nextArrival = Math.min(...remainingProcesses.map((p) => p.arrivalTime));
      rawGantt.push({
        id: `idle-${currentTime}`,
        processId: null,
        processName: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        isIdle: true,
      });

      for (let t = currentTime; t < nextArrival; t++) {
        timeline.push({
          time: t,
          runningProcessId: null,
          readyQueue: [],
          newQueue: remainingProcesses.map((p) => p.id),
          terminatedQueue: [...terminatedQueue],
          actionDescription: `CPU is IDLE waiting for next arrival at ${nextArrival}.`,
        });
      }
      currentTime = nextArrival;
      continue;
    }

    // Select process with shortest burst time
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.pid - b.pid;
    });

    const chosen = available[0];
    const start = currentTime;
    const end = currentTime + chosen.burstTime;

    rawGantt.push({
      id: `gantt-${chosen.id}-${start}`,
      processId: chosen.id,
      processName: chosen.name,
      startTime: start,
      endTime: end,
      isIdle: false,
      color: chosen.color,
    });

    for (let t = start; t < end; t++) {
      const readyQueue = remainingProcesses
        .filter((p) => p.arrivalTime <= t && p.id !== chosen.id)
        .sort((a, b) => a.burstTime - b.burstTime)
        .map((p) => p.id);

      timeline.push({
        time: t,
        runningProcessId: chosen.id,
        readyQueue,
        newQueue: remainingProcesses.filter((p) => p.arrivalTime > t).map((p) => p.id),
        terminatedQueue: [...terminatedQueue],
        actionDescription:
          t === start
            ? `Time ${t}: ${chosen.name} selected (shortest burst = ${chosen.burstTime}) from ${available.length} candidates.`
            : `Time ${t}: ${chosen.name} running (${t - start + 1}/${chosen.burstTime}).`,
      });
    }

    terminatedQueue.push(chosen.id);
    const idx = remainingProcesses.findIndex((p) => p.id === chosen.id);
    remainingProcesses.splice(idx, 1);
    currentTime = end;
  }

  timeline.push({
    time: currentTime,
    runningProcessId: null,
    readyQueue: [],
    newQueue: [],
    terminatedQueue: [...terminatedQueue],
    actionDescription: `Time ${currentTime}: All processes finished execution.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'SJF',
    algorithmName: 'Shortest Job First (Non-Preemptive)',
    ganttChart,
    timeline,
    metrics,
    educationalNotes: [
      'SJF (Non-Preemptive) selects the waiting process with the smallest CPU burst once the CPU becomes free.',
      'It minimizes average waiting time among non-preemptive algorithms, but can lead to starvation for long processes if short processes keep arriving.',
    ],
  };
}
