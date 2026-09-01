// Guarda o estado do jogo (equação secreta, tentativas etc.) dentro de um
// token opaco que o próprio cliente carrega de request em request.
// Isso evita precisar de banco de dados: o servidor "lembra" do jogo porque
// consegue decifrar o token que ele mesmo cifrou antes — mas o navegador
// nunca consegue ler o conteúdo (ex: a equação secreta) sem a chave.
//
// IMPORTANTE: defina a variável de ambiente GAME_SECRET no projeto da
// Vercel (Settings > Environment Variables) com um valor longo e aleatório.
// Sem isso, o valor padrão abaixo é usado — ótimo para testar localmente,
// mas não deve ir para produção.

const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function getKey() {
  const secret = process.env.GAME_SECRET || 'termatika-dev-secret-troque-em-producao';
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptToken(payload) {
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function decryptToken(token) {
  try {
    const buf = Buffer.from(String(token), 'base64url');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch (e) {
    return null; // token ausente, corrompido ou adulterado
  }
}

module.exports = { encryptToken, decryptToken };
