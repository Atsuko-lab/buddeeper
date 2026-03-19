import { NextApiRequest, NextApiResponse } from "next";
import db from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Mois de 0 à 11
  const day = String(now.getDate()).padStart(2, "0");

  const today = `${year}-${month}-${day}`;

  try {
    // Récupérer les annonces avec les détails de l'utilisateur demandeur
    const [annonces] = await db.query(
      `
    SELECT garde.id AS idAnnonce, garde.idDemandeur, garde.description, garde.dateDébut, garde.dateFin, garde.lieu, garde.prix, userapp.nom, userapp.prenom
    FROM garde
    JOIN userapp ON userapp.id = garde.idDemandeur
    WHERE etat = "Proposé" AND garde.dateDébut > ?
    `,
      [today]
    );

    // Pour chaque annonce, récupérer les animaux associés et propositions
    for (const annonce of annonces as any) {
      // Animaux
      let [animaux] = await db.query(
        `
        SELECT animaux.id, animaux.idMaitre, animaux.nom, animaux.espece, animaux.poids, animaux.age, animaux.taille, animaux.description
        FROM animaux
        JOIN anidansannonce ON anidansannonce.idAnimal = animaux.id
        WHERE anidansannonce.idGarde = ?
        `,
        [annonce.idAnnonce]
      );
      annonce.animaux = animaux;

      // Propositions liées à cette annonce (avec gardien)
      let [propositions] = await db.query(
        `SELECT pg.id, pg.prix, pg.dateProposition, u.id AS idGardien, u.nom AS nomGardien, u.prenom AS prenomGardien 
        FROM propositiongarde pg
        JOIN userapp u ON u.id = pg.idGardien
        WHERE pg.idGarde = ?
        ORDER BY pg.dateProposition DESC`,
        [annonce.idAnnonce]
      );
      annonce.propositions = propositions;
    }

    console.log("Annonces complètes avec propositions:", annonces);
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Erreur dans listerAnnonces:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
