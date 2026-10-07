import { describe, it, expect } from 'vitest';
import { parseCommandLine, tokenizeString, parseArgsAndFlags, expandEnvVars } from '../engine/shell/parser';

describe('Shell Parser Engine', () => {
  it('tokenizes standard commands with quotes correctly', () => {
    const tokens = tokenizeString('echo "hello world" test \'single quoted\'');
    expect(tokens).toEqual(['echo', 'hello world', 'test', 'single quoted']);
  });

  it('expands environment variables', () => {
    const env = { USER: 'adarsh', OS: 'Linux' };
    expect(expandEnvVars('Hello $USER on $OS', env)).toBe('Hello adarsh on Linux');
  });

  it('parses pipeline stages', () => {
    const parsed = parseCommandLine('cat notes.txt | grep Linux | wc -l');
    expect(parsed.stages.length).toBe(3);
    expect(parsed.stages[0].command).toBe('cat');
    expect(parsed.stages[0].args).toEqual(['notes.txt']);
    expect(parsed.stages[1].command).toBe('grep');
    expect(parsed.stages[1].args).toEqual(['Linux']);
    expect(parsed.stages[2].command).toBe('wc');
    expect(parsed.stages[2].args).toEqual(['-l']);
  });

  it('parses output redirection > and >>', () => {
    const parsed1 = parseCommandLine('echo "data" > output.txt');
    expect(parsed1.outputRedirectFile).toBe('output.txt');
    expect(parsed1.appendOutput).toBe(false);

    const parsed2 = parseCommandLine('echo "line2" >> log.txt');
    expect(parsed2.outputRedirectFile).toBe('log.txt');
    expect(parsed2.appendOutput).toBe(true);
  });

  it('parses flags and arguments accurately', () => {
    const { flags, options, positional } = parseArgsAndFlags(
      ['-la', '-n', '5', '--recursive', 'myfile.txt'],
      ['n']
    );
    expect(flags.has('l')).toBe(true);
    expect(flags.has('a')).toBe(true);
    expect(flags.has('recursive')).toBe(true);
    expect(options['n']).toBe('5');
    expect(positional).toEqual(['myfile.txt']);
  });
});
