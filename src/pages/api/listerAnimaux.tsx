import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import { verify } from "jsonwebtoken";

const SECRET = "mon_super_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Méthode non autorisée" });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Non authentifié" });

  let user: any;
  try {
    user = verify(token, SECRET);
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }

  try {
    const [animaux]: any = await pool.query(`SELECT * FROM animaux WHERE idMaitre = ?`, [user.id]);
    res.status(200).json(animaux);
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
