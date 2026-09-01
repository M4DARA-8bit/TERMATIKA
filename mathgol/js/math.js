// Gera as perguntas de matemática de acordo com a série escolhida pelo
// jogador (1º ao 6º ano). Cada série tem uma faixa numérica e um conjunto
// de operações compatível com o que costuma ser trabalhado naquele ano
// (soma e subtração nos anos iniciais, multiplicação e divisão entrando
// a partir do 3º/4º ano, e problemas combinados nos anos finais do
// Fundamental I).

const GRADE_LEVELS = {
  '1': {
    label: '1º ano',
    short: '1º',
    ops: ['add', 'sub'],
    add: { min: 1, max: 10 },
    sub: { min: 1, max: 10 },
  },
  '2': {
    label: '2º ano',
    short: '2º',
    ops: ['add', 'sub'],
    add: { min: 1, max: 20 },
    sub: { min: 1, max: 20 },
  },
  '3': {
    label: '3º ano',
    short: '3º',
    ops: ['add', 'sub', 'mul'],
    add: { min: 10, max: 100 },
    sub: { min: 10, max: 100 },
    mul: { min: 2, max: 5 },
  },
  '4': {
    label: '4º ano',
    short: '4º',
    ops: ['add', 'sub', 'mul', 'div'],
    add: { min: 20, max: 200 },
    sub: { min: 20, max: 200 },
    mul: { min: 2, max: 10 },
    div: { min: 2, max: 10 },
  },
  '5': {
    label: '5º ano',
    short: '5º',
    ops: ['add', 'sub', 'mul', 'div', 'combo'],
    add: { min: 50, max: 500 },
    sub: { min: 50, max: 500 },
    mul: { min: 2, max: 12 },
    div: { min: 2, max: 12 },
  },
  '6': {
    label: '6º ano',
    short: '6º',
    ops: ['add', 'sub', 'mul', 'div', 'combo'],
    add: { min: 100, max: 999 },
    sub: { min: 100, max: 999 },
    mul: { min: 3, max: 12 },
    div: { min: 3, max: 12 },
  },
};

const GRADE_ORDER = ['1', '2', '3', '4', '5', '6'];
const DEFAULT_GRADE = '2';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOp(config) {
  return config.ops[randomInt(0, config.ops.length - 1)];
}

function buildQuestion(config, op) {
  let a, b, c, answer, text;

  if (op === 'add') {
    a = randomInt(config.add.min, config.add.max);
    b = randomInt(config.add.min, config.add.max);
    answer = a + b;
    text = `${a} + ${b} = ?`;
  } else if (op === 'sub') {
    a = randomInt(config.sub.min, config.sub.max);
    b = randomInt(config.sub.min, config.sub.max);
    if (b > a) [a, b] = [b, a]; // evita resultado negativo
    answer = a - b;
    text = `${a} - ${b} = ?`;
  } else if (op === 'mul') {
    a = randomInt(config.mul.min, config.mul.max);
    b = randomInt(config.mul.min, config.mul.max);
    answer = a * b;
    text = `${a} × ${b} = ?`;
  } else if (op === 'div') {
    b = randomInt(config.div.min, config.div.max);
    answer = randomInt(config.div.min, config.div.max);
    a = answer * b; // garante divisão exata
    text = `${a} ÷ ${b} = ?`;
  } else if (op === 'combo') {
    a = randomInt(config.mul.min, config.mul.max);
    b = randomInt(config.mul.min, config.mul.max);
    c = randomInt(1, 10);
    answer = a * b + c;
    text = `${a} × ${b} + ${c} = ?`;
  }

  return { text, answer };
}

// gradeKey: '1' a '6' (chave de GRADE_LEVELS). Aceita undefined -> usa o padrão.
function generateQuestion(gradeKey) {
  const config = GRADE_LEVELS[gradeKey] || GRADE_LEVELS[DEFAULT_GRADE];
  const op = pickOp(config);
  const { text, answer } = buildQuestion(config, op);

  const options = new Set([answer]);
  let attempts = 0;
  while (options.size < 5) {
    attempts++;
    // O raio de distratores cresce se não conseguir opções suficientes
    // (evita loop infinito quando a resposta é um número pequeno, ex: 0).
    const spread = Math.max(3, Math.round(answer * 0.15) || 3) + Math.floor(attempts / 20);
    const distractor = answer + randomInt(-spread, spread);
    if (distractor !== answer && distractor >= 0) options.add(distractor);
  }

  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
  return { text, correctAnswer: answer, options: shuffled };
}
