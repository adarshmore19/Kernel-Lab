export interface ValidationRule {
  type:
    | 'path_exists'
    | 'is_file'
    | 'is_dir'
    | 'file_contains'
    | 'file_matches'
    | 'permission_mode';
  path: string;
  expected?: string | RegExp;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  hints: string[];
  targetOutcome: string;
  rules: ValidationRule[];
  xp: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  readTime: string;
  content: string; // rich markdown/formatted text
  syntax?: string;
  examples: Array<{
    command: string;
    description: string;
    expectedOutput?: string;
  }>;
  interactiveChallenge?: Challenge;
  keyTakeaways: string[];
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badgeText: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessons: string[];
  completedChallenges: string[];
  xp: number;
  lastActiveLessonId: string;
  history: string[];
}
