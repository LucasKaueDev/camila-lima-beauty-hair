# Deploy Na Vercel

## Configuração Recomendada

- Framework Preset: `Other`
- Root Directory: raiz do repositório
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.`
- Node.js: 18.x ou superior
- Branch de produção: `main`
- Variáveis de ambiente: nenhuma

## Passo A Passo

1. Garanta que o projeto está na branch correta:

```bash
git branch --show-current
```

2. Instale e valide:

```bash
npm install
npm run build
```

3. Teste o preview local:

```bash
npm run preview
```

4. Abra estas URLs localmente:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/servicos
http://127.0.0.1:4173/galeria
http://127.0.0.1:4173/contato
```

5. Publique as alterações:

```bash
git status
git add .
git commit -m "fix: corrigir erro 404 e preparar deploy na Vercel"
git push origin main
```

## Sobre O 404

Este site não usa Vite, React ou Next.js. Ele é uma aplicação estática servida a partir do `index.html` na raiz.

A Vercel deve publicar a raiz do repositório. Caso o projeto esteja configurado para publicar uma pasta antiga, como `frontend`, ou uma pasta de build inexistente, como `dist`, o resultado esperado é 404.

O fallback no `vercel.json` garante que URLs internas sem arquivo físico carreguem `/index.html`, preservando assets reais em `/assets`, `/css` e `/javascript`.

## Domínio E SEO

Quando o domínio final estiver confirmado, adicione:

- URL canônica absoluta em `index.html`.
- `og:url` em `index.html`.
- `sitemap.xml` com a URL final.
- Referência ao sitemap em `robots.txt`.
