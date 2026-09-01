const { encryptToken } = require('../_lib/crypto');
const { generateTargetTemplate } = require('../_lib/equation');

const MAX_ATTEMPTS = 6;

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const { cells, solutionExample } = generateTargetTemplate();
  const token = encryptToken({
    mode: 'target',
    cells,
    solutionExample,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    gameOver: false
  });

  // O cliente só recebe a forma do esqueleto (o que é fixo e o que é lacuna),
  // nunca precisa da "solutionExample" para jogar — ela só é revelada no fim,
  // se as tentativas esgotarem.
  const template = cells.map((c) => (c.fixed ? { fixed: true, char: c.char } : { fixed: false }));

  res.status(200).json({ token, template, maxAttempts: MAX_ATTEMPTS });
};
