import path from 'path';
import { comparePackageFiles } from './compare';
import { printHeader, printFileInfo, printChange, printRiskSummary } from './console';
import { writeMarkdownReport } from './report';
import chalk from 'chalk';

function parseArgs(args: string[]) {
  let oldPath = '';
  let newPath = '';
  let outputPath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output' && i + 1 < args.length) {
      outputPath = args[i + 1];
      i++;
    } else if (arg.startsWith('--output=')) {
      outputPath = arg.split('=')[1];
    } else if (!oldPath) {
      oldPath = arg;
    } else if (!newPath) {
      newPath = arg;
    }
  }

  return { oldPath, newPath, outputPath };
}

function main() {
  const args = process.argv.slice(2);
  const { oldPath: oldArg, newPath: newArg, outputPath } = parseArgs(args);

  if (!oldArg || !newArg) {
    printHeader();
    console.log('Penggunaan: npm start -- <package-old.json> <package-new.json> [--output <report.md>]');
    console.log('Contoh: npm start -- ./examples/package-old.json ./examples/package-new.json --output safedep-report.md');
    process.exit(1);
  }

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

    if (outputPath) {
      const resolvedOutputPath = path.resolve(outputPath);
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
}

main();
