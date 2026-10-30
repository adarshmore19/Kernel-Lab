export type UnitId = 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';

export interface IndustrialApplication {
  company: string;
  industry: string;
  systemName: string;
  tagline: string;
  challenge: string;
  solution: string;
  architectureDetails: string[];
  techStack: string[];
  codeOrConfigSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface ExamNotes {
  frequentQuestions: {
    question: string;
    answer: string;
  }[];
  keyDifferences?: {
    feature: string;
    itemA: string;
    itemB: string;
    difference: string;
  }[];
  criticalFormulasOrRules?: string[];
}

export type AnimationType =
  | 'rtos-deadlines'
  | 'distributed-cluster'
  | 'system-call-trap'
  | 'os-types'
  | 'os-services'
  | 'process-lifecycle'
  | 'thread-models'
  | 'ipc-mechanisms'
  | 'context-switch'
  | 'schedulers-queues'
  | 'cpu-scheduling'
  | 'deadlock-rag'
  | 'bankers-algorithm'
  | 'memory-partitioning'
  | 'paging-translation'
  | 'virtual-memory-page-fault'
  | 'page-replacement'
  | 'segmentation-check'
  | 'free-space-bitmap-list'
  | 'directory-structures'
  | 'file-allocation'
  | 'file-access-methods'
  | 'unit-revision';

export interface TheoryTopic {
  id: string;
  unitId: UnitId;
  unitTitle: string;
  unitNumber: number;
  title: string;
  shortSummary: string;
  animationType: AnimationType;
  keyTakeaways: string[];
  theorySections: {
    heading: string;
    content: string;
    bullets?: string[];
    diagramAscii?: string;
  }[];
  industrialApplication: IndustrialApplication;
  examNotes: ExamNotes;
}

export interface UnitInfo {
  id: UnitId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  topics: TheoryTopic[];
}
