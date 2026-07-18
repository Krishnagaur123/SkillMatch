import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.css') && !dirPath.includes('index.css')) {
      callback(dirPath);
    }
  });
}

function replaceColors(content) {
  // Red/Error variants
  content = content.replace(/oklch\(0\.99 0\.01 25\)/g, 'color-mix(in srgb, var(--color-error) 5%, transparent)');
  content = content.replace(/oklch\(0\.95 0\.05 25\)/g, 'color-mix(in srgb, var(--color-error) 15%, transparent)');
  content = content.replace(/oklch\(0\.90 0\.08 25\)/g, 'color-mix(in srgb, var(--color-error) 25%, transparent)');
  content = content.replace(/oklch\(0\.6 0\.15 25\)/g, 'var(--color-error)');
  content = content.replace(/oklch\(0\.40 0\.15 25\)/g, 'var(--color-error)');
  content = content.replace(/oklch\(0\.65 0\.15 25\)/g, 'var(--color-error)');
  content = content.replace(/oklch\(0\.23 0\.05 25\)/g, 'color-mix(in srgb, var(--color-error) 20%, transparent)');

  // Amber/Warning variants
  content = content.replace(/oklch\(0\.40 0\.15 80\)/g, 'var(--color-warning)');
  content = content.replace(/oklch\(0\.75 0\.15 85\)/g, 'var(--color-warning)');

  // Green/Success variants
  content = content.replace(/oklch\(0\.94 0\.03 140\)/g, 'color-mix(in srgb, var(--color-success) 15%, transparent)');
  content = content.replace(/oklch\(0\.40 0\.15 140\)/g, 'var(--color-success)');
  content = content.replace(/oklch\(0\.7 0\.15 145\)/g, 'var(--color-success)');

  // Blue/Brand variants
  content = content.replace(/oklch\(0\.20 0\.03 265\)/g, 'color-mix(in srgb, var(--color-brand-primary) 15%, transparent)');

  // Purple/Info variants
  content = content.replace(/oklch\(0\.65 0\.12 145\)/g, 'var(--color-brand-primary)');
  content = content.replace(/oklch\(0\.27 0\.08 145\)/g, 'color-mix(in srgb, var(--color-brand-primary) 20%, transparent)');
  content = content.replace(/oklch\(0\.85 0\.1 145\)/g, 'var(--color-brand-primary)');
  content = content.replace(/oklch\(0\.8 0\.1 145\)/g, 'var(--color-brand-primary)');
  content = content.replace(/oklch\(0\.23 0\.04 145\)/g, 'color-mix(in srgb, var(--color-brand-primary) 10%, transparent)');

  // Dark grays (Landing mock UI)
  content = content.replace(/oklch\(0\.12 0 0\)/g, 'var(--bg-card)');
  content = content.replace(/oklch\(0\.15 0 0\)/g, 'var(--bg-card)');
  content = content.replace(/oklch\(0\.16 0 0\)/g, 'var(--bg-subtle)');
  content = content.replace(/oklch\(0\.20 0 0\)/g, 'var(--bg-subtle)');
  content = content.replace(/oklch\(0\.25 0 0\)/g, 'var(--border-default)');
  content = content.replace(/oklch\(0\.27 0\.07 80\)/g, 'var(--bg-subtle)');
  content = content.replace(/oklch\(0\.28 0 0\)/g, 'var(--border-strong)');
  content = content.replace(/oklch\(0\.30 0 0\)/g, 'var(--border-strong)');
  content = content.replace(/oklch\(0\.45 0 0\)/g, 'var(--text-muted)');
  
  // Light grays / text
  content = content.replace(/oklch\(0\.5 0 0\)/g, 'var(--text-muted)');
  content = content.replace(/oklch\(0\.55 0 0\)/g, 'var(--text-muted)');
  content = content.replace(/oklch\(0\.6 0 0\)/g, 'var(--text-secondary)');
  content = content.replace(/oklch\(0\.7 0 0\)/g, 'var(--text-secondary)');
  content = content.replace(/oklch\(0\.8 0 0\)/g, 'var(--text-primary)');
  content = content.replace(/oklch\(0\.9 0 0\)/g, 'var(--text-primary)');
  content = content.replace(/oklch\(0\.85 0\.1 80\)/g, 'var(--text-primary)');

  // rgba masks
  content = content.replace(/background-color:\s*oklch\(0 0 0 \/ 0\.5\);/g, 'background-color: color-mix(in srgb, var(--bg-card) 50%, transparent);');
  content = content.replace(/oklch\(0 0 0 \/ 0\.[0-9]+\)/g, 'var(--shadow-md)');

  return content;
}

walkDir('src', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceColors(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
