(function () {
  const L = [
    ['Le marché d’Aligre', 'Haggling over clementines at a Saturday market stall.', ['Le partitif', 'En + quantité'], true],
    ['Une panne sur la 13', 'The métro stops between two stations. Everyone has an opinion.', ['Passé composé ou imparfait'], true],
    ['Le voisin du dessus', 'A polite note about a noisy neighbour, and his reply.', ['Conditionnel de politesse'], true],
    ['Chez le médecin', 'Explaining what hurts and since when.', ['Avoir mal à', 'Depuis / il y a'], false],
    ['Un dîner chez Camille', 'Bringing wine, getting lost, arriving late.', ['Pronoms COD et COI'], true],
    ['La laverie', 'A broken machine and a helpful stranger.', ['Il faut que + subjonctif'], false],
    ['Au guichet de la Poste', 'Sending a parcel abroad, formally.', ['L’inversion'], true],
    ['Un apéro sur le canal', 'Planning drinks by the Canal Saint-Martin.', ['On = nous', 'Futur proche'], true],
    ['Le Vélib’ en panne', 'Three docks, three broken bikes.', ['Ne… plus, ne… jamais'], false],
    ['La fête des voisins', 'The whole building in the courtyard, one evening in May.', ['Qui ou que'], true],
    ['Chez le coiffeur', 'Asking for “just a trim” and hoping for the best.', ['Faire + infinitif'], false],
    ['Une visite d’appartement', 'Twelve people queue to see a 28 m² flat.', ['Le comparatif', 'Dont'], true],
    ['Le brunch du dimanche', 'Ordering for a table of five in the Marais.', ['Le pronom y'], false],
    ['Le premier jour au bureau', 'Working out who to call tu and who to call vous.', ['Tu ou vous'], true]
  ];
  const SH = [
    { shape: 'arch', bg: 'orange-500', fg: 'sun-300' },
    { shape: 'circle', bg: 'sky-300', fg: 'violet-500' },
    { shape: 'flower', bg: 'green-900', fg: 'green-300' },
    { shape: 'halves', bg: 'sun-300', fg: 'orange-500' },
    { shape: 'pill', bg: 'violet-500', fg: 'lilac-500' },
    { shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' },
    { shape: 'circle', bg: 'orange-500', fg: 'sun-300' }
  ];
  const day = 86400000, now = new Date();
  window.APERO_ARCHIVE = L.map(([title, desc, topics, done], i) => {
    const d = new Date(now.getTime() - (i + 1) * day);
    return { id: 'past-' + (i + 1), ago: i + 1, title, desc, topics, done,
      date: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      dayNum: String(d.getDate()), month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
      weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
      group: i < 6 ? 'Cette semaine' : i < 13 ? 'La semaine dernière' : 'Plus tôt', ...SH[i % SH.length] };
  });
})();
