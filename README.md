# Tech Tatu

Blog Astro estático, publicado em `https://lfsmariz.github.io/techtatu/`.

## Desenvolvimento

Requer Node.js 22 e pnpm 10:

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

O build de produção fica em `dist/`. O workflow do GitHub Actions publica o
site no GitHub Pages a cada push em `main`; o repositório deve estar configurado
para usar GitHub Actions como fonte do Pages.

## Conteúdo

Os artigos publicados em português e inglês são gerados no site e no RSS.
Rascunhos ficam fora do conteúdo migrado e não são publicados nem incluídos no
RSS. Mermaid, MDX, sitemap e localização continuam habilitados.
