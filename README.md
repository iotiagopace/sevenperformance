# Seven Performance — Site estático

Pacote pronto para subir em um repositório GitHub e publicar como site estático.

## Estrutura

- `index.html` — página principal com navegação por URLs reais.
- `quem-somos/`, `solucoes/`, `blog/`, `contato/` — cópias estáticas com metadados próprios para SEO e compartilhamento.
- `blog/*/` — artigos com URLs próprias, datas estruturadas e metadados sociais.
- `404.html` — fallback para navegação direta em hospedagens estáticas.
- `Syne-VariableFont_wght.ttf` — fonte display usada nos títulos.
- `Manrope-VariableFont_wght.ttf` — fonte de corpo.
- `assets/` — arquivos de apoio e identidade visual enviados no projeto.
- `.nojekyll` — evita interferência do Jekyll no GitHub Pages.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No GitHub, vá em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch principal, normalmente `main`, e a pasta `/root`.
6. Salve e aguarde a URL pública ser gerada.

## Publicação via Git

```bash
git init
git add .
git commit -m "Publica site Seven Performance"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

## Observações

O HTML busca as fontes locais na raiz do site. Por isso, mantenha os arquivos `.ttf` na raiz do projeto ou ajuste os caminhos no `@font-face`.

As imagens de Open Graph ficam em `assets/og-*.png` no formato 1200×630.

O rodapé contém o crédito externo: **Desenvolvido por metry.cc**.
