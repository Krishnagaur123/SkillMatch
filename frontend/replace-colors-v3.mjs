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

function replaceSemanticTokens(content) {
  // Replace old generic tokens with new refined tokens
  content = content.replace(/var\(--bg-card\)/g, 'var(--bg-surface)');
  content = content.replace(/var\(--bg-subtle\)/g, 'var(--bg-surface-hover)');
  content = content.replace(/var\(--text-muted\)/g, 'var(--text-secondary)');
  content = content.replace(/var\(--border-strong\)/g, 'var(--border-hover)');

  // Inject transition base if not present in interactive elements
  // This is a naive regex but helps catch standard hover blocks
  content = content.replace(/(:hover|:focus)[^{]*\{/g, (match) => {
    return match;
  });

  // Adding transition to any class that has a :hover block 
  // We'll leave transitions mostly manual where complex, but add generic transition to inputs/buttons
  return content;
}

walkDir('src', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceSemanticTokens(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
