import { describe, it, expect } from 'vitest';
import { calculateRisk } from '../src/risk';

describe('DepSentry Risk Assessment Module', () => {
  it('patch update harus menghasilkan risk LOW dan versionChange patch', () => {
    const result = calculateRisk('updated', '1.2.3', '1.2.4');
    expect(result).toEqual({ risk: 'LOW', versionChange: 'patch' });
  });

  it('minor update harus menghasilkan risk MEDIUM dan versionChange minor', () => {
    const result = calculateRisk('updated', '1.2.3', '1.3.0');
    expect(result).toEqual({ risk: 'MEDIUM', versionChange: 'minor' });
  });

  it('major update harus menghasilkan risk HIGH dan versionChange major', () => {
    const result = calculateRisk('updated', '1.2.3', '2.0.0');
    expect(result).toEqual({ risk: 'HIGH', versionChange: 'major' });
  });

  it('dependency ditambahkan harus menghasilkan risk MEDIUM', () => {
    const result = calculateRisk('added', undefined, '^1.6.0');
    expect(result).toEqual({ risk: 'MEDIUM', versionChange: null });
  });

  it('dependency dihapus harus menghasilkan risk MEDIUM', () => {
    const result = calculateRisk('removed', '^4.17.21', undefined);
    expect(result).toEqual({ risk: 'MEDIUM', versionChange: null });
  });

  it('versi invalid harus menghasilkan risk UNKNOWN', () => {
    const result = calculateRisk('updated', 'invalid-version', '1.0.0');
    expect(result).toEqual({ risk: 'UNKNOWN', versionChange: null });
  });

  it('versi dengan awalan ^ harus dapat diproses dengan benar', () => {
    const result = calculateRisk('updated', '^4.17.1', '^5.0.0');
    expect(result).toEqual({ risk: 'HIGH', versionChange: 'major' });
  });

  it('versi dengan awalan ~ harus dapat diproses dengan benar', () => {
    const result = calculateRisk('updated', '~1.2.3', '~1.2.4');
    expect(result).toEqual({ risk: 'LOW', versionChange: 'patch' });
  });
});
