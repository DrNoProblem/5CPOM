export const formatDate = (isoDateString: Date): string => {
  const date = new Date(isoDateString);

  // Obtenez les composants de la date
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Tableau des noms des mois
  const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  // Formater la date
  const formattedDate = `${day} ${monthNames[monthIndex]} ${year} - ${hours}:${minutes}`;

  return formattedDate;
};
