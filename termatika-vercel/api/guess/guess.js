const { encryptToken, decryptToken } = require('../_lib/crypto');
const { validateEquation, gradeGuess } = require('../_lib/equation');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const { token, guess } = req.body || {};
  const payload = decryptToken(token);

  if (!payload || payload.mode !== 'guess') {
    res.status(400).json({ error: 'Sessão de jogo inválida. Inicie um novo jogo.' });
    return;
  }
  if (payload.gameOver) {
    res.status(400).json({ error: 'Esse jogo já terminou. Inicie um novo jogo.' });
    return;
  }

  const g = String(guess || '');
  if (g.length !== payload.target.length) {
    res.status(400).json({ error: 'Tamanho inválido.' });
    return;
  }
  if (!validateEquation(g)) {
    res.status(400).json({ error: 'A conta precisa fechar certinho (ex: 12+3=15).' });
    return;
  }

  const grading = gradeGuess(g, payload.target);
  const correct = g === payload.target;
  const attempts = payload.attempts + 1;
  const gameOver = correct || attempts >= payload.maxAttempts;

  const newToken = encryptToken({ ...payload, attempts, gameOver });

  const response = {
    grading,
    correct,
    attempts,
    maxAttempts: payload.maxAttempts,
    gameOver,
    token: newToken
  };
  // Só revela a equação secreta quando o jogo acaba (acertou ou esgotou tentativas).
  if (gameOver && !correct) response.target = payload.target;

  res.status(200).json(response);
};
