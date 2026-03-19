"use client";

import { User } from "@/models/user";
import React, { useEffect, useState } from "react";
import { useToast } from "@/context/toastContext";
import ToastContainer from "@/composants/toastContainer";
import { error } from "console";

type Annonce = {
  idAnnonce: number;
  description: string;
  dateDébut: string;
  dateFin: string;
  lieu: string;
  prix: number;
  animaux?: any[];
  propositions?: any[];
};

type Garde = {
  idAnnonce: number;
  description: string;
  dateDébut: string;
  dateFin: string;
  lieu: string;
  prix: number;
  idDemandeur: number;
  idGardien: number;
};

export default function Profil({ currentUserId }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state pour modif
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [numTel, setNumTel] = useState("");
  const [gardien, setGardien] = useState(false);
  const [demandeur, setDemandeur] = useState(false);
  const [description, setDescription] = useState("");

  // Annonces de l'utilisateur
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loadingAnnonces, setLoadingAnnonces] = useState(true);

  // Gardes en cours de l'utilisateur
  const [gardesEnCours, setGardesEnCours] = useState<Garde[]>([]);
  const [loadingGardes, setLoadingGardes] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/profile?id=${currentUserId}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          const data: User = User.creerDepuisResultatRequete(json);
          setUser(data);
          setAdresse(data.adresse ? data.adresse.adresse || "" : "");
          setVille(data.adresse ? data.adresse.ville || "" : "");
          setCodePostal(data.adresse ? data.adresse.codePostal || "" : "");
          setNumTel(data.tel || "");
          setGardien(Boolean(data.gardien));
          setDemandeur(Boolean(data.demandeur));
          setDescription(data.description || "");
        } else {
          addToast("Erreur lors de la récupération du profil !", "error");
        }
      } catch (error) {
        addToast("Erreur serveur : " + error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchAnnonces = async () => {
      setLoadingAnnonces(true);
      try {
        const res = await fetch(`/api/listerAnnoncesParUtilisateur?idUser=${currentUserId}`);
        if (res.ok) {
          const data: Annonce[] = await res.json();
          setAnnonces(data);
        } else {
          console.error("Erreur fetch annonces");
        }
      } catch (error) {
        console.error("Erreur serveur fetch annonces:", error);
      } finally {
        setLoadingAnnonces(false);
      }
    };

    fetchAnnonces();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchGardesEnCours = async () => {
      setLoadingGardes(true);
      try {
        const res = await fetch(`/api/listerGardesEnCoursParGardien?idUser=${currentUserId}`);
        if (res.ok) {
          const data: Garde[] = await res.json();
          setGardesEnCours(data);
        } else {
          console.error("Erreur fetch gardes en cours");
        }
      } catch (error) {
        console.error("Erreur serveur fetch gardes en cours:", error);
      } finally {
        setLoadingGardes(false);
      }
    };

    fetchGardesEnCours();
  }, [currentUserId]);

  const getEtatAnnonce = (annonce: Annonce) => {
    const now = new Date();
    const dateDebut = new Date(annonce.dateDébut);
    const dateFin = new Date(annonce.dateFin);

    if (now < dateDebut) return "Proposé";
    if (now >= dateDebut && now <= dateFin) return "En cours";
    if (now > dateFin) return "Fini";
    return "Inconnu";
  };

  const annoncesProposees = annonces.filter((a) => getEtatAnnonce(a) === "Proposé");
  const annoncesEnCours = annonces.filter((a) => getEtatAnnonce(a) === "En cours");
  const annoncesFinies = annonces.filter((a) => getEtatAnnonce(a) === "Fini");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (adresse.trim() === "") {
        const anchor = (e.target as HTMLElement).closest("a");
        if (anchor) {
          const href = anchor.getAttribute("href");
          if (href && (href.startsWith("/") || href.startsWith("#"))) {
            e.preventDefault();
            e.stopPropagation();
            addToast("Veuillez remplir votre adresse avant de quitter cette page", "error");
          }
        }
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [adresse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: user!.id,
          adresse,
          ville,
          codePostal,
          numTel,
          gardien,
          demandeur,
          description,
        }),
      });
      if (res.ok) {
        addToast("Profil mis à jour", "success");
      } else {
        addToast("Erreur lors de la mise à jour", "error");
      }
    } catch (error) {
      console.error("Erreur update profil:", error);
      addToast("Erreur serveur : " + error, "error");
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!user) return <p>Utilisateur non trouvé ou non connecté.</p>;

  return (
    <div className="profileEditor">
      <h1>
        Profil de {user.nom} {user.prenom}
      </h1>

      <form onSubmit={handleSubmit} className="classique">
        <div className="textField">
          <label>Adresse :</label>
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
        </div>
        <div className="textField">
          <label>Ville :</label>
          <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} required />
        </div>

        <div className="textField">
          <label>Code postale :</label>
          <input type="text" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} required />
        </div>

        <div className="textField">
          <label>Numéro de téléphone :</label>
          <input
            type="tel"
            value={numTel}
            pattern="^\+?[0-9\s\-]{7,15}$"
            title="Format téléphone valide (ex: +33612345678)"
            onChange={(e) => setNumTel(e.target.value)}
            required
          />
        </div>
        <div className="userTypeChoice">
          <div className="checkboxField">
            <input id="gardien" type="checkbox" checked={gardien} onChange={(e) => setGardien(e.target.checked)} />
            <label htmlFor="gardien">Gardien</label>
          </div>
          <div className="checkboxField">
            <input
              id="demandeur"
              type="checkbox"
              checked={demandeur}
              onChange={(e) => setDemandeur(e.target.checked)}
            />
            <label htmlFor="demandeur">Demandeur</label>
          </div>
        </div>

        <div>
          <label>Description :</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </div>
        <button type="submit" className="ok">
          Mettre à jour
        </button>
      </form>
      <ToastContainer />

      <hr />

      <section>
        <h2>Mes annonces proposées</h2>
        {loadingAnnonces ? (
          <p>Chargement des annonces...</p>
        ) : annoncesProposees.length === 0 ? (
          <p>Aucune annonce proposée.</p>
        ) : (
          annoncesProposees.map((a) => (
            <div
              key={a.idAnnonce}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
              }}
            >
              <p>
                <strong>Description :</strong> {a.description}
              </p>
              <p>
                <strong>Lieu :</strong> {a.lieu}
              </p>
              <p>
                <strong>Date début :</strong> {new Date(a.dateDébut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin :</strong> {new Date(a.dateFin).toLocaleDateString()}
              </p>
              <p>
                <strong>Prix :</strong> {a.prix} €
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Mes annonces en cours</h2>
        {loadingAnnonces ? (
          <p>Chargement des annonces...</p>
        ) : annoncesEnCours.length === 0 ? (
          <p>Aucune annonce en cours.</p>
        ) : (
          annoncesEnCours.map((a) => (
            <div
              key={a.idAnnonce}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
              }}
            >
              <p>
                <strong>Description :</strong> {a.description}
              </p>
              <p>
                <strong>Lieu :</strong> {a.lieu}
              </p>
              <p>
                <strong>Date début :</strong> {new Date(a.dateDébut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin :</strong> {new Date(a.dateFin).toLocaleDateString()}
              </p>
              <p>
                <strong>Prix :</strong> {a.prix} €
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Mes annonces finies</h2>
        {loadingAnnonces ? (
          <p>Chargement des annonces...</p>
        ) : annoncesFinies.length === 0 ? (
          <p>Aucune annonce finie.</p>
        ) : (
          annoncesFinies.map((a) => (
            <div
              key={a.idAnnonce}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
              }}
            >
              <p>
                <strong>Description :</strong> {a.description}
              </p>
              <p>
                <strong>Lieu :</strong> {a.lieu}
              </p>
              <p>
                <strong>Date début :</strong> {new Date(a.dateDébut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin :</strong> {new Date(a.dateFin).toLocaleDateString()}
              </p>
              <p>
                <strong>Prix :</strong> {a.prix} €
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Mes gardes en cours</h2>
        {loadingGardes ? (
          <p>Chargement des gardes...</p>
        ) : gardesEnCours.length === 0 ? (
          <p>Aucune garde en cours.</p>
        ) : (
          gardesEnCours.map((g) => (
            <div
              key={g.idAnnonce}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
              }}
            >
              <p>
                <strong>Description :</strong> {g.description}
              </p>
              <p>
                <strong>Lieu :</strong> {g.lieu}
              </p>
              <p>
                <strong>Date début :</strong> {new Date(g.dateDébut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin :</strong> {new Date(g.dateFin).toLocaleDateString()}
              </p>
              <p>
                <strong>Prix :</strong> {g.prix} €
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
