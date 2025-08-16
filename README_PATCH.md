# Patch — LivreTo.be

Este pacote adiciona melhorias de performance, acessibilidade, dark mode consistente, PWA/offline e SEO **sem quebrar seu HTML/CSS/JS atual**.

## O que está incluído
- `css/theme.css` – variáveis de cor (claro/escuro), hover de tabela e estilo de botões de áudio.
- `js/speech.js` – utilitários robustos da Web Speech API (`window.speak()` e `window.getVoicesReady()`), com binding automático em botões `.audio-btn[data-say]`.
- `js/patches.js` – injeta metatags, JSON-LD, registra o Service Worker e adiciona pequenas melhorias de acessibilidade.
- `sw.js` – service worker simples com cache offline.
- `robots.txt` e `sitemap.xml` – prontos para `https://livreto.be/`.
- `404.html` – página 404 acessível e coerente com o tema.

## Como aplicar
1. **Copie** as pastas/arquivos deste patch para a raiz do repositório:  
   - `css/theme.css`  
   - `js/speech.js`  
   - `js/patches.js`  
   - `sw.js`  
   - `robots.txt` (substituir)  
   - `sitemap.xml` (substituir)  
   - `404.html` (opcional substituir)

2. **Edite seu `index.html`** (e, se quiser, `faq.html` / `sobre.html`) e garanta dentro de `<head>`:
   ```html
   <meta name="color-scheme" content="light dark">
   <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
   <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#0b0b10">
   <link rel="canonical" href="https://livreto.be/">
   <link rel="manifest" href="/manifest.json">
   <link rel="stylesheet" href="/css/theme.css">
   ```

3. **Antes de fechar o `</body>`**, inclua:
   ```html
   <script defer src="/js/patches.js"></script>
   <script defer src="/js/speech.js"></script>
   ```

4. **Garanta que seus botões de áudio** tenham a classe `.audio-btn` e (de preferência) `data-say="texto"`:
   ```html
   <button class="audio-btn" data-say="You are">Ouvir</button>
   ```
   > Você também pode seguir usando seu JavaScript atual chamando `window.speak(texto)`.

5. **Confirme o GitHub Pages** em *Settings → Pages* e, se necessário, faça um commit para disparar o deploy.

## Notas
- O Service Worker faz cache de: `/`, `/index.html`, CSS/JS principais e ícones. Ajuste a lista em `ASSETS` se quiser incluir mais arquivos.
- O `patches.js` só adiciona elementos **se não existirem**. É seguro mantê-lo.
- Se o site usar classes diferentes de `.table` e `.audio-btn`, você pode adaptar os seletores no `theme.css`.
