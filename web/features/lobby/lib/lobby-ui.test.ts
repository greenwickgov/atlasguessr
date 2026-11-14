import { describe, expect, it } from 'vitest';
import { formatChangelogDate } from './release-date';
describe('release dates', () => {
  it('does not display database zero dates as year one', () => {
    expect(formatChangelogDate('0001-01-01T00:00:00Z')).toBe('');
    expect(formatChangelogDate('invalid')).toBe('');
  });
  it('formats a real release date in a stable timezone', () => {
    expect(formatChangelogDate('2026-11-14T07:00:00Z')).toBe('Nov 14, 2026');
  });
});
