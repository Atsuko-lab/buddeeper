// /pages/api/listerGardesEnCoursParGardien.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

type Garde = {
  idAnnonce: number;
  description: string;
  dateDébut: string;
  dateFin: string;
  lieu: string;
  prix: number;
  idDemandeur: number;
  idGardien: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Garde[] | { message: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { idUser } = req.query;
  if (!idUser || Array.isArray(idUser)) {
    return res.status(400).json({ message: "Paramètre idUser requis" });
  }

  try {
    const now = new Date();
    // Format MySQL DATETIME 'YYYY-MM-DD HH:mm:ss'
    const nowStr = now.toISOString().slice(0, 19).replace("T", " ");

    const [rows] = await pool.query(
      `SELECT id AS idAnnonce, description, dateDébut, dateFin, lieu, prix, idDemandeur, idGardien
       FROM garde
       WHERE idGardien = ?
         AND confirmDemandeur = 1
         AND confirmGardien = 1
         AND dateDébut <= ?
         AND dateFin >= ?
       ORDER BY dateDébut DESC`,
      [idUser, nowStr, nowStr]
    );

    return res.status(200).json(rows as Garde[]);
  } catch (error) {
    console.error("Erreur API listerGardesEnCoursParGardien:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
