"use client";
import React from "react";
import Link from "next/link";
import { MdOutlineChat } from "react-icons/md";

import "@/public/styles/card.css";
import "@/public/styles/recherche.css";

const ResultatRecherche = ({ gardiens }: any) => {
  return (
    <ul className="card-container">
      {gardiens.map((gardien: any) => (
        <li key={gardien.id} className="card">
          <h3>
            <Link href={`/afficherProfile?id=${gardien.id}`}>
              {gardien.nom} {gardien.prenom}
            </Link>
            <Link href={`/conversation/${gardien.id}`}>
              <button className="action icon tiny">
                <MdOutlineChat />
              </button>
            </Link>
          </h3>
          <p>{gardien.distance.toFixed(1)} km</p>
          {gardien.note && <span>{gardien.note} / 5</span>}
        </li>
      ))}
    </ul>
  );
};

export default ResultatRecherche;
