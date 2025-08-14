# LivreTo.be — o livrinho aberto para dominar o verbo “to be”

[![Site](https://img.shields.io/badge/site-livreto.be-0b1020?logo=google-chrome&logoColor=white)](https://livreto.be)
[![Open Source](https://img.shields.io/badge/open--source-100%25-brightgreen.svg)](https://github.com/SEU_USUARIO/livretobe)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Slogan**: _LivreTo.be — o livrinho aberto para dominar o verbo “to be”._  
> **H1**: _Aprenda o verbo “to be” de graça_  
> **Sub**: _Explicações claras, exemplos em português, prática rápida e áudio. Código aberto, sem anúncios._

## ✨ Recursos
- Tabela completa do **verbo “to be”** com **ser/estar** em PT-BR
- **Tempos**: Presente, Passado, Futuro e Perfeito
- **Formas**: Afirmativa, Negativa, Pergunta e Pergunta negativa
- **Contrações** (I’m, you’re, wasn’t, won’t…)
- **Busca** + **filtros** por tempo e forma
- **Pronúncia com áudio (Web Speech API)**: escolha a voz e a velocidade
- Totalmente **open-source**, **gratuito** e **sem anúncios**

## 🧠 SEO pronto (on-page)
- `<title>` e `<meta name="description">` otimizados
- Canonical e `hreflang`
- **Open Graph / Twitter Cards** (`og:title`, `og:description`, `og:image`)
- **JSON-LD**: `WebSite` (com `SearchAction`), `SoftwareApplication` e `FAQPage`
- **Acessibilidade**: elementos semânticos (`nav`, `section`, `h1/h2`, ARIA)

## 🖼 Social preview
Use o arquivo [`og.png`](./og.png) (1200×630). Metas já configuradas no `<head>`:
```html
<meta property="og:image" content="https://livreto.be/og.png" />
<meta name="twitter:card" content="summary_large_image" />
```

## 🚀 Como usar localmente
1. Baixe o `index.html` (ou `livreto.be.html`) e abra no navegador.
2. Para editar, use qualquer editor (VS Code, etc). Não há build — é HTML/JS puro.

## ☁️ Deploy
### GitHub Pages
1. Crie um repositório e envie `index.html`, `og.png`, `robots.txt` e `sitemap.xml` para a **raiz** (branch `main`).
2. Em **Settings → Pages**, escolha **Deploy from a branch** e selecione `main` / root.
3. (Opcional) Em **Custom domain**, adicione **livreto.be** e configure o DNS:
   - **CNAME** do seu repositório (`SEU_USUARIO.github.io`).  
   - Ative **Enforce HTTPS**.

### Cloudflare Pages
- Crie um projeto apontando para o repositório e selecione a pasta raiz.  
- Em **Custom Domains**, adicione **livreto.be** e ative **SSL**.

### Netlify
- Arraste a pasta com `index.html` para o Netlify ou conecte o Git.  
- Em **Domain settings**, adicione **livreto.be**.

## 🧩 Estrutura mínima
```
/
├─ index.html        # página principal
├─ og.png            # imagem social (Open Graph/Twitter)
├─ robots.txt
└─ sitemap.xml
```

## 🤝 Como contribuir
1. Faça um **fork** deste repositório
2. Crie uma **branch**: `git checkout -b feat/minha-melhoria`
3. Commit: `git commit -m "feat: descreva sua mudança"`
4. **Push**: `git push origin feat/minha-melhoria`
5. Abra um **Pull Request** explicando o que mudou e por quê

**Boas práticas**:
- Mantenha o HTML **sem dependências** (carregamento rápido)
- Priorize **acessibilidade** (labels, ARIA, contraste)
- Inclua exemplos claros para PT-BR
- Teste a **Web Speech API** em Chrome/Edge

## 🔒 Privacidade
- Tudo roda **no navegador**, sem back-end e sem coleta de dados.
- Sem anúncios e sem trackers.

## 📄 Licença
**MIT**. Você pode usar, copiar, modificar e distribuir. Se preferir outra licença (ex.: CC BY 4.0), ajuste o arquivo `LICENSE`.

---

Feito com 💙 por pessoas que acreditam em educação aberta.  
**Site**: https://livreto.be
