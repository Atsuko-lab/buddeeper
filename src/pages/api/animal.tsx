import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import { verify } from "jsonwebtoken";
import { Animal } from "@/models/animal";

const SECRET = "mon_super_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  let userId;
  try {
    const decoded = verify(token, SECRET) as { id: number };
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }

  switch (req.method) {
    case "GET":
      try {
        const [rows] = (await pool.query("SELECT * FROM animaux WHERE idMaitre = ?", [userId])) as any[];
        const listeAnimaux = rows.map((aniRow: any) => Animal.creerDepuisResultatRequete(aniRow));
        return res.status(200).json(listeAnimaux);
      } catch (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération" });
      }

    case "POST":
      const { nom, espece, poids, age, taille, description } = req.body;
      if (!nom || !espece) {
        return res.status(400).json({ message: "Champs requis manquants" });
      }

      try {
        await pool.query(
          "INSERT INTO animaux (idMaitre, nom, espece, poids, age, taille, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [userId, nom, espece, poids, age, taille, description]
        );
        return res.status(201).json({ message: "Animal ajouté" });
      } catch (err) {
        return res.status(500).json({ message: "Erreur lors de l’ajout" });
      }

    case "PUT":
      const { id, ...updateData } = req.body;
      console.log(updateData);

      if (!id) {
        return res.status(400).json({ message: "id animal requis" });
      }

      const fields = Object.keys(updateData)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(updateData);

      console.log("fields", fields);
      console.log("values", values);
      console.log(`UPDATE animaux SET ${fields} WHERE id = ? AND idMaitre = ?`, [...values, id, userId]);

      try {
        await pool.query(`UPDATE animaux SET ${fields} WHERE id = ? AND idMaitre = ?`, [...values, id, userId]);
        return res.status(200).json({ message: "Animal modifié" });
      } catch (err) {
        return res.status(500).json({ message: "Erreur lors de la modification" });
      }

    case "DELETE":
      console.log("Coucou");

      const idASuppr = req.body.id;
      if (!idASuppr) {
        return res.status(400).json({ message: "id requis" });
      }

      try {
        await pool.query("DELETE FROM animaux WHERE id = ? AND idMaitre = ?", [idASuppr, userId]);
        return res.status(200).json({ message: "Animal supprimé" });
      } catch (err) {
        return res.status(500).json({ message: "Erreur lors de la suppression" });
      }

    default:
      return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
