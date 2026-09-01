const crypto = require('crypto');

// Gera um token opaco (ex: "a1b2c3d4e5f6...") que identifica o jogador
// sem carregar nenhum dado pessoal. É isso que substitui "nome do aluno"
// em todo o sistema.
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = { generateToken };
