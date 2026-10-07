import { GanttBlock, Process, SchedulingResult, TimeSliceRecord } from '../../../types/scheduler';
import { calculateMetrics, mergeGanttBlocks } from '../metrics';

export function scheduleRoundRobin(
  processes: Process[],
  quantum = 2
): SchedulingResult {
  const q = Math.max(1, Math.floor(quantum));
  if (processes.length === 0) {
    return {
      algorithm: 'RR',
      algorithmName: `Round Robin (RR, Quantum=${q})`,
      timeQuantum: q,
      ganttChart: [],
      timeline: [],
      metrics: calculateMetrics([], []),
      educationalNotes: ['No processes provided to schedule.'],
    };
  }

  const validProcs = processes.filter((p) => p.burstTime > 0);
  const remainingBurst: Record<string, number> = {};
  const isEnqueued: Record<string, boolean> = {};

  for (const p of validProcs) {
    remainingBurst[p.id] = p.burstTime;
    isEnqueued[p.id] = false;
  }

  // Sort by arrival time ascending
  const arrivalSorted = [...validProcs].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.pid - b.pid;
  });

  const readyQueue: string[] = [];
  const rawGantt: GanttBlock[] = [];
  const timeline: TimeSliceRecord[] = [];
  const terminatedQueue: string[] = [];

  let currentTime = 0;
  let completedCount = 0;

  // Initial enqueue of processes at arrivalTime <= 0
  for (const p of arrivalSorted) {
    if (p.arrivalTime <= currentTime && !isEnqueued[p.id]) {
      readyQueue.push(p.id);
      isEnqueued[p.id] = true;
    }
  }

  while (completedCount < validProcs.length) {
    if (readyQueue.length === 0) {
      // Find next arriving process
      const unarrived = arrivalSorted.filter((p) => !isEnqueued[p.id]);
      if (unarrived.length > 0) {
        const nextTime = unarrived[0].arrivalTime;
        rawGantt.push({
          id: `idle-${currentTime}`,
          processId: null,
          processName: 'IDLE',
          startTime: currentTime,
          endTime: nextTime,
          isIdle: true,
        });

        for (let t = currentTime; t < nextTime; t++) {
          timeline.push({
            time: t,
            runningProcessId: null,
            readyQueue: [],
            newQueue: unarrived.map((p) => p.id),
            terminatedQueue: [...terminatedQueue],
            actionDescription: `CPU is IDLE waiting for processes to arrive at t=${nextTime}.`,
          });
        }
        currentTime = nextTime;

        // Enqueue newly arrived processes
        for (const p of arrivalSorted) {
          if (p.arrivalTime <= currentTime && !isEnqueued[p.id]) {
            readyQueue.push(p.id);
            isEnqueued[p.id] = true;
          }
        }
        continue;
      } else {
        break;
      }
    }

    const currentProcId = readyQueue.shift()!;
    const proc = validProcs.find((p) => p.id === currentProcId)!;
    const runDuration = Math.min(q, remainingBurst[currentProcId]);
    const start = currentTime;
    const end = currentTime + runDuration;

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
      timeline.push({
        time: t,
        runningProcessId: proc.id,
        readyQueue: [...readyQueue],
        newQueue: arrivalSorted.filter((p) => !isEnqueued[p.id] && p.arrivalTime > t).map((p) => p.id),
        terminatedQueue: [...terminatedQueue],
        actionDescription:
          t === start
            ? `Time ${t}: ${proc.name} dispatched with quantum slice (remaining: ${remainingBurst[proc.id]}).`
            : `Time ${t}: ${proc.name} executing (${t - start + 1}/${runDuration} units of quantum).`,
      });
    }

    remainingBurst[currentProcId] -= runDuration;
    currentTime = end;

    // First, enqueue any new processes that arrived during this time slice
    for (const p of arrivalSorted) {
      if (p.arrivalTime <= currentTime && !isEnqueued[p.id]) {
        readyQueue.push(p.id);
        isEnqueued[p.id] = true;
      }
    }

    // Next, if current process still has burst left, re-queue it at the back
    if (remainingBurst[currentProcId] > 0) {
      readyQueue.push(currentProcId);
    } else {
      terminatedQueue.push(currentProcId);
      completedCount++;
    }
  }

  timeline.push({
    time: currentTime,
    runningProcessId: null,
    readyQueue: [],
    newQueue: [],
    terminatedQueue: [...terminatedQueue],
    actionDescription: `Time ${currentTime}: Round Robin simulation finished with Quantum=${q}.`,
  });

  const ganttChart = mergeGanttBlocks(rawGantt);
  const metrics = calculateMetrics(processes, ganttChart);

  return {
    algorithm: 'RR',
    algorithmName: `Round Robin (Quantum = ${q})`,
    timeQuantum: q,
    ganttChart,
    timeline,
    metrics,
    educationalNotes: [
      `Round Robin allocates a fixed time slice of ${q} time units (quantum) to each process in FIFO order.`,
      'If quantum is too large, Round Robin degenerates into FCFS.',
      'If quantum is too small, context switching overhead degrades system performance.',
      'Round Robin guarantees fairness and bounded response times, making it ideal for interactive time-sharing systems.',
    ],
  };
}
