import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import { verify } from "jsonwebtoken";

const SECRET = "mon_super_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Méthode non autorisée" });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  let user: any;
  try {
    user = verify(token, SECRET);
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }

  const {
    description,
    dateDébut,
    dateFin,
    lieu,
    prix,
    animaux, // tableau des id sélectionnés
  } = req.body;

  if (!Array.isArray(animaux)) {
    return res.status(400).json({ message: "Animaux doivent être un tableau" });
  }

  try {
    // Insertion de la garde
    const [gardeResult]: any = await pool.query(
      `INSERT INTO garde (description, dateDébut, dateFin, lieu, etat, idDemandeur, confirmDemandeur, confirmGardien, prix)
       VALUES (?, ?, ?, ?, 'Proposé', ?, false, false, ?)`,
      [description, dateDébut, dateFin, lieu, user.id, prix]
    );

    const idGarde = gardeResult.insertId;

    // Insertion des animaux liés (table anidansannonce)
    if (animaux.length > 0) {
      const values = animaux.map((id: number) => [id, idGarde]);
      await pool.query(
        `INSERT INTO anidansannonce (idAnimal, idGarde) VALUES ?`,
        [values]
      );
    }

    res.status(200).json({ message: "Annonce créée", idGarde });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
