import { Challenge, ValidationRule } from '../../types/curriculum';
import { VirtualFS } from '../../engine/filesystem/VirtualFS';

export interface EvaluationResult {
  rule: ValidationRule;
  passed: boolean;
  message: string;
}

export interface ChallengeEvaluation {
  challengeId: string;
  allPassed: boolean;
  results: EvaluationResult[];
}

export function evaluateChallenge(
  challenge: Challenge,
  fs: VirtualFS
): ChallengeEvaluation {
  const results: EvaluationResult[] = [];

  for (const rule of challenge.rules) {
    let passed = false;
    let message = '';
    const normPath = fs.normalizePath(rule.path);
    const exists = fs.exists(normPath);

    switch (rule.type) {
      case 'path_exists':
        passed = exists;
        message = passed
          ? `Path '${rule.path}' exists.`
          : `Path '${rule.path}' does not exist yet.`;
        break;

      case 'is_file':
        passed = exists && fs.isFile(normPath);
        message = passed
          ? `'${rule.path}' is a valid file.`
          : `'${rule.path}' must exist as a file.`;
        break;

      case 'is_dir':
        passed = exists && fs.isDirectory(normPath);
        message = passed
          ? `'${rule.path}' is a valid directory.`
          : `'${rule.path}' must exist as a directory.`;
        break;

      case 'file_contains':
        if (!exists || !fs.isFile(normPath)) {
          passed = false;
          message = `File '${rule.path}' not found.`;
        } else {
          const content = fs.readFile(normPath);
          const expectedStr = typeof rule.expected === 'string' ? rule.expected : '';
          passed = content.includes(expectedStr);
          message = passed
            ? `File '${rule.path}' contains expected text: "${expectedStr}".`
            : `File '${rule.path}' is missing text: "${expectedStr}".`;
        }
        break;

      case 'permission_mode':
        if (!exists) {
          passed = false;
          message = `File '${rule.path}' does not exist.`;
        } else {
          const stat = fs.getStat(normPath);
          const expectedMode = rule.expected as string;
          passed = stat?.octal === expectedMode || stat?.mode === expectedMode;
          message = passed
            ? `Permissions on '${rule.path}' match ${expectedMode}.`
            : `Expected permissions ${expectedMode}, but found (${stat?.octal}/${stat?.mode}).`;
        }
        break;

      default:
        passed = false;
        message = `Unknown rule type`;
    }

    results.push({ rule, passed, message });
  }

  const allPassed = results.length > 0 && results.every((r) => r.passed);

  return {
    challengeId: challenge.id,
    allPassed,
    results,
  };
}
