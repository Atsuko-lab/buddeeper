import { NextApiRequest, NextApiResponse } from "next";
import db from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  // Récupérer userId depuis la query (ex: /api/listerMesAnnonces?userId=123)
  const userId = parseInt(req.query.userId as string);
  if (isNaN(userId)) {
    res.status(400).json({ message: "userId invalide" });
    return;
  }

  try {
    // Sélectionne uniquement les annonces "Proposé" avec dateDébut > aujourd'hui ET de l'utilisateur connecté
    const [annonces] = await db.query(
      `
      SELECT garde.id AS idAnnonce, garde.idDemandeur, garde.description, garde.dateDébut, garde.dateFin, garde.lieu, garde.prix, userapp.nom, userapp.prenom
      FROM garde
      JOIN userapp ON userapp.id = garde.idDemandeur
      WHERE etat = "Proposé" AND garde.dateDébut > ? AND garde.idDemandeur = ?
      `,
      [today, userId]
    );

    // Récupérer les animaux et propositions pour chaque annonce
    for (const annonce of annonces as any) {
      const [animaux] = await db.query(
        `
        SELECT animaux.id, animaux.idMaitre, animaux.nom, animaux.espece, animaux.poids, animaux.age, animaux.taille, animaux.description
        FROM animaux
        JOIN anidansannonce ON anidansannonce.idAnimal = animaux.id
        WHERE anidansannonce.idGarde = ?
        `,
        [annonce.idAnnonce]
      );
      annonce.animaux = animaux;

      const [propositions] = await db.query(
        `SELECT pg.id, pg.prix, pg.dateProposition, u.id AS idGardien, u.nom AS nomGardien, u.prenom AS prenomGardien 
         FROM propositiongarde pg
         JOIN userapp u ON u.id = pg.idGardien
         WHERE pg.idGarde = ?
         ORDER BY pg.dateProposition DESC`,
        [annonce.idAnnonce]
      );
      annonce.propositions = propositions;
    }

    res.status(200).json(annonces);
  } catch (error) {
    console.error("Erreur dans listerMesAnnonces:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
