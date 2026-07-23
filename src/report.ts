import fs from 'fs';
import { DependencyChange, RiskLevel } from './types';

/**
 * Mengembalikan pesan rekomendasi berdasarkan tingkat risiko.
 */
export function getRecommendation(risk: RiskLevel): string {
  switch (risk) {
    case 'HIGH':
      return 'Review breaking changes and run all tests before updating.';
    case 'MEDIUM':
      return 'Review the update and run relevant tests.';
    case 'LOW':
      return 'Usually safe, but testing is still recommended.';
    case 'UNKNOWN':
    default:
      return 'Manual review is required because the version could not be analyzed.';
  }
}

/**
 * Membuat konten teks Markdown laporan perbandingan dependency.
 */
export function generateMarkdownReport(
  oldPath: string,
  newPath: string,
  changes: DependencyChange[]
): string {
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

  let md = `# SafeDep Dependency Report\n\n`;
  md += `Created by starmqdyy  \n`;
  md += `Repository: https://github.com/starmqdyy/safedep\n\n`;

  md += `## Files\n`;
  md += `- **Old**: ${oldPath}\n`;
  md += `- **New**: ${newPath}\n\n`;

  md += `## Summary\n`;
  md += `- **Total Changes**: ${changes.length}\n`;
  md += `- **HIGH Risk**: ${counts.HIGH}\n`;
  md += `- **MEDIUM Risk**: ${counts.MEDIUM}\n`;
  md += `- **LOW Risk**: ${counts.LOW}\n`;
  md += `- **UNKNOWN Risk**: ${counts.UNKNOWN}\n\n`;

  const categories: { title: string; risk: RiskLevel }[] = [
    { title: 'High Risk', risk: 'HIGH' },
    { title: 'Medium Risk', risk: 'MEDIUM' },
    { title: 'Low Risk', risk: 'LOW' },
    { title: 'Unknown Risk', risk: 'UNKNOWN' },
  ];

  categories.forEach(({ title, risk }) => {
    md += `## ${title}\n`;
    const filtered = changes.filter((c) => c.risk === risk);

    if (filtered.length === 0) {
      md += `No ${risk.toLowerCase()} risk changes detected.\n\n`;
    } else {
      filtered.forEach((c) => {
        md += `### ${c.name}\n`;
        md += `- **Status**: ${c.type.toUpperCase()}\n`;

        if (c.type === 'updated') {
          md += `- **Version**: \`${c.oldVersion}\` → \`${c.newVersion}\`\n`;
          const detail = c.versionChange ? ` (${c.versionChange} update)` : '';
          md += `- **Section**: \`${c.section}\`${detail}\n`;
        } else if (c.type === 'added') {
          md += `- **Version**: \`${c.newVersion}\`\n`;
          md += `- **Section**: \`${c.section}\`\n`;
        } else if (c.type === 'removed') {
          md += `- **Version**: \`${c.oldVersion}\`\n`;
          md += `- **Section**: \`${c.section}\`\n`;
        }

        md += `- **Risk Level**: ${c.risk}\n`;
        md += `- **Recommendation**: ${getRecommendation(c.risk)}\n\n`;
      });
    }
  });

  return md.trim() + '\n';
}

/**
 * Menulis laporan Markdown ke dalam file fisik di disk.
 */
export function writeMarkdownReport(
  outputPath: string,
  oldPath: string,
  newPath: string,
  changes: DependencyChange[]
): void {
  const content = generateMarkdownReport(oldPath, newPath, changes);
  fs.writeFileSync(outputPath, content, 'utf-8');
}
