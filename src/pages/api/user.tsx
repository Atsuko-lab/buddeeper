import { User } from "@/models/user";
import pool from "../../app/bdd/db";

export default async function getUserViaMail(mail: string): Promise<User> {
  const [rows] = await pool.query<any[]>(
    `
        SELECT usr.id, nom, prenom, mail, mdp, numTel, gardien, demandeur, note, description, adr.adresse, complement, ville, code_postal, pays, latitude, longitude
        FROM userapp usr 
        JOIN adresse adr ON adr.id_user = usr.id 
        WHERE mail = ?;
    `,
    [mail]
  );

  return User.creerDepuisResultatRequete(rows[0]);
}
