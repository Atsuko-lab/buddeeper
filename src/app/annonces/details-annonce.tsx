"use client";

import { MdLocationPin, MdOutlineCalendarMonth, MdOutlineTimer, MdOutlineCake } from "react-icons/md";
import { GiWeight } from "react-icons/gi";

import "@/public/styles/annonce.css";
import "@/public/styles/card.css";
import { Animal } from "@/models/animal";
import { Proposition } from "@/models/proposition";
import AnimalIcon from "@/composants/animalIcon";
import Link from "next/link";
import { FormEvent } from "react";
import { useToast } from "@/context/toastContext";
import ToastContainer from "@/composants/toastContainer";

type DetailsAnnonceProps = {
  selectedAnnonce: any;
  currentUserId: number;
};

const DetailsAnnonce: React.FC<DetailsAnnonceProps> = ({ selectedAnnonce, currentUserId }) => {
  const { addToast } = useToast();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR").substring(0, 5);
  };

  const getDuree = (dateDebut: string, dateFin: string) => {
    const dateD = new Date(dateDebut).getTime();
    const dateF = new Date(dateFin).getTime();
    const differenceEnTemps = Math.abs(dateF - dateD);
    const differenceEnJours = Math.ceil(differenceEnTemps / (1000 * 60 * 60 * 24));
    return differenceEnJours + 1;
  };

  const accepterProposition = async (idAnnonce: number, idGardien: number) => {
    try {
      const res = await fetch("/api/accepterGardien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idGarde: idAnnonce, idGardien }),
      });

      const result = await res.json();

      if (res.ok) {
        addToast("Proposition acceptée !", "success");
      } else {
        addToast("Erreur " + result.message, "error");
      }
    } catch (error) {
      addToast("Erreur " + error, "error");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, idAnnonce: number, idReceveur: number) => {
    e.preventDefault();
    const prix = new FormData(e.currentTarget).get("prix");

    const payload = {
      idGarde: idAnnonce,
      idGardien: currentUserId,
      idReceveur: idReceveur,
      prix,
    };

    try {
      const res = await fetch("/api/propositionGardePrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast("Proposition envoyée !", "success");
      } else {
        const result = await res.json();
        addToast("Erreur " + result.message, "error");
      }
    } catch (error) {
      addToast("Erreur " + error, "error");
    }
  };

  return (
    <>
      {selectedAnnonce && (
        <div className="detailsAnnonce">
          <h2>
            <Link href={`/afficherProfile?id=${selectedAnnonce.idDemandeur}`}>{selectedAnnonce.prenom} </Link>à besoin
            de vous
          </h2>
          <div className="dateEtLieu">
            <div>
              <MdLocationPin /> {selectedAnnonce.lieu}
            </div>
            <div>
              <MdOutlineCalendarMonth />
              {formatDate(selectedAnnonce.dateDébut)}
            </div>
            <div>
              <MdOutlineTimer />
              {getDuree(selectedAnnonce.dateDébut, selectedAnnonce.dateFin)} jours
            </div>
          </div>
          <div className="animauxEtDescription">
            <div>
              <h4 className="descrPartTitle">A la recherche d'une nounou :</h4>
              <div className="animaux">
                {selectedAnnonce.animaux && selectedAnnonce.animaux.length > 0 ? (
                  selectedAnnonce.animaux.map((animal: Animal) => (
                    <div className="animal card" key={animal.nom}>
                      <div className="nomEtEspece">
                        <AnimalIcon espece={animal.espece} /> {animal.nom}
                      </div>
                      <div>
                        <MdOutlineCake></MdOutlineCake> {animal.age} ans
                      </div>
                      <div>
                        <GiWeight></GiWeight> {animal.poids} kg
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Aucun animal trouvé.</div>
                )}
              </div>
            </div>
            <div className="description">
              <h4 className="descrPartTitle">Le message de {selectedAnnonce.prenom}:</h4>
              <p>{selectedAnnonce.description}</p>
            </div>
          </div>

          <hr />

          {/* Affichage des propositions si c'est notre annonce */}
          {selectedAnnonce.idDemandeur === currentUserId ? (
            <div>
              <h4 className="descrPartTitle">Propositions reçues :</h4>
              {selectedAnnonce.propositions && selectedAnnonce.propositions.length > 0 ? (
                <ul className="listePropositions">
                  {selectedAnnonce.propositions.map((p: Proposition) => (
                    <li key={p.id} className="proposition card">
                      <div>
                        {p.nomGardien} {p.prenomGardien}
                      </div>
                      <div>{p.prix}€</div>
                      <div className="actions">
                        <Link href={`/conversation/${p.idGardien}`}>
                          <button className="boutonDiscuter add">Discuter</button>
                        </Link>
                        <button
                          onClick={() => accepterProposition(selectedAnnonce.idAnnonce, p.idGardien)}
                          className="boutonAccepter ok"
                        >
                          Accepter
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucune proposition pour cette annonce.</p>
              )}
            </div>
          ) : (
            <div className="proposerPrix">
              <h4 className="descrPartTitle center">Proposez vos service :</h4>
              <div className="actions">
                <Link href={`/conversation/${selectedAnnonce.idDemandeur}`}>
                  <button className="action">Discuter avec {selectedAnnonce.prenom}</button>
                </Link>

                <span> OU </span>

                <form onSubmit={(e) => handleSubmit(e, selectedAnnonce.idAnnonce, selectedAnnonce.idDemandeur)}>
                  <div>
                    <input type="number" name="prix" placeholder="50" required />
                    <span> € </span>
                  </div>
                  <button type="submit" className="ok">
                    Proposer un prix
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default DetailsAnnonce;
