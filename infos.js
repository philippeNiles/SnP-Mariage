// =====================================================================
//  INFOS DU MARIAGE — modifiez seulement ce fichier.
//  Chaque info est utilisée partout sur le site automatiquement.
//  Gardez les guillemets "..." et les virgules à la fin des lignes.
// =====================================================================

const INFOS = {
  // Les deux noms, dans l'ordre d'affichage. Les prénoms et les
  // initiales (S & P) sont tirés automatiquement de ces noms.
  noms: ["Sarah Roy-Molgat", "Philippe Niles"],

  // Date du mariage, format AAAA-MM-JJ
  date: "2027-10-02",

  // Ville affichée sous la date
  ville: "Montréal, Québec",

  // Lieu de la cérémonie et de la réception
  lieu: {
    nom: "Nom du domaine",
    adresse: "123, rue Exemple, Montréal (QC)",
    // Le lien « Voir sur la carte » est créé à partir de l'adresse.
  },

  // Date limite pour répondre au RSVP, format AAAA-MM-JJ
  dateLimiteRSVP: "2027-08-01",

  // Courriel affiché en bas de page pour les questions
  courrielContact: "philippe.niles@gmail.com",

  // Programme de la journée. Heure au format HH:MM (24 h).
  // Le compte à rebours vise l'heure de la première activité.
  programme: [
    { heure: "15:00", titre: "Cérémonie", description: "Arrivez quelques minutes à l'avance pour trouver votre place." },
    { heure: "16:00", titre: "Cocktail", description: "Bouchées, bulles et photos dans le jardin." },
    { heure: "18:30", titre: "Souper", description: "Un repas végétarien servi à table." },
    { heure: "21:00", titre: "Soirée dansante", description: "Jusqu'aux petites heures!" },
  ],

  // Adresse du Google Apps Script qui reçoit les réponses (voir LISEZ-MOI.md).
  // Laissez "" pour le mode démo (rien n'est enregistré).
  rsvpUrl: "https://script.google.com/macros/s/AKfycbxP-RpDjO-r3ip-jw7H7t-QXqeScVGNs1LqWE_oW3-mcMiM9Mm8AQSXXElcLSqxqrVgew/exec",
};
