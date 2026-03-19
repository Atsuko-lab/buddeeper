import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import pool from "../../app/bdd/db";
import bcrypt from "bcryptjs";
import getUserViaMail from "./user";

const SECRET = "mon_super_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont requis" });
    }

    // Requête SQL pour récupérer l’utilisateur par mail
    const [rows] = (await pool.query("SELECT * FROM userapp WHERE mail = ?", [email])) as any;

    if (rows.length === 0) {
      return res.status(401).json({ message: "Combinaison erronée" });
    }

    const user = rows[0];

    // Vérifier que le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.mdp);
    if (!isMatch) {
      return res.status(401).json({ message: "Combinaison erronée" });
    }

    const userObj = await getUserViaMail(email);

    // Générer un token JWT
    const token = jwt.sign(userObj.serialize(), SECRET, { expiresIn: "1h" });

    // Envoyer le token dans un cookie HTTPOnly
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 3600,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    );

    return res.status(200).json({ message: "Connexion réussie" });
  } catch (error: any) {
    console.error("Erreur API POST login:", error.message || error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message || error });
  }
}
