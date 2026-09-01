const { getFirestore } = require('./_lib/firebaseAdmin');
const { generateToken } = require('./_lib/token');

const VALID_GRADES = ['1', '2', '3', '4', '5', '6'];
const DEFAULT_GRADE = '2';

// POST /api/session
// body: { character: "Capitão", animal: "Tigre", team: "Brasil", grade: "3" }
// -> cria o documento do jogador no Firestore e devolve o token.
// Nenhum campo de nome/e-mail/documento é aceito ou gravado aqui.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { character, animal, team, grade } = req.body || {};

    if (!character || !animal) {
      return res.status(400).json({ error: 'character e animal são obrigatórios' });
    }

    const safeGrade = VALID_GRADES.includes(String(grade)) ? String(grade) : DEFAULT_GRADE;

    const db = getFirestore();
    const token = generateToken();

    await db.collection('players').doc(token).set({
      nickname: `${character} ${animal}`,
      team: team || null,
      grade: safeGrade,
      createdAt: new Date().toISOString(),
      progress: {
        completedRounds: 0,
        score: 0,
      },
    });

    return res.status(201).json({ token, nickname: `${character} ${animal}`, grade: safeGrade });
  } catch (err) {
    console.error('Erro em /api/session:', err);
    return res.status(500).json({ error: 'Erro ao criar sessão' });
  }
};
