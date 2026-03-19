import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "ID utilisateur invalide ou manquant" });
    }
    const userId = Number(id);

    if (req.method === "GET") {
      const [conversations] = await pool.query(
        `
          SELECT
          CASE
            WHEN m.idExpéditeur = ? THEN u2.id
            ELSE u1.id
          END AS interlocuteurId,
          CASE
            WHEN m.idExpéditeur = ? THEN u2.nom
            ELSE u1.nom
          END AS nom,
          CASE
            WHEN m.idExpéditeur = ? THEN u2.prenom
            ELSE u1.prenom
          END AS prenom,
          MAX(m.dateH) AS dernierMessageDate,
          SUM(CASE WHEN m.idReceveur = ? AND m.lu = FALSE THEN 1 ELSE 0 END) AS nbNonLus
          FROM message m
          JOIN userapp u1 ON u1.id = m.idExpéditeur
          JOIN userapp u2 ON u2.id = m.idReceveur
          WHERE m.idExpéditeur = ? OR m.idReceveur = ?
          GROUP BY interlocuteurId
          ORDER BY dernierMessageDate DESC
        `,
        [userId, userId, userId, userId, userId, userId]
      );

      return res.status(200).json(conversations);
    } else {
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .json({ message: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("Erreur /api/listeConversations:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
