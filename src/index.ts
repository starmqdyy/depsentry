#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { comparePackageFiles } from './compare';
import { printHeader, printFileInfo, printChange, printRiskSummary } from './console';
import { writeMarkdownReport } from './report';
import chalk from 'chalk';
import packageJson from '../package.json';

const program = new Command();

program
  .name('safedep')
  .description('Dependency Risk Analyzer for Node.js')
  .version(packageJson.version || '1.0.0', '-v, --version', 'Tampilkan versi SafeDep');

program
  .command('compare')
  .description('Bandingkan dua file package.json dan analisis tingkat risikonya')
  .argument('<old-file>', 'Path ke file package.json lama')
  .argument('<new-file>', 'Path ke file package.json baru')
  .option('-o, --output <file>', 'Simpan hasil analisis ke file laporan Markdown')
  .action((oldArg: string, newArg: string, options: { output?: string }) => {
    const oldPath = path.resolve(oldArg);
    const newPath = path.resolve(newArg);

    try {
      printHeader();
      printFileInfo(oldArg, newArg);

      const changes = comparePackageFiles(oldPath, newPath);

      if (changes.length === 0) {
        console.log('Tidak ada perubahan dependency.');
      } else {
        console.log(chalk.bold('Dependency Changes\n'));

        changes.forEach((change) => {
          printChange(change);
        });

        printRiskSummary(changes);
      }

      if (options.output) {
        const resolvedOutputPath = path.resolve(options.output);
        writeMarkdownReport(resolvedOutputPath, oldArg, newArg, changes);
        console.log(chalk.cyan(`Report saved to: ${resolvedOutputPath}\n`));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('Terjadi kesalahan yang tidak diketahui.'));
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
