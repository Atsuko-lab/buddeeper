"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MdSend } from "react-icons/md";
import Link from "next/link";
import AddAnnonce from "@/app/annonces/addAnnonce";
import { MdAddCircleOutline } from "react-icons/md";
import Popup from "@/composants/popup";

import "@/public/styles/conversation.css";

interface Message {
  id: number;
  contenu: string;
  dateH: string;
  idExpéditeur: number;
  nom: string;
  prenom: string;
  type: string;
  idAnnonce: number | null;
  // Ajoute ici d'autres champs si besoin (ex: idGardien)
}

export default function Conversation({ currentUserId }: any) {
  const params = useParams();
  const idUserParam = params?.idUser;
  const contactUserId =
    typeof idUserParam === "string" ? parseInt(idUserParam) : NaN;

  const [messages, setMessages] = useState<Message[]>([]);
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [annoncesBloquées, setAnnoncesBloquées] = useState<number[]>([]);
  const [loadingAccept, setLoadingAccept] = useState<number | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `/api/messages?currentUserId=${currentUserId}&contactUserId=${contactUserId}`
      );
      if (!res.ok) throw new Error("Erreur lors du chargement des messages");
      const data = await res.json();

      setMessages(data.messages);
      setAnnoncesBloquées(data.annoncesBloquées || []);

      if (data.messages.length > 0) {
        setContactName(`${data.messages[0].prenom} ${data.messages[0].nom}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(contactUserId) && currentUserId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [contactUserId, currentUserId]);

  useEffect(() => {
    const messagesContainer = document.querySelector(
      ".messages-container"
    ) as HTMLDivElement | null;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [loading, messages]);

  const sendMessage = async () => {
    if (!contenu.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ currentUserId, contactUserId, contenu }),
      headers: { "Content-Type": "application/json" },
    });

    setContenu("");
    fetchMessages();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [showForm, setShowForm] = useState(false);

  const afficherForm = () => {
    setShowForm(!showForm);
  };

  const endSubmit = () => {
    // Ici tu peux recharger les annonces si besoin
    afficherForm(); // fermer la popup après soumission
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      new Date(date).toLocaleDateString("fr-FR").substring(0, 5) +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0")
    );
  };

  // Identifier le dernier message par annonce
  const derniersMessagesParAnnonce: Record<number, number> = {};
  for (const msg of [...messages].reverse()) {
    if (msg.idAnnonce && !derniersMessagesParAnnonce[msg.idAnnonce]) {
      derniersMessagesParAnnonce[msg.idAnnonce] = msg.id;
    }
  }

  // Fonction pour appeler l’API accepterGardien
  const accepterGardien = async (
    idAnnonce: number,
    idGardien: number,
    prix: number
  ) => {
    try {
      setLoadingAccept(idAnnonce);
      const res = await fetch("/api/accepterGardien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idGarde: idAnnonce, idGardien, prix }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'acceptation");
      await fetchMessages();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'acceptation de la proposition");
    } finally {
      setLoadingAccept(null);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (isNaN(contactUserId)) return <div>ID utilisateur invalide</div>;

  return (
    <div className="container">
      <div className="convHeader">
        <Link href={`/afficherProfile?id=${contactUserId}`}>{contactName}</Link>
      </div>
      <div className="messages-container">
        {messages.length === 0 ? (
          <p>Aucun message</p>
        ) : (
          messages.map((msg) => {
            const estAnnonceBloquée =
              msg.idAnnonce && annoncesBloquées.includes(msg.idAnnonce);
            const estAncienMessage =
              msg.idAnnonce &&
              derniersMessagesParAnnonce[msg.idAnnonce] !== msg.id;

            return (
              <div
                key={msg.id}
                className={`message ${
                  msg.idExpéditeur === currentUserId ? "sended" : "received"
                }`}
              >
                <div
                  style={{
                    textDecoration:
                      estAncienMessage || estAnnonceBloquée
                        ? "line-through"
                        : "none",
                    fontStyle: estAnnonceBloquée ? "italic" : "normal",
                    color: estAnnonceBloquée ? "gray" : "inherit",
                  }}
                >
                  {estAnnonceBloquée
                    ? "Garde attribuée à un autre"
                    : msg.contenu}
                </div>
                <small className="text-gray-500">{formatDate(msg.dateH)}</small>

                {/* Bouton accepter uniquement sur le dernier message de chaque annonce, non bloqué */}
                {!estAnnonceBloquée &&
                  !estAncienMessage &&
                  msg.type === "proposition" && ( // supposant que le type proposition identifie ce message
                    <button
                      disabled={loadingAccept === msg.idAnnonce}
                      onClick={() =>
                        // Ici il faut récupérer idGardien et prix dans msg ou ailleurs
                        // Par exemple supposons que idGardien est msg.idExpéditeur et prix à extraire du message
                        // Adapter selon tes données exactes
                        accepterGardien(
                          msg.idAnnonce!,
                          msg.idExpéditeur,
                          extractPrix(msg.contenu)
                        )
                      }
                      style={{
                        marginLeft: "10px",
                        padding: "4px 8px",
                        cursor:
                          loadingAccept === msg.idAnnonce
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {loadingAccept === msg.idAnnonce
                        ? "Acceptation..."
                        : "Accepter"}
                    </button>
                  )}
              </div>
            );
          })
        )}
      </div>

      <div className="sendMessageZone">
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Écrire un message..."
        />
        <button onClick={sendMessage} className="ok">
          <MdSend />
        </button>
        <ul className="card-container listeAnnonces">
          <li key="ajouter-annonce" className="card add" onClick={afficherForm}>
            <MdAddCircleOutline className="addIcon" />
            Ajouter une annonce
          </li>
        </ul>
        <Popup isOpen={showForm} onClose={afficherForm}>
          <AddAnnonce endSubmit={endSubmit} />
        </Popup>
      </div>
    </div>
  );
}

// Fonction utilitaire pour extraire le prix du contenu du message (adapter selon format)
function extractPrix(contenu: string): number {
  // Exemple simple : chercher un nombre dans le texte, à adapter
  const match = contenu.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
