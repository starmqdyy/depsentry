import { describe, it, expect, afterEach } from 'vitest';
import { generateMarkdownReport, writeMarkdownReport, getRecommendation } from '../src/report';
import { DependencyChange } from '../src/types';
import fs from 'fs';
import path from 'path';

describe('SafeDep Report Module', () => {
  const testOutputPath = path.join(__dirname, 'temp-test-report.md');

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
    }
  });

  it('harus menghasilkan rekomendasi yang sesuai untuk setiap risk level', () => {
    expect(getRecommendation('HIGH')).toContain('Review breaking changes');
    expect(getRecommendation('MEDIUM')).toContain('Review the update');
    expect(getRecommendation('LOW')).toContain('Usually safe');
    expect(getRecommendation('UNKNOWN')).toContain('Manual review is required');
  });

  it('harus membuat laporan Markdown dengan Judul, Summary, dan Kategori Risiko yang benar', () => {
    const changes: DependencyChange[] = [
      {
        name: 'typescript',
        type: 'updated',
        section: 'devDependencies',
        oldVersion: '^4.9.5',
        newVersion: '^5.3.3',
        risk: 'HIGH',
        versionChange: 'major',
      },
      {
        name: 'axios',
        type: 'added',
        section: 'dependencies',
        newVersion: '^1.6.0',
        risk: 'MEDIUM',
        versionChange: null,
      },
    ];

    const markdown = generateMarkdownReport('./package-old.json', './package-new.json', changes);

    expect(markdown).toContain('# SafeDep Dependency Report');
    expect(markdown).toContain('Created by starmqdyy');
    expect(markdown).toContain('https://github.com/starmqdyy/safedep');

    expect(markdown).toContain('## Summary');
    expect(markdown).toContain('- **Total Changes**: 2');
    expect(markdown).toContain('- **HIGH Risk**: 1');
    expect(markdown).toContain('- **MEDIUM Risk**: 1');

    expect(markdown).toContain('## High Risk');
    expect(markdown).toContain('### typescript');
    expect(markdown).toContain('Review breaking changes and run all tests before updating.');

    expect(markdown).toContain('## Medium Risk');
    expect(markdown).toContain('### axios');
    expect(markdown).toContain('Review the update and run relevant tests.');

    expect(markdown).toContain('## Low Risk');
    expect(markdown).toContain('No low risk changes detected.');

    expect(markdown).toContain('## Unknown Risk');
    expect(markdown).toContain('No unknown risk changes detected.');
  });

  it('harus menangani laporan dengan daftar perubahan kosong', () => {
    const markdown = generateMarkdownReport('./package-old.json', './package-new.json', []);

    expect(markdown).toContain('# SafeDep Dependency Report');
    expect(markdown).toContain('- **Total Changes**: 0');
    expect(markdown).toContain('No high risk changes detected.');
  });

  it('harus dapat menulis laporan Markdown ke file fisik', () => {
    const changes: DependencyChange[] = [
      {
        name: 'express',
        type: 'updated',
        section: 'dependencies',
        oldVersion: '^4.17.1',
        newVersion: '^4.18.2',
        risk: 'MEDIUM',
        versionChange: 'minor',
      },
    ];

    writeMarkdownReport(testOutputPath, './old.json', './new.json', changes);

    expect(fs.existsSync(testOutputPath)).toBe(true);

    const fileContent = fs.readFileSync(testOutputPath, 'utf-8');
    expect(fileContent).toContain('# SafeDep Dependency Report');
    expect(fileContent).toContain('### express');
  });
});
