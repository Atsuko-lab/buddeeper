import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET = "mon_super_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { nom, prenom, email, password } = req.body;

      if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ message: "Champs requis manquants" });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer dans la table "userapp"
      const [result] = (await pool.execute("INSERT INTO userapp (nom, prenom, mail, mdp) VALUES (?, ?, ?, ?)", [
        nom,
        prenom,
        email,
        hashedPassword,
      ])) as any;

      // Créer une adresse vide
      await pool.execute("INSERT INTO adresse (id_user) VALUES (?)", [result.insertId]);

      // Récupérer l'utilisateur nouvellement créé
      const [userRows] = (await pool.query("SELECT * FROM userapp WHERE id = ?", [result.insertId])) as any;

      const user = userRows[0];
      const userPayload = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.mail,
      };

      // Générer le token JWT
      const token = jwt.sign(userPayload, SECRET, { expiresIn: "1h" });

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

      return res.status(200).json({ message: "Inscription et connexion réussies" });
    } catch (error: any) {
      console.error("Erreur API POST inscription:", error);
      let message;
      if (error.errno === 1062) {
        message = "Utilisateur déja inscrit";
      } else {
        message = "Erreur serveur inconnue, contactez le webmaster pour en savoir plus";
      }
      return res.status(500).json({ message: message, error: error.message || error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }
}
