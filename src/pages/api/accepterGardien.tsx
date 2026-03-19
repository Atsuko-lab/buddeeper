import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { idGarde, idGardien, prix } = req.body;

  if (!idGarde || !idGardien) {
    return res
      .status(400)
      .json({ message: "ID de garde ou de gardien manquant" });
  }

  try {
    await pool.query(
      `UPDATE garde SET confirmDemandeur = 1, idGardien = ? WHERE id = ?`,
      [idGardien, idGarde],
    );

    await pool.query("UPDATE garde SET prix = ? WHERE id = ?", [prix, idGarde]);

    // 2. Récupère les infos de la garde après update
    const [rows]: any = await pool.query(
      `SELECT idDemandeur, idGardien, confirmGardien, confirmDemandeur
       FROM garde WHERE id = ?`,
      [idGarde],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Garde non trouvée" });
    }

    const garde = rows[0];

    // 3. S’ils sont tous les deux confirmés, insérer un message
    if (garde.confirmDemandeur === 1 && garde.confirmGardien === 1) {
      await pool.query(
        `INSERT INTO message (idExpéditeur, idReceveur, message, dateH, type, idAnnonce)
         VALUES (?, ?, ?, NOW(), "acceptation", ?)`,
        [
          garde.idGardien,
          garde.idDemandeur,
          "La garde est confirmée des deux côtés. Veuillez régler le paiement !",
          idGarde,
        ],
      );
      await pool.query("UPDATE garde SET etat = 'Réservé' WHERE id = ?", [
        idGarde,
      ]);
    }

    return res.status(200).json({ message: "Acceptation enregistrée" });
  } catch (error) {
    console.error("Erreur accepterGardien:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
