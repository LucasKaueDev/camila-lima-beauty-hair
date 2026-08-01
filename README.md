# Camila Lima Beauty Hair

Site institucional estático da Camila Lima Beauty Hair, salão de beleza em Itaquaquecetuba - SP, com seções de serviços, pacotes, galeria, depoimentos e contato via WhatsApp/Instagram.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Font Awesome via CDN
- Google Fonts via CDN
- Node.js apenas para validação e preview local

## Estrutura

```text
.
├── assets/images/        # Imagens, SVGs e logotipo
├── css/style.css         # Estilos do site
├── javascript/script.js  # Menu mobile, galeria e depoimentos
├── scripts/              # Validação de build e servidor de preview
├── index.html            # Página principal
├── robots.txt            # Regras de indexação
├── vercel.json           # Configuração de rotas para produção
└── DEPLOY.md             # Guia específico de deploy
```

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O site ficará disponível em:

```text
http://127.0.0.1:4173
```

## Build

Este projeto é estático e não gera pasta `dist`. O build executa uma validação de produção para conferir arquivos obrigatórios, SEO básico, âncoras internas e referências locais.

```bash
npm run build
```

## Preview

```bash
npm run preview
```

O preview local usa fallback para `index.html`, simulando o comportamento esperado na Vercel para URLs internas.

## Rotas

O site usa uma única página (`index.html`) com navegação por âncoras, como `#servicos`, `#galeria` e `#contato`.

O arquivo `vercel.json` adiciona fallback para que acessos diretos como `/servicos`, `/galeria` ou `/contato` carreguem a página inicial em vez de retornar 404. Assets em `/assets`, `/css` e `/javascript` continuam sendo servidos diretamente.

## Vercel

Use estas configurações no painel da Vercel:

- Framework Preset: `Other`
- Root Directory: raiz do repositório
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.`
- Node.js: 18.x ou superior
- Variáveis de ambiente: nenhuma

Importante: não configure `frontend`, `dist`, `public` ou outra subpasta como Root Directory/Output Directory. O `index.html` está na raiz do repositório.

## Alterar Conteúdo

- Textos principais: edite `index.html`.
- Cores, espaçamentos e responsividade: edite `css/style.css`.
- Galeria, menu mobile e carrosséis: edite `javascript/script.js`.
- Imagens: adicione ou substitua arquivos em `assets/images/` e atualize os caminhos no HTML.
- WhatsApp/Instagram: procure por `wa.me` e `instagram.com/camilalimabeautyhair` em `index.html`.

## Checklist Antes Do Deploy

```bash
git status
npm install
npm run build
npm run preview
```

Depois, conferir no navegador:

- Página inicial
- Menu mobile
- Seções por âncora
- Galeria e lightbox
- Depoimentos
- Botões de WhatsApp
- Links de Instagram e Google Maps
- URLs diretas como `/servicos`, `/galeria` e `/contato`

## Correção Do 404

O projeto foi reorganizado recentemente: o `index.html` saiu de subpastas antigas e passou a ficar na raiz do repositório, enquanto as imagens foram movidas para `assets/images/`.

Se a Vercel continuar configurada com Root Directory antigo, como `frontend`, ou Output Directory como `dist`, o deploy publica a pasta errada ou uma saída inexistente e retorna 404.

As correções aplicadas foram:

- Padronização dos caminhos locais como root-relative (`/assets/...`, `/css/...`, `/javascript/...`).
- Inclusão de `vercel.json` com fallback seguro para site estático.
- Criação de scripts de validação e preview sem dependências.
- Documentação das configurações corretas da Vercel.

## Problemas Comuns

- 404 na página inicial: verifique se o Root Directory é a raiz do repositório.
- 404 após build: verifique se Output Directory é `.` e não `dist`.
- CSS ou imagens não carregam em URLs internas: confirme se o deploy contém o `vercel.json` atualizado.
- Imagem quebrada em produção: confira letras maiúsculas/minúsculas e acentos no nome do arquivo.
- Alteração não aparece na Vercel: confirme se o deploy está usando a branch `main`.
