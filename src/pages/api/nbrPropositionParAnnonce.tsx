import pool from "../../app/bdd/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [rows] = await pool.query(`
      SELECT idGarde, COUNT(*) as nbPropositions
      FROM propositiongarde
      GROUP BY idGarde
    `);

    res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
