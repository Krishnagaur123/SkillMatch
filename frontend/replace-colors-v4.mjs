import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if ((dirPath.endsWith('.css') || dirPath.endsWith('.tsx')) && !dirPath.includes('index.css')) {
      callback(dirPath);
    }
  });
}

const semanticReplacements = {
  '--bg-page': '--surface-background',
  '--bg-surface': '--surface-primary',
  '--color-brand-primary': '--color-brand',
  // Some stray tokens from old system might still exist
  '--bg-card': '--surface-primary',
  '--bg-subtle': '--surface-hover',
  '--text-muted': '--text-secondary',
  '--border-strong': '--border-hover'
};

const hardcodedReplacements = [
  { regex: /rgba\(0,\s*0,\s*0,\s*0\.[0-9]+\)/g, replacement: 'var(--border-default)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g, replacement: 'var(--surface-hover)' },
  { regex: /rgba\(37,\s*99,\s*235,\s*0\.[0-9]+\)/g, replacement: 'color-mix(in srgb, var(--color-brand) 15%, transparent)' },
  { regex: /rgba\(16,\s*185,\s*129,\s*0\.[0-9]+\)/g, replacement: 'color-mix(in srgb, var(--color-success) 15%, transparent)' },
  { regex: /rgba\(245,\s*158,\s*11,\s*0\.[0-9]+\)/g, replacement: 'color-mix(in srgb, var(--color-warning) 15%, transparent)' },
  { regex: /rgba\(239,\s*68,\s*68,\s*0\.[0-9]+\)/g, replacement: 'color-mix(in srgb, var(--color-error) 15%, transparent)' },
  // Common stray hexes in older code
  { regex: /#F9FAFB/gi, replacement: 'var(--surface-background)' },
  { regex: /#FFFFFF/gi, replacement: 'var(--surface-primary)' },
  { regex: /#F3F4F6/gi, replacement: 'var(--surface-hover)' },
  { regex: /#E5E7EB/gi, replacement: 'var(--border-default)' },
  { regex: /#D1D5DB/gi, replacement: 'var(--border-hover)' },
  { regex: /#111827/gi, replacement: 'var(--text-heading)' },
  { regex: /#374151/gi, replacement: 'var(--text-primary)' },
  { regex: /#6B7280/gi, replacement: 'var(--text-secondary)' },
  { regex: /#0F172A/gi, replacement: 'var(--surface-background)' },
  { regex: /#1E293B/gi, replacement: 'var(--surface-primary)' },
  { regex: /#334155/gi, replacement: 'var(--surface-hover)' },
  { regex: /#475569/gi, replacement: 'var(--border-hover)' },
  { regex: /#F8FAFC/gi, replacement: 'var(--text-heading)' },
  { regex: /#E2E8F0/gi, replacement: 'var(--text-primary)' },
  { regex: /#94A3B8/gi, replacement: 'var(--text-secondary)' },
  { regex: /#2563EB/gi, replacement: 'var(--color-brand)' },
  { regex: /#10B981/gi, replacement: 'var(--color-success)' },
  { regex: /#F59E0B/gi, replacement: 'var(--color-warning)' },
  { regex: /#EF4444/gi, replacement: 'var(--color-error)' }
];

let auditedFiles = [];

walkDir('src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Rename variables
  for (const [oldVar, newVar] of Object.entries(semanticReplacements)) {
    content = content.split(oldVar).join(newVar);
  }

  // 2. Replace exact hex colors that might have been hardcoded inside component TSX/CSS
  // Be careful with SVGs that might have fill="#FFFFFF", but actually we should use var(--surface-primary)
  for (const rule of hardcodedReplacements) {
    content = content.replace(rule.regex, rule.replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    auditedFiles.push(filePath);
  }
});

console.log('Migrated the following files to strict tokens:');
auditedFiles.forEach(f => console.log(f));
