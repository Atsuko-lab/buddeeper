import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../app/bdd/db";
import getCoordonneesGps from "./coordonneesGps";
import { getCurrentUser } from "./session";
import { cookies } from "next/headers";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";

const SECRET = "mon_super_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      if (!id || isNaN(Number(id))) {
        return res
          .status(400)
          .json({ message: "ID utilisateur invalide ou manquant" });
      }

      // Récupère les données de l'utilisateur connecté
      const [rows] = (await pool.query(
        "SELECT userapp.id, nom, prenom, mail, numTel, gardien, demandeur, description, adresse, ville, code_postal FROM userapp LEFT JOIN adresse ON userapp.id = adresse.id_user WHERE userapp.id = ?",
        [id]
      )) as any;
      if (rows.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      return res.status(200).json(rows[0]);
    } else if (req.method === "PUT") {
      const {
        id,
        adresse,
        ville,
        codePostal,
        numTel,
        gardien,
        demandeur,
        description,
      } = req.body;

      // Validation basique (à compléter si besoin)
      if (
        typeof adresse !== "string" ||
        typeof ville !== "string" ||
        typeof codePostal !== "string" ||
        typeof numTel !== "string" ||
        typeof gardien !== "boolean" ||
        typeof demandeur !== "boolean" ||
        typeof description !== "string"
      ) {
        return res.status(400).json({ message: "Données invalides" });
      }

      // Générer les données GPS (latitude longitude) via l'API google
      const adresseComplete = `${adresse} ${codePostal} ${ville}`;
      const { lat, lon } = await getCoordonneesGps(adresseComplete);

      await pool.query(
        "UPDATE userapp SET numTel = ?, gardien = ?, demandeur = ?, description = ? WHERE id = ?",
        [numTel, gardien ? 1 : 0, demandeur ? 1 : 0, description, id]
      );

      await pool.query(
        "UPDATE adresse SET adresse = ?, ville = ?, code_postal = ?, latitude = ?, longitude = ? WHERE id_user = ?",
        [adresse, ville, codePostal, lat, lon, id]
      );

      return res.status(200).json({ message: "Profil mis à jour avec succès" });
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      return res
        .status(405)
        .json({ message: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("Erreur /api/profile:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
