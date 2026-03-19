"use client";

import { useState } from "react";
import { useToast } from "@/context/toastContext";
import ToastContainer from "@/composants/toastContainer";
import Link from "next/link";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Recharge pour que le cookie soit pris en compte côté serveur
        window.location.href = "/";
      } else {
        const data = await res.json();
        addToast("Erreur de connexion : " + (data.message || ""), "error");
      }
    } catch (error) {
      addToast("Erreur de connexion : " + error, "error");
    }
  };

  return (
    <>
      <h1>Connexion</h1>
      <form onSubmit={handleLogin} className="classique">
        <div className="textField">
          <label>Email :</label>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="textField">
          <label>Mot de passe :</label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Bouton inversé pour bien gérer la touche entrée */}
        <div className="buttons">
          <button type="submit" className="ok">
            Connexion
          </button>
          <div className="inscription">
            <Link href="../inscription">
              <button className="action">Inscription</button>
            </Link>
            <span className="tinyText">Pas encore inscrit ?</span>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
