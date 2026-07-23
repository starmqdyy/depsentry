import { describe, it, expect, afterEach } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

describe('DepSentry CLI Commander Integration', () => {
  const cliPath = path.join(__dirname, '../src/index.ts');
  const oldPkg = path.join(__dirname, '../examples/package-old.json');
  const newPkg = path.join(__dirname, '../examples/package-new.json');
  const tempReport = path.join(__dirname, 'temp-cli-report.md');

  afterEach(() => {
    if (fs.existsSync(tempReport)) {
      fs.unlinkSync(tempReport);
    }
  });

  it('harus menampilkan pesan bantuan dengan opsi --help', () => {
    const output = execSync(`npx tsx ${cliPath} --help`).toString();
    expect(output).toContain('Usage: depsentry [options] [command]');
    expect(output).toContain('Dependency Risk Analyzer for Node.js');
    expect(output).toContain('compare');
  });

  it('harus menampilkan versi dengan opsi --version', () => {
    const output = execSync(`npx tsx ${cliPath} --version`).toString();
    expect(output.trim()).toBe('0.3.0');
  });

  it('harus menjalankan command compare dengan sukses', () => {
    const output = execSync(`npx tsx ${cliPath} compare ${oldPkg} ${newPkg}`).toString();
    expect(output).toContain('DepSentry');
    expect(output).toContain('Dependency Changes');
    expect(output).toContain('Total changes: 6');
  });

  it('harus mendukung opsi -o / --output untuk menyimpan laporan', () => {
    const output = execSync(
      `npx tsx ${cliPath} compare ${oldPkg} ${newPkg} -o ${tempReport}`
    ).toString();

    expect(output).toContain('Report saved to:');
    expect(fs.existsSync(tempReport)).toBe(true);

    const reportContent = fs.readFileSync(tempReport, 'utf-8');
    expect(reportContent).toContain('# DepSentry Dependency Report');
  });

  it('harus menampilkan error jika argumen file kurang', () => {
    try {
      execSync(`npx tsx ${cliPath} compare ${oldPkg}`);
    } catch (error: any) {
      const stderr = error.stderr ? error.stderr.toString() : error.message;
      expect(stderr).toContain("error: missing required argument 'new-file'");
    }
  });

  it('harus menampilkan error jika file tidak ditemukan', () => {
    const invalidFile = path.join(__dirname, 'non-existent.json');
    try {
      execSync(`npx tsx ${cliPath} compare ${oldPkg} ${invalidFile}`);
    } catch (error: any) {
      const stdout = error.stdout ? error.stdout.toString() : '';
      const stderr = error.stderr ? error.stderr.toString() : '';
      const fullOutput = stdout + stderr;
      expect(fullOutput).toContain('File tidak ditemukan');
    }
  });
});
