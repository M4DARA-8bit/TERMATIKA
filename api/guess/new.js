const { encryptToken } = require('../_lib/crypto');
const { generateGuessTarget, GUESS_LEN } = require('../_lib/equation');

const MAX_ATTEMPTS = 6;

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const target = generateGuessTarget();
  const token = encryptToken({
    mode: 'guess',
    target,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    gameOver: false
  });

  res.status(200).json({ token, length: GUESS_LEN, maxAttempts: MAX_ATTEMPTS });
};
