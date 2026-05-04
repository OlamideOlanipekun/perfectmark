const fs = require('fs');
const path = 'c:\\Users\\Olamide\\Desktop\\perfectmark\\src\\components\\marketing\\hero.tsx';
const content = fs.readFileSync(path, 'utf8');
console.log('File length:', content.length);
console.log('First 50 chars:', JSON.stringify(content.substring(0, 50)));
for (let i = 0; i < 50; i++) {
  console.log(`Char at ${i}: ${content[i]} (${content.charCodeAt(i)})`);
}
