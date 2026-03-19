import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import { verify } from "jsonwebtoken";

const SECRET = "mon_super_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Méthode non autorisée" });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  let user: any;
  try {
    user = verify(token, SECRET);
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }

  const { idAnnonce } = req.body;
  if (!idAnnonce)
    return res.status(400).json({ message: "idAnnonce manquant" });

  try {
    // Vérifier que l'annonce appartient bien à l'utilisateur
    const [rows]: any = await pool.query(
      "SELECT idDemandeur FROM garde WHERE id = ?",
      [idAnnonce]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Annonce non trouvée" });
    if (rows[0].idDemandeur !== user.id)
      return res
        .status(403)
        .json({ message: "Pas autorisé à supprimer cette annonce" });

    // Supprimer les animaux liés
    await pool.query("DELETE FROM anidansannonce WHERE idGarde = ?", [
      idAnnonce,
    ]);

    // Supprimer les messages liés (proposition garde)
    await pool.query("DELETE FROM message WHERE idAnnonce = ?", [idAnnonce]);

    // Supprimer la garde
    await pool.query("DELETE FROM garde WHERE id = ?", [idAnnonce]);

    res.status(200).json({ message: "Annonce supprimée" });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
