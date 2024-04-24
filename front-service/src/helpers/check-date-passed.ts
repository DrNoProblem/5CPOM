export const isDatePast = (targetDateString: Date): boolean => {
    const targetDate = new Date(targetDateString); // Convertit la chaîne ISO en objet Date
  const currentDate: Date = new Date(); // Obtient la date et l'heure actuelles
  return targetDate < currentDate; // Compare la date cible avec la date actuelle
};
