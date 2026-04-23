const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (/\.(js|jsx|ts|tsx)$/.test(file)) results.push(file);
    }
  });
  return results;
}

const srcDir = path.join(__dirname, '..', 'client', 'src');
const localePath = path.join(__dirname, '..', 'client', 'src', 'locales', 'en.json');

if (!fs.existsSync(srcDir)) {
  console.error('Source directory not found:', srcDir);
  process.exit(1);
}
if (!fs.existsSync(localePath)) {
  console.error('Locale file not found:', localePath);
  process.exit(1);
}

const files = walk(srcDir);
const regex = /(?<![A-Za-z0-9_$])t\(\s*['"`]([A-Za-z0-9_.-]+?)['"`]\s*\)/g;
const used = new Set();

files.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = regex.exec(content))) {
      used.add(m[1]);
    }
  } catch (e) {
    // ignore
  }
});

function flatten(obj, prefix = '') {
  const res = [];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const key = prefix ? prefix + '.' + k : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      res.push(...flatten(val, key));
    } else {
      res.push(key);
    }
  }
  return res;
}

function addNested(obj, key, value) {
  const parts = key.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      if (cur[p] === undefined) cur[p] = value;
    } else {
      if (cur[p] === undefined || typeof cur[p] !== 'object') cur[p] = {};
      cur = cur[p];
    }
  }
}

let en;
try {
  en = JSON.parse(fs.readFileSync(localePath, 'utf8'));
} catch (e) {
  console.error('Failed to parse en.json:', e.message);
  process.exit(1);
}

const existing = new Set(flatten(en));
const usedKeys = [...used].sort();
const added = [];

usedKeys.forEach(k => {
  if (!existing.has(k)) {
    const last = k.split('.').slice(-1)[0];
    const placeholder = last.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    addNested(en, k, placeholder);
    added.push(k);
    existing.add(k);
  }
});

if (added.length > 0) {
  fs.writeFileSync(localePath, JSON.stringify(en, null, 2) + '\n', 'utf8');
}

console.log(JSON.stringify({ added }, null, 2));
