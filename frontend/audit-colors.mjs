import fs from 'fs';
import path from 'path';

let issues = [];

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

walkDir('src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check for hardcoded colors
    if (line.match(/(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\()/)) {
      // Ignore color-mix
      if (!line.includes('color-mix')) {
        issues.push(`${filePath}:${index + 1}: ${line.trim()}`);
      }
    }
  });
});

if (issues.length > 0) {
  console.log('AUDIT FAILED: Hardcoded colors found:');
  issues.forEach(i => console.log(i));
} else {
  console.log('AUDIT PASSED: No hardcoded colors found outside of index.css.');
}
