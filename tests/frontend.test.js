import { formatVolume } from '../frontend/utils.js';
import { describe, it, expect } from 'vitest';

describe('Utils', () => {
  it('should format small volumes correctly', () => {
    expect(formatVolume(500)).toBe('500 m³');
  });
  it('should format thousands correctly', () => {
    expect(formatVolume(1500)).toBe('1.5k m³');
  });
  it('should format millions correctly', () => {
    expect(formatVolume(2500000)).toBe('2.50M m³');
  });
});
