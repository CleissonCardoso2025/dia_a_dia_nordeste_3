const fs = require('fs');
const path = require('path');

const regex = /([\u00C2-\u00DF][\u0080-\u00BF])|([\u00E0-\u00EF][\u0080-\u00BF][\u0080-\u00BF])|([\u00F0-\u00F4][\u0080-\u00BF][\u0080-\u00BF][\u0080-\u00BF])/g;

function fixGarbled(content) {
  return content.replace(regex, (match) => {
    try {
      const fixed = Buffer.from(match, 'latin1').toString('utf8');
      if (fixed.includes('\uFFFD')) return match; // invalid utf8
      return fixed;
    } catch(e) {
      return match;
    }
  });
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.mjs')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const fixed = fixGarbled(original);
      if (original !== fixed) {
        fs.writeFileSync(fullPath, fixed, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
