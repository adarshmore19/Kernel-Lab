import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function scheduleFCFS(processes: Process[]): SchedulingResult {
  if (processes.length === 0) {
    return {
      algorithm: 'FCFS',
      algorithmName: 'First Come First Serve (FCFS)',
      ganttChart: [],
      timeline: [],
      metrics: calculateMetrics([], []),
      educationalNotes: ['No processes provided to schedule.'],
    };
  }

  // Filter out invalid/zero burst processes or keep them
  const validProcs = processes.filter((p) => p.burstTime > 0);
  const sorted = [...validProcs].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.pid - b.pid;
  });

  const rawGantt: GanttBlock[] = [];
  const timeline: TimeSliceRecord[] = [];
  const educationalNotes: string[] = [
    'FCFS is non-preemptive. The CPU is allocated to the process in the exact order of their arrival.',
    'A disadvantage is the "Convoy Effect", where short processes get stuck waiting behind long CPU-bound processes.',
  ];

  let currentTime = 0;
  const terminatedQueue: string[] = [];

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      // Idle block
      rawGantt.push({
        id: `idle-${currentTime}`,
        processId: null,
        processName: 'IDLE',
        startTime: currentTime,
        endTime: proc.arrivalTime,
        isIdle: true,
      });

      for (let t = currentTime; t < proc.arrivalTime; t++) {
        timeline.push({
          time: t,
          runningProcessId: null,
          readyQueue: [],
          newQueue: sorted.filter((p) => p.arrivalTime > t).map((p) => p.id),
          terminatedQueue: [...terminatedQueue],
          actionDescription: `CPU is IDLE waiting for processes to arrive.`,
        });
      }
      currentTime = proc.arrivalTime;
    }

    const start = currentTime;
    const end = currentTime + proc.burstTime;

    rawGantt.push({
      id: `gantt-${proc.id}-${start}`,
      processId: proc.id,
      processName: proc.name,
      startTime: start,
      endTime: end,
      isIdle: false,
      color: proc.color,
    });

    for (let t = start; t < end; t++) {
      const arrivedAndWaiting = sorted
        .filter((p) => p.arrivalTime <= t && p.id !== proc.id && !terminatedQueue.includes(p.id))
        .map((p) => p.id);

      timeline.push({
        time: t,
        runningProcessId: proc.id,
        readyQueue: arrivedAndWaiting,
        newQueue: sorted.filter((p) => p.arrivalTime > t).map((p) => p.id),
        terminatedQueue: [...terminatedQueue],
        actionDescription:
          t === start
            ? `Time ${t}: ${proc.name} (Burst: ${proc.burstTime}) started execution on the CPU.`
            : `Time ${t}: ${proc.name} is running (${t - start + 1}/${proc.burstTime}).`,
      });
    }

    terminatedQueue.push(proc.id);
    currentTime = end;
  }

  // Final termination tick
  timeline.push({
    time: currentTime,
    runningProcessId: null,
    readyQueue: [],
    newQueue: [],
    terminatedQueue: [...terminatedQueue],
    actionDescription: `Time ${currentTime}: All ${processes.length} processes completed execution.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'FCFS',
    algorithmName: 'First Come First Serve (FCFS)',
    ganttChart,
    timeline,
    metrics,
    educationalNotes,
  };
}
