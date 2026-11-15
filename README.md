# Tech Tatu

Blog Astro estático, publicado em `https://www.techtatu.com/`.

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

### Domínio

O domínio personalizado do GitHub Pages é `www.techtatu.com`. No Cloudflare,
mantenha o registro como **DNS only** e crie somente este registro:

```text
Tipo: CNAME
Nome: www
Destino: lfsmariz.github.io
```

O destino é apenas `lfsmariz.github.io`, sem esquema (`https://`) ou caminho.
Configure `www.techtatu.com` como domínio personalizado nas configurações do
GitHub Pages do repositório.

## Conteúdo

Os artigos publicados em português e inglês são gerados no site e no RSS.
Rascunhos ficam fora do conteúdo migrado e não são publicados nem incluídos no
RSS. Mermaid, MDX, sitemap e localização continuam habilitados.
