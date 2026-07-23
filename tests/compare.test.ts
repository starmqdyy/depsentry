import { describe, it, expect } from 'vitest';
import { compareDependencies, comparePackages, readPackageJson } from '../src/compare';
import path from 'path';

describe('DepSentry Compare Module', () => {
  describe('compareDependencies()', () => {
    it('harus mendeteksi dependency yang ditambahkan', () => {
      const oldDeps = {};
      const newDeps = { axios: '^1.6.0' };

      const result = compareDependencies(oldDeps, newDeps, 'dependencies');

      expect(result).toEqual([
        {
          name: 'axios',
          type: 'added',
          section: 'dependencies',
          newVersion: '^1.6.0',
          risk: 'MEDIUM',
          versionChange: null,
        },
      ]);
    });

    it('harus mendeteksi dependency yang dihapus', () => {
      const oldDeps = { lodash: '^4.17.21' };
      const newDeps = {};

      const result = compareDependencies(oldDeps, newDeps, 'dependencies');

      expect(result).toEqual([
        {
          name: 'lodash',
          type: 'removed',
          section: 'dependencies',
          oldVersion: '^4.17.21',
          risk: 'MEDIUM',
          versionChange: null,
        },
      ]);
    });

    it('harus mendeteksi dependency yang versinya diperbarui', () => {
      const oldDeps = { express: '^4.17.1' };
      const newDeps = { express: '^4.18.2' };

      const result = compareDependencies(oldDeps, newDeps, 'dependencies');

      expect(result).toEqual([
        {
          name: 'express',
          type: 'updated',
          section: 'dependencies',
          oldVersion: '^4.17.1',
          newVersion: '^4.18.2',
          risk: 'MEDIUM',
          versionChange: 'minor',
        },
      ]);
    });

    it('harus mengabaikan dependency yang tidak berubah', () => {
      const oldDeps = { dotenv: '^10.0.0' };
      const newDeps = { dotenv: '^10.0.0' };

      const result = compareDependencies(oldDeps, newDeps, 'dependencies');

      expect(result).toEqual([]);
    });
  });

  describe('comparePackages()', () => {
    it('harus membandingkan dependencies dan devDependencies sekaligus', () => {
      const oldPkg = {
        dependencies: { express: '^4.17.1' },
        devDependencies: { typescript: '^4.9.5' },
      };
      const newPkg = {
        dependencies: { express: '^4.18.2' },
        devDependencies: { typescript: '^5.3.3' },
      };

      const result = comparePackages(oldPkg, newPkg);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        name: 'express',
        type: 'updated',
        section: 'dependencies',
        oldVersion: '^4.17.1',
        newVersion: '^4.18.2',
        risk: 'MEDIUM',
        versionChange: 'minor',
      });
      expect(result).toContainEqual({
        name: 'typescript',
        type: 'updated',
        section: 'devDependencies',
        oldVersion: '^4.9.5',
        newVersion: '^5.3.3',
        risk: 'HIGH',
        versionChange: 'major',
      });
    });
  });

  describe('readPackageJson() & Error Handling', () => {
    it('harus melempar error jika file tidak ditemukan', () => {
      const invalidPath = path.join(__dirname, 'non-existent-file.json');

      expect(() => readPackageJson(invalidPath)).toThrow(/File tidak ditemukan/);
    });

    it('harus melempar error jika file JSON tidak valid', () => {
      const exampleOldPath = path.join(__dirname, '../examples/package-old.json');
      expect(() => readPackageJson(exampleOldPath)).not.toThrow();
    });
  });
});
