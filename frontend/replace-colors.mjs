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
  // Replace shadows
  content = content.replace(/box-shadow:\s*0\s+1px\s+3px\s+(oklch|rgba)\([^)]+\);/g, 'box-shadow: var(--shadow-sm);');
  content = content.replace(/box-shadow:\s*0\s+4px\s+1[0-9]px\s+(oklch|rgba)\([^)]+\);/g, 'box-shadow: var(--shadow-md);');
  content = content.replace(/box-shadow:\s*0\s+[1-9][0-9]px\s+[1-9][0-9]px\s+(oklch|rgba)\([^)]+\);/g, 'box-shadow: var(--shadow-lg);');
  
  // More complex shadows
  content = content.replace(/box-shadow:[^;]*oklch\(0 0 0 \/ 0\.[0-9]+\)[^;]*;/g, 'box-shadow: var(--shadow-md);');
  content = content.replace(/box-shadow:[^;]*oklch\(from var\(--accent\) l c h \/ 0\.12\)[^;]*;/g, 'box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary) 12%, transparent);');
  
  // Backgrounds with opacity
  content = content.replace(/oklch\(1 0 0 \/ 0\.85\)/g, 'color-mix(in srgb, var(--bg-card) 85%, transparent)');
  content = content.replace(/oklch\(1 0 0 \/ 0\.92\)/g, 'color-mix(in srgb, var(--bg-card) 92%, transparent)');

  // Status colors
  // Error
  content = content.replace(/oklch\(0\.55 0\.18 20\)/g, 'var(--color-error)');
  content = content.replace(/oklch\(0\.55 0\.18 20 \/ 0\.1\)/g, 'color-mix(in srgb, var(--color-error) 10%, transparent)');
  content = content.replace(/oklch\(0\.55 0\.18 20 \/ 0\.2\)/g, 'color-mix(in srgb, var(--color-error) 20%, transparent)');
  content = content.replace(/rgba\(239,\s*68,\s*68,\s*0\.05\)/g, 'color-mix(in srgb, var(--color-error) 5%, transparent)');
  content = content.replace(/rgba\(239,\s*68,\s*68,\s*0\.2\)/g, 'color-mix(in srgb, var(--color-error) 20%, transparent)');
  
  // Success
  content = content.replace(/oklch\(0\.95 0\.06 140\)/g, 'color-mix(in srgb, var(--color-success) 15%, transparent)');
  content = content.replace(/oklch\(0\.35 0\.15 140\)/g, 'var(--color-success)');
  content = content.replace(/oklch\(0\.90 0\.08 140\)/g, 'color-mix(in srgb, var(--color-success) 30%, transparent)');
  content = content.replace(/oklch\(0\.97 0\.02 140\)/g, 'color-mix(in srgb, var(--color-success) 10%, transparent)');
  content = content.replace(/oklch\(0\.40 0\.12 140\)/g, 'var(--color-success)');
  content = content.replace(/oklch\(0\.90 0\.05 140\)/g, 'color-mix(in srgb, var(--color-success) 30%, transparent)');
  content = content.replace(/oklch\(0\.5 0\.15 140\)/g, 'var(--color-success)');
  
  // Warning/Amber
  content = content.replace(/oklch\(0\.95 0\.05 80\)/g, 'color-mix(in srgb, var(--color-warning) 15%, transparent)');
  content = content.replace(/oklch\(0\.35 0\.15 80\)/g, 'var(--color-warning)');
  content = content.replace(/oklch\(0\.90 0\.08 80\)/g, 'color-mix(in srgb, var(--color-warning) 30%, transparent)');
  content = content.replace(/oklch\(0\.55 0\.15 80\)/g, 'var(--color-warning)');

  // Generic purples/info/misc mapped to primary
  content = content.replace(/oklch\(0\.62 0\.17 145\)/g, 'var(--color-brand-primary)');
  
  // Random gray hardcodes
  content = content.replace(/oklch\(0\.22 0 0\)/g, 'var(--border-strong)');
  content = content.replace(/oklch\(0\.95 0 0\)/g, 'var(--text-primary)');
  content = content.replace(/oklch\(0\.65 0 0\)/g, 'var(--text-secondary)');
  content = content.replace(/oklch\(0\.98 0 0\)/g, 'var(--bg-page)');

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
