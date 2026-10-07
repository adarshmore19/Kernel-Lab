import { useState, useEffect } from 'react';
import { UserProgress } from '../types/curriculum';

const STORAGE_KEY = 'kernellab_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: ['what-is-linux'],
  completedChallenges: [],
  xp: 150,
  lastActiveLessonId: 'what-is-linux',
  history: ['ls -la', 'cat /etc/os-release', 'uname -a'],
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  const markLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + 25,
      };
    });
  };

  const markChallengeComplete = (challengeId: string, xpEarned: number) => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        xp: prev.xp + xpEarned,
      };
    });
  };

  const setLastActiveLesson = (lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      lastActiveLessonId: lessonId,
    }));
  };

  return {
    progress,
    markLessonComplete,
    markChallengeComplete,
    setLastActiveLesson,
  };
}
