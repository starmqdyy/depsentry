import path from 'path';
import { comparePackageFiles } from './compare';
import { printHeader, printFileInfo, printChange, printRiskSummary } from './console';
import chalk from 'chalk';

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    printHeader();
    console.log('Penggunaan: npm start -- <package-old.json> <package-new.json>');
    console.log('Contoh: npm start -- ./examples/package-old.json ./examples/package-new.json');
    process.exit(1);
  }

  const oldArg = args[0];
  const newArg = args[1];
  const oldPath = path.resolve(oldArg);
  const newPath = path.resolve(newArg);

  try {
    printHeader();
    printFileInfo(oldArg, newArg);

    const changes = comparePackageFiles(oldPath, newPath);

    if (changes.length === 0) {
      console.log('Tidak ada perubahan dependency.');
      return;
    }

    console.log(chalk.bold('Dependency Changes\n'));

    changes.forEach((change) => {
      printChange(change);
    });

    printRiskSummary(changes);
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
