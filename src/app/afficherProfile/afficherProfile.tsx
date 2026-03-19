"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AfficherProfile() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Charger l'ID depuis les paramètres d'URL
  useEffect(() => {
    const paramId = searchParams!.get("id");
    if (paramId && typeof paramId === "string") {
      setId(paramId);
    }
  }, [searchParams]);

  // Charger les infos du profil utilisateur
  useEffect(() => {
    if (!id) return;

    fetch(`/api/afficherProfile?id=${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Erreur de chargement du profil :", err));
  }, [id]);

  if (!id) return <p>Chargement des paramètres...</p>;
  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div>
      <h2>
        {user.nom} {user.prenom}
      </h2>
      <p>
        <b>Description :</b> {user.description}
      </p>
      <p>
        <b>Rôle :</b> {user.estDemandeur ? "Demandeur" : ""}
        {user.estGardien ? (user.estDemandeur ? " / Gardien" : "Gardien") : ""}
      </p>

      {Array.isArray(user.animaux) && user.animaux.length > 0 && (
        <>
          <h3>Ses animaux :</h3>
          <ul>
            {user.animaux.map((animal: any, index: number) => (
              <li key={index}>
                <b>{animal.nom}</b> ({animal.espece})<br />
                <i>Description :</i> {animal.description}
                <br />
                <i>Âge :</i> {animal.age} ans — <i>Poids :</i> {animal.poids} kg
                — <i>Taille :</i> {animal.taille}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
