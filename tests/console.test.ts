import { describe, it, expect } from 'vitest';
import { calculateRiskSummary } from '../src/console';
import { DependencyChange } from '../src/types';

describe('DepSentry Console Summary Module', () => {
  it('harus menghitung jumlah setiap kategori risiko dengan benar', () => {
    const changes: DependencyChange[] = [
      { name: 'a', type: 'updated', section: 'dependencies', risk: 'HIGH', versionChange: 'major' },
      { name: 'b', type: 'added', section: 'dependencies', risk: 'MEDIUM', versionChange: null },
      { name: 'c', type: 'removed', section: 'dependencies', risk: 'MEDIUM', versionChange: null },
      { name: 'd', type: 'updated', section: 'dependencies', risk: 'LOW', versionChange: 'patch' },
      { name: 'e', type: 'updated', section: 'dependencies', risk: 'UNKNOWN', versionChange: null },
    ];

    const counts = calculateRiskSummary(changes);

    expect(counts).toEqual({
      HIGH: 1,
      MEDIUM: 2,
      LOW: 1,
      UNKNOWN: 1,
    });
  });
});
