import fs from 'fs';
import path from 'path';

let results = {
  tailwind: [],
  hardcoded: [],
  deprecated: []
};

const tailwindRegex = /\b(bg-white|text-gray-[0-9]+|bg-gray-[0-9]+|text-slate-[0-9]+|bg-slate-[0-9]+|border-slate-[0-9]+|text-blue-[0-9]+|bg-blue-[0-9]+)\b/g;
const hardcodedRegex = /(#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\(|hsla?\(|oklch\()/gi;
const deprecatedRegex = /--(bg-page|bg-card|bg-surface\b|bg-subtle|text-muted|border-strong|color-brand-primary|border-base)\b/g;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (dirPath.match(/\.(css|tsx|ts)$/)) {
      callback(dirPath);
    }
  });
}

walkDir('src', (filePath) => {
  if (filePath.includes('index.css')) return; // skip base tokens

  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  lines.forEach((line, index) => {
    let text = line.trim();
    if (!text) return;

    if (text.match(tailwindRegex)) {
      results.tailwind.push({ file: filePath, line: index + 1, text });
    }
    
    // Check for hardcoded (excluding color-mix and allowed SVG brand colors)
    let isBrandSvg = filePath.includes('AuthPage.tsx') && text.includes('fill="#');
    let isColorMix = text.includes('color-mix');
    
    if (text.match(hardcodedRegex) && !isBrandSvg && !isColorMix) {
      results.hardcoded.push({ file: filePath, line: index + 1, text });
    }

    if (text.match(deprecatedRegex)) {
      results.deprecated.push({ file: filePath, line: index + 1, text });
    }
  });
});

fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2), 'utf-8');
console.log('Audit complete.');
