const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "css/style.css",
  "javascript/script.js",
  "vercel.json",
  "robots.txt"
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function existsLocal(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

for (const file of requiredFiles) {
  if (!existsLocal(file)) fail(`Arquivo obrigatório ausente: ${file}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");

const checks = [
  { label: "lang pt-BR", ok: /<html\s+lang="pt-BR"/i.test(html) },
  { label: "meta viewport", ok: /<meta\s+name="viewport"/i.test(html) },
  { label: "title", ok: /<title>[^<]+<\/title>/i.test(html) },
  { label: "meta description", ok: /<meta\s+name="description"\s+content="[^"]{40,}"/i.test(html) },
  { label: "Open Graph title", ok: /property="og:title"/i.test(html) },
  { label: "script principal", ok: /src="\/javascript\/script\.js"/i.test(html) },
  { label: "stylesheet principal", ok: /href="\/css\/style\.css"/i.test(html) },
  { label: "sem overflow horizontal intencional", ok: /overflow-x:\s*hidden/i.test(css) }
];

for (const check of checks) {
  if (!check.ok) fail(`Verificação falhou: ${check.label}`);
}

const references = [];
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  references.push({ file: "index.html", value: match[1] });
}
for (const match of css.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
  references.push({ file: "css/style.css", value: match[2] });
}

function toLocalReference(value) {
  if (!value || /^(https?:|mailto:|tel:|#|data:)/i.test(value)) return null;
  const clean = value.split("#")[0].split("?")[0];
  if (!clean) return null;
  return decodeURI(clean.replace(/^\//, ""));
}

for (const reference of references) {
  const local = toLocalReference(reference.value);
  if (!local) continue;

  if (!existsLocal(local)) {
    fail(`Referência inexistente em ${reference.file}: ${reference.value}`);
  }
}

const localPageLinks = Array.from(html.matchAll(/href="([^"]+)"/g))
  .map((match) => match[1])
  .filter((href) => href.startsWith("#"));

for (const href of localPageLinks) {
  const id = href.slice(1);
  if (!id) continue;
  const idPattern = new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (!idPattern.test(html)) fail(`Âncora sem seção correspondente: ${href}`);
}

if (failures.length > 0) {
  console.error("Build de validação falhou:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Build de validação concluído com sucesso.");
console.log(`Referências locais verificadas: ${references.map((item) => toLocalReference(item.value)).filter(Boolean).length}`);
