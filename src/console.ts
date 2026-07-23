import chalk from 'chalk';
import { DependencyChange, RiskLevel, ChangeType } from './types';

/**
 * Menampilkan header identitas project SafeDep.
 */
export function printHeader(): void {
  const title = chalk.cyan.bold('SafeDep');
  const subtitle = 'Dependency Risk Analyzer for Node.js';
  const author = 'Created by starmqdyy';
  const github = 'github.com/starmqdyy/safedep';

  console.log('╭──────────────────────────────────────────────╮');
  console.log(`│                  ${title}                     │`);
  console.log(`│   ${subtitle}       │`);
  console.log('│                                              │');
  console.log(`│   ${author}                       │`);
  console.log(`│   ${github}               │`);
  console.log('╰──────────────────────────────────────────────╯\n');
}

/**
 * Menampilkan lokasi file yang dibandingkan.
 */
export function printFileInfo(oldPath: string, newPath: string): void {
  console.log(chalk.bold('Files'));
  console.log(`  ${chalk.gray('Old')}  ${oldPath}`);
  console.log(`  ${chalk.gray('New')}  ${newPath}\n`);
}

/**
 * Mengembalikan format teks warna untuk tingkat risiko (RiskLevel).
 */
export function formatRiskTag(risk: RiskLevel): string {
  const padded = risk.padEnd(7, ' ');
  switch (risk) {
    case 'HIGH':
      return chalk.red.bold(padded);
    case 'MEDIUM':
      return chalk.yellow.bold(padded);
    case 'LOW':
      return chalk.green.bold(padded);
    case 'UNKNOWN':
    default:
      return chalk.gray(padded);
  }
}

/**
 * Mengembalikan format teks warna untuk tipe perubahan (ChangeType).
 */
export function formatTypeTag(type: ChangeType): string {
  const t = type.toUpperCase().padEnd(7, ' ');
  if (t.startsWith('ADD')) return chalk.green(t);
  if (t.startsWith('REM')) return chalk.red(t);
  if (t.startsWith('UPD')) return chalk.cyan(t);
  return chalk.gray(t);
}

/**
 * Menampilkan satu item perubahan dependency.
 */
export function printChange(change: DependencyChange): void {
  let bullet = chalk.gray('●');
  if (change.risk === 'HIGH') bullet = chalk.red('●');
  if (change.risk === 'MEDIUM') bullet = chalk.yellow('●');
  if (change.risk === 'LOW') bullet = chalk.green('●');

  const riskTag = formatRiskTag(change.risk);
  const typeTag = formatTypeTag(change.type);
  const name = chalk.white.bold(change.name);

  console.log(`${bullet} ${riskTag} ${typeTag}  ${name}`);

  if (change.type === 'updated') {
    console.log(chalk.gray(`  ${change.oldVersion} → ${change.newVersion}`));
    const detail = change.versionChange ? ` · ${change.versionChange} update` : '';
    console.log(chalk.gray(`  ${change.section}${detail}`));
  } else if (change.type === 'added') {
    console.log(chalk.gray(`  ${change.newVersion}`));
    console.log(chalk.gray(`  ${change.section}`));
  } else if (change.type === 'removed') {
    console.log(chalk.gray(`  ${change.oldVersion}`));
    console.log(chalk.gray(`  ${change.section}`));
  }
  console.log();
}

/**
 * Menghitung dan merangkum jumlah risiko dari daftar perubahan.
 */
export function calculateRiskSummary(changes: DependencyChange[]) {
  const counts = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    UNKNOWN: 0,
  };

  changes.forEach((c) => {
    if (counts[c.risk] !== undefined) {
      counts[c.risk]++;
    }
  });

  return counts;
}

/**
 * Menampilkan ringkasan jumlah risiko dan total perubahan.
 */
export function printRiskSummary(changes: DependencyChange[]): void {
  const counts = calculateRiskSummary(changes);

  console.log(chalk.bold('Risk Summary\n'));
  console.log(`  ${chalk.red.bold('HIGH'.padEnd(10, ' '))} ${counts.HIGH}`);
  console.log(`  ${chalk.yellow.bold('MEDIUM'.padEnd(10, ' '))} ${counts.MEDIUM}`);
  console.log(`  ${chalk.green.bold('LOW'.padEnd(10, ' '))} ${counts.LOW}`);
  console.log(`  ${chalk.gray('UNKNOWN'.padEnd(10, ' '))} ${counts.UNKNOWN}\n`);

  console.log(chalk.bold(`Total changes: ${changes.length}\n`));
  console.log(chalk.green.bold('SafeDep completed successfully.'));
}
