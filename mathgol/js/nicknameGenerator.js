// Apelidos são sempre uma combinação de duas listas fixas.
// Não existe campo de texto livre em lugar nenhum — por isso não há
// como surgir um nome ofensivo, e não há como coletar dado pessoal.
// Personagens são criações originais do próprio projeto (nada de IP
// de terceiros: sem Mario, sem super-heróis licenciados, etc).

const CHARACTERS = [
  'Capitão', 'Fera', 'Craque', 'Estrela', 'Foguete',
  'Relâmpago', 'Campeão', 'Fenômeno', 'Ás', 'Herói',
];

const ANIMALS = [
  'Tigre', 'Coruja', 'Raposa', 'Falcão', 'Leão',
  'Jaguar', 'Águia', 'Pantera', 'Lobo', 'Gavião',
];

const TEAMS = [
  'Brasil', 'Argentina', 'Alemanha', 'França', 'Espanha',
  'Portugal', 'Japão', 'Marrocos', 'Croácia', 'Coreia do Sul',
];

function generateNickname() {
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return { character, animal, full: `${character} ${animal}` };
}
