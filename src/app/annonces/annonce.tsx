"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MdLocationPin,
  MdOutlineCalendarMonth,
  MdOutlineTimer,
  MdAddCircleOutline,
  MdOutlineRemoveRedEye,
  MdOutlineChat,
  MdDelete, // ajout icône poubelle
} from "react-icons/md";

import "@/public/styles/annonce.css";
import "@/public/styles/card.css";
import AddAnnonce from "./addAnnonce";
import Popup from "@/composants/popup";
import AnimalIcon from "@/composants/animalIcon";
import DetailsAnnonce from "./details-annonce";
import ToastContainer from "@/composants/toastContainer";
import { useToast } from "@/context/toastContext";

export default function Annonce({ currentUserId }: any) {
  const [mesAnnonces, setMesAnnonces] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  // Nouveau state : nombre de propositions par annonce (clé: idAnnonce)
  const [propositionsCount, setPropositionsCount] = useState({});

  // Nouveau state : suivi des propositions vues (clé: idAnnonce)
  const [seenPropositions, setSeenPropositions] = useState({});

  const { addToast } = useToast();

  useEffect(() => {
    getAnnonces();
    getPropositionsCount();
  }, []);

  // Récupérer la liste des annonces
  const getAnnonces = () => {
    fetch("/api/listerAnnonces")
      .then((res) => res.json())
      .then((allAnnonces) => {
        if (Array.isArray(allAnnonces as any)) {
          setMesAnnonces(allAnnonces.filter((ann) => ann.idDemandeur === currentUserId));
          setAnnonces(allAnnonces.filter((ann) => ann.idDemandeur !== currentUserId));
        }
      });
  };

  // Récupérer le nombre de propositions par annonce
  const getPropositionsCount = () => {
    fetch("/api/nbrPropositionParAnnonce")
      .then((res) => res.json())
      .then((data) => {
        // Transforme tableau en objet { idGarde: nbPropositions }
        const countMap: Record<string, number> = {};
        data.forEach(({ idGarde, nbPropositions }) => {
          countMap[idGarde] = nbPropositions;
        });
        setPropositionsCount(countMap);
      });
  };

  const afficherForm = () => {
    setShowForm(!showForm);
  };

  const endSubmit = () => {
    getAnnonces();
    getPropositionsCount();
    afficherForm();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR").substring(0, 5);
  };

  const getDuree = (dateDebut: string, dateFin: string) => {
    const dateD = new Date(dateDebut);
    const dateF = new Date(dateFin);
    const differenceEnTemps = Math.abs(dateF.getTime() - dateD.getTime());
    const differenceEnJours = Math.ceil(differenceEnTemps / (1000 * 60 * 60 * 24));
    return differenceEnJours + 1;
  };

  const handleAnnonceClick = (annonce: any) => {
    setSelectedAnnonce(annonce);
    setShowDetailsPopup(true);

    // Marquer la proposition comme vue, donc supprimer la bulle
    setSeenPropositions((prev) => ({
      ...prev,
      [annonce.idAnnonce]: true,
    }));
  };

  // --- Nouvelle fonction pour supprimer une annonce ---
  const handleSupprimerAnnonce = (idAnnonce: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    fetch("/api/supprimerAnnonce", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAnnonce }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        // Mise à jour des annonces après suppression
        getAnnonces();
        getPropositionsCount();
      })
      .catch((err) => {
        addToast("Erreur lors de la suppression : " + err.message, "error");
      });
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
  };

  return (
    <section>
      <h2>Mes annonces postées</h2>
      <ul className="card-container listeAnnonces">
        <li key="ajouter-annonce" className="card add" onClick={afficherForm}>
          <MdAddCircleOutline className="addIcon" />
          Ajouter une annonce
        </li>

        {mesAnnonces.map((a) => {
          const nbProp = propositionsCount[a.idAnnonce] || 0;
          const isSeen = seenPropositions[a.idAnnonce] || false;

          return (
            <li key={a.idAnnonce} className="card annonce" style={{ position: "relative" }}>
              <h3
                className="annonceHead"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link href={`/afficherProfile?id=${a.idDemandeur}`}>
                  {a.nom} {a.prenom}
                </Link>
                <div>
                  <button
                    className="action icon tiny"
                    onClick={() => handleAnnonceClick(a)}
                    style={{ marginRight: "8px" }}
                    title="Voir détails"
                  >
                    <MdOutlineRemoveRedEye />
                  </button>

                  {/* Bouton Supprimer */}
                  <button
                    className="action icon tiny"
                    onClick={() => handleSupprimerAnnonce(a.idAnnonce)}
                    title="Supprimer annonce"
                    style={{ color: "red" }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </h3>

              {/* Bulle rouge des propositions non vues */}
              {nbProp > 0 && !isSeen && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {nbProp}
                </div>
              )}

              <div className="dateEtLieu">
                <div>
                  <MdLocationPin />
                  {a.lieu}
                </div>
                <div>
                  <MdOutlineCalendarMonth />
                  {formatDate(a.dateDébut)}
                </div>
                <div>
                  <MdOutlineTimer />
                  {getDuree(a.dateDébut, a.dateFin)}j
                </div>
              </div>

              {a.animaux && a.animaux.length > 0 && (
                <div className="animauxDansAnnonce">
                  {a.animaux.map((animal: any) => (
                    <span key={animal.id}>
                      <AnimalIcon espece={animal.espece} />
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h2>Besoin d'un gardien !</h2>
      <ul className="card-container listeAnnonces">
        {annonces.map((a) => (
          <li key={a.idAnnonce} className="card annonce">
            <div className="annonceHead">
              <div className="demandeur">
                {a.nom} {a.prenom}
              </div>
              {a.animaux && a.animaux.length > 0 && (
                <div className="animauxDansAnnonce">
                  {a.animaux.map((animal: any) => (
                    <span key={animal.id}>
                      <AnimalIcon espece={animal.espece} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="dateEtLieu">
              <div>
                <MdLocationPin />
                {a.lieu}
              </div>
              <div>
                <MdOutlineCalendarMonth />
                {formatDate(a.dateDébut)}
              </div>
              <div>
                <MdOutlineTimer />
                {getDuree(a.dateDébut, a.dateFin)}j
              </div>
            </div>

            <div className="actions">
              <button className="action icon">
                <Link href={`/conversation/${a.idDemandeur}`}>
                  <MdOutlineChat />
                </Link>
              </button>
              <button className="action icon" onClick={() => handleAnnonceClick(a)}>
                <MdOutlineRemoveRedEye />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Popup isOpen={showForm} onClose={afficherForm}>
        <AddAnnonce endSubmit={endSubmit} />
      </Popup>

      <Popup isOpen={showDetailsPopup} onClose={closeDetailsPopup}>
        <DetailsAnnonce selectedAnnonce={selectedAnnonce} currentUserId={currentUserId} />
      </Popup>
      <ToastContainer />
    </section>
  );
}
