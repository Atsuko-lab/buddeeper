import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Méthode ${req.method} non autorisée` });
  }

  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res
      .status(400)
      .json({ message: "ID utilisateur invalide ou manquant" });
  }

  try {
    const userId = Number(id);

    const [rows] = (await pool.query(
      `SELECT id, nom, prenom, description,
              gardien AS estGardien, demandeur AS estDemandeur
       FROM userapp
       WHERE id = ?`,
      [userId]
    )) as any;

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = rows[0];

    const [animaux] = (await pool.query(
      `SELECT nom, espece, poids, age, taille, description
       FROM animaux
       WHERE idMaitre = ?`,
      [userId]
    )) as any[];

    user.animaux = animaux || [];

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erreur /api/afficherProfile:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
