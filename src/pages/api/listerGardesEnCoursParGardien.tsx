import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../app/bdd/db"; // à adapter selon ta connexion MySQL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { idUser } = req.query;

  if (!idUser) {
    return res.status(400).json({ message: "Paramètre manquant : idUser" });
  }

  try {
    const [gardes] = await db.query(
      `SELECT * FROM garde 
       WHERE idGardien = ? AND etat = 'En cours'`,
      [idUser]
    );

    res.status(200).json(gardes);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des gardes en cours :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
}
