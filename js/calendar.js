const SAINTS = [
  /* Janv */ ["Jour de l'An", "Basile", "Geneviève", "Odilon", "Édouard", "Mélaine", "Raymond", "Lucien", "Alix", "Guillaume", "Paulin", "Tatiana", "Yvette", "Nina", "Rémi", "Marcel", "Roseline", "Prisca", "Marius", "Sébastien", "Agnès", "Vincent", "Barnard", "François de Sales", "Conversion de Paul", "Paule", "Angèle", "Thomas d'Aquin", "Gildas", "Martine", "Marcelle"],
  /* Févr */ ["Ella", "Présentation", "Blaise", "Véronique", "Agathe", "Gaston", "Eugénie", "Jacqueline", "Apolline", "Arnaud", "N-D de Lourdes", "Félix", "Béatrice", "Valentin", "Claude", "Julienne", "Alexis", "Bernadette", "Gabin", "Aimée", "Damien", "Isabelle", "Lazare", "Modeste", "Roméo", "Nestor", "Honorine", "Romain", "Auguste"],
  /* Mars */ ["Aubin", "Charles le Bon", "Guénolé", "Casimir", "Olive", "Colette", "Félicité", "Jean de Dieu", "Françoise", "Vivien", "Rosine", "Justine", "Rodrigue", "Mathilde", "Louise", "Bénédicte", "Patrice", "Cyrille", "Joseph", "Herbert", "Clémence", "Léa", "Victorien", "Cath. de Suède", "Annonciation", "Larissa", "Habib", "Gontran", "Gwladys", "Amédée", "Benjamin"],
  /* Avril*/ ["Hugues", "Sandrine", "Richard", "Isidore", "Irène", "Marcellin", "J-B de la Salle", "Julie", "Gautier", "Fulbert", "Stanislas", "Jules", "Ida", "Maxime", "Paterne", "Benoît-Joseph", "Anicet", "Parfait", "Emma", "Odette", "Anselme", "Alexandre", "Georges", "Fidèle", "Marc", "Alida", "Zita", "Valérie", "Cath. de Sienne", "Robert"],
  /* Mai  */ ["Fête du Travail", "Boris", "Philippe", "Sylvain", "Judith", "Prudence", "Gisèle", "Désiré", "Pacôme", "Solange", "Estelle", "Achille", "Rolande", "Matthias", "Denise", "Honoré", "Pascal", "Éric", "Yves", "Bernardin", "Constantin", "Émile", "Didier", "Donatien", "Sophie", "Bérenger", "Augustin", "Germain", "Aymard", "Ferdinand", "Visitation"],
  /* Juin */ ["Justin", "Blandine", "Kévin", "Clotilde", "Igor", "Norbert", "Gilbert", "Médard", "Diane", "Landry", "Barnabé", "Guy", "Antoine de Padoue", "Élisée", "Germaine", "J-F Régis", "Hervé", "Léonce", "Romuald", "Silvère", "Rodolphe", "Alban", "Audrey", "Jean-Baptiste", "Prosper", "Anthelme", "Fernand", "Irénée", "Pierre et Paul", "Martial"],
  /* Juil */ ["Thierry", "Martinien", "Thomas", "Florent", "Antoine", "Mariette", "Raoul", "Thibault", "Amandine", "Ulrich", "Benoît", "Olivier", "Henri", "Camille", "Donald", "N-D du Mt Carmel", "Charlotte", "Frédéric", "Arsène", "Marina", "Victor", "Marie-Madeleine", "Brigitte", "Christine", "Jacques", "Anne", "Nathalie", "Samson", "Marthe", "Juliette", "Ignace de Loyola"],
  /* Août */ ["Alphonse", "Julien Eymard", "Lydie", "Jean-Marie Vianney", "Abel", "Transfiguration", "Gaétan", "Dominique", "Amour", "Laurent", "Claire", "Clarisse", "Hippolyte", "Évrard", "Assomption", "Armel", "Hyacinthe", "Hélène", "Jean Eudes", "Bernard", "Christophe", "Fabrice", "Rose de Lima", "Barthélemy", "Louis", "Natacha", "Monique", "Augustin", "Sabine", "Fiacre", "Aristide"],
  /* Sept */ ["Gilles", "Ingrid", "Grégoire", "Rosalie", "Raïssa", "Bertrand", "Reine", "Nativité", "Alain", "Inès", "Adelphe", "Apollinaire", "Aimé", "Croix Glorieuse", "Roland", "Édith", "Renaud", "Nadège", "Émilie", "Davy", "Matthieu", "Maurice", "Constant", "Thècle", "Hermann", "Côme et Damien", "Vincent de Paul", "Venceslas", "Michel", "Jérôme"],
  /* Oct  */ ["Thérèse de l'E.J.", "Léger", "Gérard", "François d'Assise", "Fleur", "Bruno", "Serge", "Pélagie", "Denis", "Ghislain", "Firmin", "Wilfried", "Géraud", "Juste", "Thérèse d'Avila", "Edwige", "Baudouin", "Luc", "René", "Adeline", "Céline", "Élodie", "Jean de Capistran", "Florentin", "Crépin", "Dimitri", "Émeline", "Jude", "Narcisse", "Bienvenu", "Quentin"],
  /* Nov  */ ["Toussaint", "Défunts", "Hubert", "Charles", "Sylvie", "Bertille", "Carine", "Geoffroy", "Théodore", "Léon", "Martin", "Christian", "Brice", "Sidoine", "Albert", "Marguerite", "Élisabeth", "Aude", "Tanguy", "Edmond", "Prés. de Marie", "Cécile", "Clément", "Flora", "Catherine", "Delphine", "Sévrin", "Jacques de la M.", "Saturnin", "André"],
  /* Déc  */ ["Florence", "Viviane", "François Xavier", "Barbara", "Gérald", "Nicolas", "Ambroise", "Immaculée Conception", "Pierre Fourier", "Romaric", "Daniel", "Jeanne-F. de Chantal", "Lucie", "Odile", "Ninon", "Alice", "Gaël", "Gatien", "Urbain", "Théophile", "Pierre Canisius", "F. Xavière", "Armand", "Adèle", "Noël", "Étienne", "Jean", "Innocents", "David", "Roger", "Sylvestre"]
];

function generateCalendar(){
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const days = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  document.getElementById("month-title").innerText = months[month] + " " + year;

  let html = "";
  days.forEach(d=>{ html += `<div class="day header">${d}</div>`; });

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for(let i=0; i<firstDay; i++){
    html += `<div class="day" style="background:transparent; border:none;"></div>`;
  }

  for(let d=1; d<=daysInMonth; d++){
    html += `<div class="day ${d===today ? "today" : ""}">${d}</div>`;
  }
  document.getElementById("calendar").innerHTML = html;
}

function showPop() {
  const el = document.getElementById("saint-text");
  const now = new Date();
  const saint = SAINTS[now.getMonth()][now.getDate() - 1];

  el.classList.remove("show");

  setTimeout(() => {
    el.innerText = `AUJOURD'HUI, NOUS FÊTONS ${saint.toUpperCase()} ! ✨`;
    el.classList.add("show");
  }, 500);
}

function clock(){
  const clockEl = document.getElementById("clock");
  if(clockEl) clockEl.innerText = new Date().toLocaleTimeString("fr-FR");
}

setInterval(clock, 1000);
setInterval(showPop, 10000); 
setInterval(generateCalendar, 60000); // C'EST CETTE LIGNE QU'IL FAUT AJOUTER

clock();
generateCalendar();
showPop();