const { encryptToken, decryptToken } = require('../_lib/crypto');
const { validateEquation } = require('../_lib/equation');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const { token, values } = req.body || {};
  const payload = decryptToken(token);

  if (!payload || payload.mode !== 'target') {
    res.status(400).json({ error: 'Sessão de jogo inválida. Inicie um novo jogo.' });
    return;
  }
  if (payload.gameOver) {
    res.status(400).json({ error: 'Esse desafio já terminou. Inicie um novo jogo.' });
    return;
  }

  const cells = payload.cells; // esqueleto autoritativo, veio do próprio token
  if (!Array.isArray(values) || values.length !== cells.length) {
    res.status(400).json({ error: 'Resposta inválida.' });
    return;
  }
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].fixed && !/^[0-9]$/.test(String(values[i]))) {
      res.status(400).json({ error: 'Preencha todos os espaços em branco.' });
      return;
    }
  }

  const full = cells.map((c, i) => (c.fixed ? c.char : String(values[i]))).join('');
  const correct = validateEquation(full);
  const attempts = payload.attempts + 1;
  const gameOver = correct || attempts >= payload.maxAttempts;

  const newToken = encryptToken({ ...payload, attempts, gameOver });

  const response = {
    correct,
    equation: full,
    attempts,
    maxAttempts: payload.maxAttempts,
    gameOver,
    token: newToken
  };
  if (gameOver && !correct) response.solutionExample = payload.solutionExample;

  res.status(200).json(response);
};
