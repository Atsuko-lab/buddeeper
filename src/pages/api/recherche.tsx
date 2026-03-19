import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import getCoordonneesGps from "./coordonneesGps";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("POST reçu, body:", req.body);
    try {
      const { ville, startDate, endDate } = req.body;
      const coordonnees = await getCoordonneesGps(ville);

      console.log("Données de recherche  :", ville, startDate, endDate);
      console.log("Coordonnées de recherche :", coordonnees);

      // Récupère les users
      const [rows] = (await pool.query(
        `
        CALL get_users_proches('${coordonnees.lat}', '${coordonnees.lon}', 100, 10)
        `
      )) as any;

      return res.status(200).json(rows[0]);
    } catch (error: any) {
      console.error("Erreur API POST inscription:", error);
      return res.status(500).json({ message: "Erreur serveur", error: error.message || error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }
}
