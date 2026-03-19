"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Conversation {
  interlocuteurId: number;
  nom: string;
  prenom: string;
  dernierMessageDate: string;
  nbNonLus: number;
}

export default function ListeConversations({ currentUserId }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch(`/api/listeConversations?id=${currentUserId}`);
      const data = await res.json();
      setConversations(data);
    };

    fetchConversations();

    const interval = setInterval(fetchConversations, 5000); // refresh toutes les 5s
    return () => clearInterval(interval);
  }, [currentUserId]);

  const openConversation = (id: number) => {
    router.push(`/conversation/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes conversations</h1>
      {conversations.length === 0 ? (
        <p>Aucune conversation trouvée.</p>
      ) : (
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv.interlocuteurId}
              className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => openConversation(conv.interlocuteurId)}
            >
              <div className="flex items-center gap-2">
                <span>
                  {conv.prenom} {conv.nom} -{" "}
                  {new Date(conv.dernierMessageDate).toLocaleString()}
                </span>
                {conv.nbNonLus > 0 && (
                  <span
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "0 8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      minWidth: "20px",
                      textAlign: "center",
                      lineHeight: "20px",
                    }}
                  >
                    {conv.nbNonLus}
                  </span>
                )}
              </div>

              <Link href={`/afficherProfile?id=${conv.interlocuteurId}`}>
                <button
                  className="action"
                  onClick={(e) => e.stopPropagation()} // Stoppe la propagation vers le li
                >
                  Profil
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
