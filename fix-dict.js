const fs = require('fs');
const path = require('path');

const replacements = {
  "Ã‰": "É",
  "Ã‡Ãƒ": "ÇÃ",
  "ATENÃ‡ÃƒO": "ATENÇÃO",
  "PRÃ‰VIO": "PRÉVIO",
  "VEICULAÃ‡ÃƒO": "VEICULAÇÃO",
  "Ãšltimas": "Últimas",
  "SEÃ‡ÃƒO": "SEÇÃO",
  "âš ️": "⚠️",
  "âš ": "⚠️",
  "â”€â”€": "──",
  "Ã§Ã£o": "ção",
  "Ã§Ã£": "çã",
  "Ã§Ãµ": "çõ",
  "â€”": "—",
  "â€“": "–",
  "Ãš": "Ú",
  "Ã‡": "Ç",
  "Ãƒ": "Ã",
  "Ã": "Í", // Wait, Ã without anything?
  "Ã\u008D": "Í",
  "CÃ³digo": "Código",
  "Ã“": "Ó",
  "Ã‚": "Â",
  "ÃŠ": "Ê",
  "Ã”": "Ô",
  "Ãœ": "Ü",
  "â€œ": "“",
  "â€\u009D": "”",
  "â€": "”"
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.mjs')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed dictionary:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
