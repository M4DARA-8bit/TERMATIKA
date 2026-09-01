const { getFirestore } = require('./_lib/firebaseAdmin');

// GET  /api/progress?token=xxxx                        -> devolve o progresso salvo
// POST /api/progress  { token, roundCompleted, scoreDelta } -> atualiza
module.exports = async (req, res) => {
  const db = getFirestore();

  if (req.method === 'GET') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'token é obrigatório' });

    const doc = await db.collection('players').doc(token).get();
    if (!doc.exists) return res.status(404).json({ error: 'Jogador não encontrado' });

    return res.status(200).json(doc.data());
  }

  if (req.method === 'POST') {
    try {
      const { token, roundCompleted, scoreDelta } = req.body || {};
      if (!token) return res.status(400).json({ error: 'token é obrigatório' });

      const ref = db.collection('players').doc(token);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: 'Jogador não encontrado' });

      const current = doc.data().progress || { completedRounds: 0, score: 0 };

      const updated = {
        completedRounds: (current.completedRounds || 0) + (roundCompleted ? 1 : 0),
        score: (current.score || 0) + (scoreDelta || 0),
      };

      await ref.update({ progress: updated });
      return res.status(200).json({ progress: updated });
    } catch (err) {
      console.error('Erro em /api/progress (POST):', err);
      return res.status(500).json({ error: 'Erro ao salvar progresso' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
