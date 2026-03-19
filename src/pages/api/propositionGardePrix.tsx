import pool from "../../app/bdd/db";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { idGarde, idGardien, prix, idReceveur } = req.body;

    try {
      // Insérer dans la table propositiongarde

      await pool.query(
        "DELETE from propositiongarde WHERE idGarde = ? AND idGardien = ? ",
        [idGarde, idGardien]
      );
      const [result] = await pool.query(
        "INSERT INTO propositiongarde (idGarde, idGardien, prix, dateProposition) VALUES (?, ?, ?, NOW())",
        [idGarde, idGardien, prix]
      );

      // Créer le message avec la syntaxe correcte pour inclure la variable `prix`
      const messageContent = `Vous avez reçu une proposition de garde de ma part pour : ${prix}`;
      const typeMessage = "proposition";

      // Insérer dans la table message
      await pool.query(
        "INSERT INTO message (idExpéditeur, idReceveur, message, dateH, type, idAnnonce) VALUES (?, ?, ?, NOW(), ?, ?)",
        [idGardien, idReceveur, messageContent, typeMessage, idGarde]
      );

      await pool.query(`UPDATE garde SET confirmGardien = 1 WHERE id = ?`, [
        idGarde,
      ]);

      res.status(201).json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT idGarde, idGardien, prix, dateProposition FROM propositiongarde"
      );
      res.status(200).json(rows);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
