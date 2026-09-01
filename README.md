# Termatika

Termo com equações matemáticas, em dois modos:

- **Adivinhar**: descubra a equação secreta de 8 caracteres (estilo Nerdle).
- **Resultado**: os operadores e o resultado já vêm dados — preencha os números
  até a conta fechar, com até 6 tentativas.

## Estrutura do projeto

```
├── index.html          → frontend (estrutura da página)
├── styles.css          → frontend (visual)
├── app.js              → frontend (lógica de interface, chama a API)
├── api/
│   ├── _lib/
│   │   ├── crypto.js     → cifra/decifra o token de sessão do jogo
│   │   └── equation.js   → geração e validação das equações
│   ├── guess/
│   │   ├── new.js         → POST: cria um jogo novo (modo Adivinhar)
│   │   └── guess.js       → POST: recebe um palpite, devolve o feedback
│   └── target/
│       ├── new.js         → POST: cria um desafio novo (modo Resultado)
│       └── check.js       → POST: confere se os números preenchidos fecham
├── package.json
└── .gitignore
```

A equação secreta (modo Adivinhar) nunca é enviada ao navegador. Ela fica
guardada dentro de um token cifrado (AES-256-GCM) que o próprio cliente
carrega de requisição em requisição — assim o servidor não precisa de banco
de dados para "lembrar" o jogo, e ninguém consegue ler a equação abrindo o
DevTools.

## Como publicar na Vercel

### Opção 1 — pelo site
1. Suba esta pasta para um repositório no GitHub (ou GitLab/Bitbucket).
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e
   importe o repositório.
3. Framework preset: **Other** (não precisa de build command nem de
   output directory — é só HTML/CSS/JS estático + funções em `/api`).
4. Antes do primeiro deploy (ou depois, em *Settings → Environment
   Variables*), adicione:
   - `GAME_SECRET` → uma string longa e aleatória (ex: gere uma com
     `openssl rand -hex 32`). Sem isso o projeto ainda funciona, mas usa uma
     chave padrão de desenvolvimento — troque antes de ir para produção.
5. Clique em **Deploy**.

### Opção 2 — pela CLI
```bash
npm i -g vercel
cd termatika
vercel            # segue o passo a passo, cria o projeto
vercel env add GAME_SECRET production   # cole uma string aleatória longa
vercel --prod     # publica em produção
```

## Rodando localmente

```bash
npm i -g vercel
cd termatika
vercel dev
```
Isso sobe o site e as funções de `/api` juntos em `http://localhost:3000`,
do mesmo jeito que roda na Vercel.
