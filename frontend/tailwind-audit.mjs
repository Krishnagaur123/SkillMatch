import fs from 'fs';
import path from 'path';

let utilityCounts = {};
let fileOccurrences = {};

const colorRegex = /\b(bg|text|border|ring|shadow)-(white|black|transparent|slate|gray|blue|red|yellow|green|emerald|amber|rose)[-\d]*\b/g;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

walkDir('src', (filePath) => {
  // Skip AuthPage and CompanyLogo for allowed exceptions
  if (filePath.includes('AuthPage.tsx') || filePath.includes('CompanyLogo.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let matches = content.match(colorRegex);
  
  if (matches) {
    // Unique matches in this file
    matches.forEach(match => {
      utilityCounts[match] = (utilityCounts[match] || 0) + 1;
      
      if (!fileOccurrences[match]) fileOccurrences[match] = new Set();
      fileOccurrences[match].add(filePath);
    });
  }
});

let report = [];
report.push('| Utility | Usage Count | Files |');
report.push('| :--- | :--- | :--- |');

Object.keys(utilityCounts)
  .sort((a, b) => utilityCounts[b] - utilityCounts[a])
  .forEach(util => {
    let files = Array.from(fileOccurrences[util]);
    let fileStr = files.length > 2 
      ? `${path.basename(files[0])}, ${path.basename(files[1])} +${files.length - 2} more`
      : files.map(f => path.basename(f)).join(', ');
      
    report.push(`| \`${util}\` | ${utilityCounts[util]} | ${fileStr} |`);
  });

fs.writeFileSync('tailwind_audit_report.md', report.join('\n'), 'utf-8');
console.log('Tailwind audit complete. Written to tailwind_audit_report.md');
