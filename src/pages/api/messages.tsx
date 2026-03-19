import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const currentUserId = Number(req.query.currentUserId);
      const contactUserId = Number(req.query.contactUserId);
      if (!currentUserId || !contactUserId)
        return res.status(400).json({ message: "idUser manquant" });

      // Marquer les messages reçus comme lus
      await pool.query(
        `UPDATE message SET lu = TRUE WHERE idExpéditeur = ? AND idReceveur = ? AND lu = FALSE`,
        [contactUserId, currentUserId]
      );

      // Récupérer les messages
      const [messages] = await pool.query<any[]>(
        `
        SELECT 
          m.idMessage AS id,
          m.message AS contenu,
          m.dateH,
          m.idExpéditeur,
          m.type,
          m.idAnnonce,
          u.nom,
          u.prenom
        FROM message m
        JOIN userapp u ON u.id = m.idExpéditeur
        WHERE 
          (m.idExpéditeur = ? AND m.idReceveur = ?)
          OR 
          (m.idExpéditeur = ? AND m.idReceveur = ?)
        ORDER BY m.dateH ASC
        `,
        [currentUserId, contactUserId, contactUserId, currentUserId]
      );

      // Trouver toutes les annonces concernées
      const annonceIds = [
        ...new Set(messages.map((m) => m.idAnnonce).filter(Boolean)),
      ];

      let annoncesBloquées: number[] = [];

      if (annonceIds.length > 0) {
        const [gardes] = await pool.query<any[]>(
          `SELECT id, idGardien FROM garde WHERE id IN (?)`,
          [annonceIds]
        );

        // Annonces attribuées à un autre utilisateur que les deux
        annoncesBloquées = gardes
          .filter(
            (garde) =>
              garde.idGardien &&
              garde.idGardien !== currentUserId &&
              garde.idGardien !== contactUserId
          )
          .map((garde) => garde.id);
      }

      return res.status(200).json({ messages, annoncesBloquées });
    }

    if (req.method === "POST") {
      const {
        currentUserId,
        contactUserId,
        contenu,
        idAnnonce = null,
      } = req.body;
      if (!contactUserId || !contenu) {
        return res.status(400).json({ message: "Champs manquants" });
      }

      await pool.query(
        `INSERT INTO message (idExpéditeur, idReceveur, message, dateH, lu, idAnnonce)
         VALUES (?, ?, ?, NOW(), FALSE, ?)`,
        [currentUserId, contactUserId, contenu, idAnnonce]
      );

      return res.status(201).json({ message: "Message envoyé" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Méthode ${req.method} non autorisée` });
  } catch (error) {
    console.error("Erreur /api/messages:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
