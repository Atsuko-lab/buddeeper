// /pages/api/listerAnnoncesParUtilisateur.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

type Annonce = {
  idAnnonce: number;
  description: string;
  dateDébut: string;
  dateFin: string;
  lieu: string;
  prix: number;
  // Ajoute ici si tu veux animaux ou propositions
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { idUser } = req.query;
  if (!idUser || Array.isArray(idUser)) {
    return res.status(400).json({ message: "Paramètre idUser requis" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id AS idAnnonce, description, dateDébut, dateFin, lieu, prix
       FROM garde
       WHERE idDemandeur = ? 
       ORDER BY dateDébut DESC`,
      [idUser]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur API annonces par utilisateur:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
