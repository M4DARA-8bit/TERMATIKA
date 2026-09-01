// Todas as escritas no Firestore passam por aqui -> /api/*.js (Node.js).
// O cliente nunca fala direto com o Firestore: isso mantém a regra de
// negócio (e a validação) do lado do servidor.

const MathGolAPI = {
  async createSession(character, animal, team, grade) {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, animal, team, grade }),
    });
    if (!res.ok) throw new Error('Falha ao criar sessão');
    return res.json(); // { token, nickname }
  },

  async getProgress(token) {
    const res = await fetch(`/api/progress?token=${encodeURIComponent(token)}`);
    if (!res.ok) throw new Error('Falha ao carregar progresso');
    return res.json();
  },

  async saveProgress(token, { roundCompleted, scoreDelta }) {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, roundCompleted, scoreDelta }),
    });
    if (!res.ok) throw new Error('Falha ao salvar progresso');
    return res.json();
  },

  // Token fica só no localStorage do navegador — nunca em cookie de
  // terceiros, nunca associado a nome real.
  getStoredToken() {
    return localStorage.getItem('mathgol_token');
  },
  storeToken(token) {
    localStorage.setItem('mathgol_token', token);
  },
};
