// Regras matemáticas do jogo. Mesma lógica usada nos dois modos.

function isValidNumberToken(tok) {
  if (tok.length === 0) return false;
  if (tok.length > 1 && tok[0] === '0') return false; // sem zero à esquerda
  return /^\d+$/.test(tok);
}

function evalExpression(expr) {
  if (!/^[0-9+\-*/]+$/.test(expr)) return null;
  if (/[+\-*/]{2,}/.test(expr)) return null; // operadores colados
  if (/^[+\-*/]/.test(expr) || /[+\-*/]$/.test(expr)) return null; // borda inválida
  const tokens = expr.split(/([+\-*/])/);
  for (let i = 0; i < tokens.length; i += 2) {
    if (!isValidNumberToken(tokens[i])) return null;
  }
  let value;
  try {
    // Seguro aqui porque expr já passou pelo regex acima (só dígitos e operadores).
    value = Function('"use strict";return (' + expr + ')')();
  } catch (e) {
    return null;
  }
  if (!Number.isFinite(value)) return null;
  return value;
}

function validateEquation(str) {
  const parts = String(str).split('=');
  if (parts.length !== 2) return false;
  const [left, right] = parts;
  if (!isValidNumberToken(right)) return false;
  const leftVal = evalExpression(left);
  if (leftVal === null) return false;
  return leftVal === Number(right);
}

// Feedback estilo Wordle/Nerdle, tratando caracteres repetidos corretamente.
function gradeGuess(guess, target) {
  const result = new Array(guess.length).fill('gray');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const counts = {};
  targetArr.forEach((ch) => { counts[ch] = (counts[ch] || 0) + 1; });

  for (let i = 0; i < guess.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'green';
      counts[guessArr[i]]--;
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'green') continue;
    const ch = guessArr[i];
    if (counts[ch] > 0) {
      result[i] = 'gold';
      counts[ch]--;
    }
  }
  return result;
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
const OPS = ['+', '-', '*', '/'];
const GUESS_LEN = 8;

// Modo "Adivinhar": gera uma equação secreta de 8 caracteres.
function generateGuessTarget() {
  for (let i = 0; i < 20000; i++) {
    const numCount = Math.random() < 0.55 ? 3 : 2;
    let nums; let ops;
    if (numCount === 2) {
      nums = [randInt(1, 99), randInt(1, 99)];
      ops = [OPS[randInt(0, 3)]];
    } else {
      nums = [randInt(1, 20), randInt(1, 20), randInt(1, 20)];
      ops = [OPS[randInt(0, 3)], OPS[randInt(0, 3)]];
    }
    let expr = String(nums[0]);
    for (let j = 0; j < ops.length; j++) expr += ops[j] + String(nums[j + 1]);
    const val = evalExpression(expr);
    if (val === null || !Number.isInteger(val) || val < 0 || val > 9999) continue;
    const full = expr + '=' + String(val);
    if (full.length !== GUESS_LEN) continue;
    if (validateEquation(full)) return full;
  }
  return '12+34=46'; // fallback improvável, mas garante que o jogo nunca trave
}

// Modo "Resultado": monta um esqueleto com operadores e resultado visíveis,
// e apenas os dígitos dos operandos em branco.
function generateTargetTemplate() {
  let picked = null;
  for (let i = 0; i < 20000; i++) {
    const numCount = Math.random() < 0.5 ? 3 : 2;
    let nums; let ops;
    if (numCount === 2) {
      nums = [randInt(1, 50), randInt(1, 50)];
      ops = [OPS[randInt(0, 3)]];
    } else {
      nums = [randInt(1, 15), randInt(1, 15), randInt(1, 15)];
      ops = [OPS[randInt(0, 3)], OPS[randInt(0, 3)]];
    }
    let expr = String(nums[0]);
    for (let j = 0; j < ops.length; j++) expr += ops[j] + String(nums[j + 1]);
    const val = evalExpression(expr);
    if (val === null || !Number.isInteger(val) || val < 0 || val > 999) continue;
    const totalLen = expr.length + 1 + String(val).length;
    if (totalLen < 5 || totalLen > 10) continue;
    picked = { nums, ops, val, expr };
    break;
  }
  if (!picked) picked = { nums: [6, 8], ops: ['+'], val: 14, expr: '6+8' };

  const cells = [];
  picked.nums.forEach((n, idx) => {
    const digits = String(n).length;
    for (let d = 0; d < digits; d++) cells.push({ fixed: false });
    if (idx < picked.ops.length) cells.push({ fixed: true, char: picked.ops[idx] });
  });
  cells.push({ fixed: true, char: '=' });
  String(picked.val).split('').forEach((d) => cells.push({ fixed: true, char: d }));

  return { cells, solutionExample: picked.expr + '=' + picked.val };
}

module.exports = {
  isValidNumberToken,
  evalExpression,
  validateEquation,
  gradeGuess,
  randInt,
  OPS,
  GUESS_LEN,
  generateGuessTarget,
  generateTargetTemplate
};
