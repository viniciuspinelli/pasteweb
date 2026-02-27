# Deploy no Render

Este projeto está configurado para deploy no Render.

## Estrutura

- `public/` - Arquivos estáticos (HTML, CSS, JS)
- `server/` - Código do servidor Express
- `src/` - Código fonte da aplicação
- `assets/` - Imagens, fontes e outros recursos

## Como funciona

### Para sites estáticos:
1. Coloque seus arquivos HTML, CSS, JS na pasta `public/`
2. Render vai servir esses arquivos automaticamente

### Para aplicações Node.js:
1. O servidor Express está configurado em `server/index.js`
2. Ele serve os arquivos estáticos da pasta `public/`
3. Configure sua aplicação na pasta `src/`

## Deploy

1. Faça push deste repositório para GitHub/GitLab
2. Conecte seu repositório no Render
3. Configure o serviço como "Web Service"
4. Render vai fazer deploy automático

## Variáveis de Ambiente

Render automaticamente define:
- `PORT` - Porta onde o servidor deve rodar
- `NODE_ENV` - Ambiente (production, development)