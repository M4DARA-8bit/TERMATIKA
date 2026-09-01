# Termatika + MathGol

Uma suíte de dois jogos educativos de matemática, no mesmo site/deploy:

- **[Termatika](/)** — Termo com equações matemáticas, em dois modos:
  - *Adivinhar*: descubra a equação secreta de 8 caracteres (estilo Nerdle).
  - *Resultado*: os operadores e o resultado já vêm dados — preencha os
    números até a conta fechar, com até 6 tentativas.
- **[MathGol](/mathgol/)** — cobranças de pênalti com desafios de matemática.
  O jogador escolhe a série (1º ao 6º ano) e as contas se ajustam à
  dificuldade daquele ano escolar.

Os dois têm um link um pro outro (no topo do Termatika, e "← Voltar" no
menu do MathGol), então dá pra navegar entre eles sem sair do site.

## Estrutura do projeto

```
├── index.html            → Termatika: página
├── styles.css             → Termatika: visual
├── app.js                 → Termatika: lógica de interface (chama a API)
│
├── mathgol/                → MathGol: front-end estático completo
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css       → paleta, tipografia, modos de acessibilidade
│   │   └── style.css
│   └── js/
│       ├── math.js          → gera as contas por série (1º ao 6º ano)
│       ├── menu.js           → fluxo de telas e estado do jogo
│       ├── accessibility.js  → narração + toggles de acessibilidade
│       ├── nicknameGenerator.js → apelido (personagem + animal, sem texto livre)
│       ├── api.js            → chamadas para /api/session e /api/progress
│       └── game/PenaltyScene.js → cena do pênalti (Phaser 3)
│
├── api/                    → back-end Node.js (funções serverless)
│   ├── _lib/
│   │   ├── crypto.js         → Termatika: cifra/decifra o token de sessão
│   │   ├── equation.js       → Termatika: geração e validação das equações
│   │   ├── firebaseAdmin.js  → MathGol: conexão com o Firestore
│   │   └── token.js          → MathGol: gera o token opaco do jogador
│   ├── guess/{new,guess}.js  → Termatika, modo Adivinhar
│   ├── target/{new,check}.js → Termatika, modo Resultado
│   ├── session.js            → MathGol: POST cria jogador anônimo + série
│   └── progress.js           → MathGol: GET/POST progresso (pontos, rodadas)
│
├── package.json
├── .env.example
└── .gitignore
```

Não existe `vercel.json` de propósito: com um `index.html` na raiz, uma
pasta `mathgol/` e uma pasta `api/`, a Vercel já serve tudo certo sem
configuração (zero-config).

## Como cada jogo guarda seus dados

- **Termatika** não usa banco de dados. A equação secreta (ou o esqueleto
  do modo Resultado) fica dentro de um token cifrado (AES-256-GCM) que o
  próprio navegador carrega de requisição em requisição — o servidor
  decifra, mas ninguém consegue ler o conteúdo abrindo o DevTools.
- **MathGol** usa o Firebase Firestore (via Firebase Admin SDK, só o
  back-end fala com ele) pra guardar apelido, série escolhida, pontos e
  rodadas concluídas. O jogador é identificado por um token opaco gerado
  no servidor — nenhum nome real, e-mail ou dado pessoal é coletado em
  lugar nenhum.

## 1. Configurar variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

- `GAME_SECRET` (Termatika): qualquer string longa e aleatória, ex:
  `openssl rand -hex 32`. Sem ela o projeto ainda funciona (usa uma chave
  padrão de desenvolvimento), mas troque antes de ir para produção.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  (MathGol): veja o passo 2 abaixo para gerar esses três valores. **Sem
  eles, só o Termatika funciona** — o MathGol precisa do Firebase pra
  salvar progresso.

## 2. Criar o projeto no Firebase (necessário só pro MathGol)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto novo (plano **Spark**, gratuito).
2. Vá em **Build → Firestore Database** e clique em **Criar banco de
   dados** (modo produção, região mais próxima do Brasil, ex:
   `southamerica-east1`).
3. Vá em **Configurações do projeto (⚙️) → Contas de serviço → Gerar
   nova chave privada**. Isso baixa um `.json` com `project_id`,
   `client_email` e `private_key` — são os três valores do `.env`.

## 3. Rodar localmente

```bash
npm i -g vercel
npm install
vercel dev
```
Isso sobe o site inteiro (Termatika + MathGol) com as funções `/api`
funcionando em `http://localhost:3000`, do mesmo jeito que roda na Vercel.

## 4. Subir pro GitHub

```bash
git add .
git commit -m "Termatika + MathGol"
git branch -M main
git remote add origin <URL_DO_SEU_REPO>
git push -u origin main
```

## 5. Publicar na Vercel

1. Em [vercel.com](https://vercel.com), **Add New → Project** e conecte o
   repositório do GitHub.
2. Framework preset: **Other**.
3. Em **Settings → Environment Variables**, cadastre as 4 variáveis do
   `.env` (`GAME_SECRET` + as 3 do Firebase). Não suba o `.env` pro
   GitHub — ele já está no `.gitignore`.
4. **Deploy**. A Vercel builda automaticamente a cada push na branch
   `main`.

## Acessibilidade já embutida (MathGol)

- Alto contraste, espaçamento para dislexia, narração em áudio e texto
  ampliado — tudo já ativável na tela de Configurações de Acessibilidade,
  não é "para depois".
- Alvo de toque grande (mínimo 64px) em todos os botões.
- Feedback de erro nunca é punitivo — sem "game over", sem som negativo.
- Apelido = personagem + animal de listas fixas, sem campo de texto livre
  em lugar nenhum — nenhum dado pessoal é coletado.
