import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function schedulePriorityNonPreemptive(processes: Process[]): SchedulingResult {
  if (processes.length === 0) {
    return {
      algorithm: 'PRIORITY_NP',
      algorithmName: 'Priority Scheduling (Non-Preemptive)',
      ganttChart: [],
      timeline: [],
      metrics: calculateMetrics([], []),
      educationalNotes: ['No processes provided to schedule.'],
    };
  }

  const validProcs = processes.filter((p) => p.burstTime > 0);
  const remainingProcesses = [...validProcs];
  const rawGantt: GanttBlock[] = [];
  const timeline: TimeSliceRecord[] = [];
  const terminatedQueue: string[] = [];

  let currentTime = 0;

  while (remainingProcesses.length > 0) {
    const available = remainingProcesses.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
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
          actionDescription: `CPU is IDLE waiting for processes to arrive at ${nextArrival}.`,
        });
      }
      currentTime = nextArrival;
      continue;
    }

    // Lower priority number = higher priority
    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
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
        .sort((a, b) => a.priority - b.priority)
        .map((p) => p.id);

      timeline.push({
        time: t,
        runningProcessId: chosen.id,
        readyQueue,
        newQueue: remainingProcesses.filter((p) => p.arrivalTime > t).map((p) => p.id),
        terminatedQueue: [...terminatedQueue],
        actionDescription:
          t === start
            ? `Time ${t}: ${chosen.name} (Priority ${chosen.priority}) selected for execution.`
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
    actionDescription: `Time ${currentTime}: Priority (Non-Preemptive) simulation complete.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'PRIORITY_NP',
    algorithmName: 'Priority Scheduling (Non-Preemptive)',
    ganttChart,
    timeline,
    metrics,
    educationalNotes: [
      'Non-Preemptive Priority assigns the CPU to the highest-priority arrived process (lower number = higher priority).',
      'Once a process acquires the CPU, it runs until its burst finishes, even if a higher-priority process arrives in the meantime.',
      'A major issue is starvation/indefinite blocking of low-priority processes. Aging can be used to prevent this.',
    ],
  };
}
