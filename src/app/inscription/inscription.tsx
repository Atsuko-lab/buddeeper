"use client";
import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Inscription = () => {
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    if (
      !minLength.test(password) ||
      !upper.test(password) ||
      !lower.test(password) ||
      !number.test(password) ||
      !special.test(password)
    )
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";

    return null; // valide
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const nom = data.get("nom")?.toString() || "";
    const prenom = data.get("prenom")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";

    const validationMessage = validatePassword(password);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const payload = { nom, prenom, email, password };

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/profil";
      } else {
        setError(result.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
      setError("Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleRegister} className="classique">
      <div className="textField">
        <label>Nom de famille :</label>
        <input type="text" name="nom" placeholder="Dupond" required />
      </div>
      <div className="textField">
        <label>Prénom :</label>
        <input type="text" name="prenom" placeholder="Martin" required />
      </div>
      <div className="textField">
        <label>Email :</label>
        <input type="email" name="email" placeholder="martindupond@gmail.com" required />
      </div>
      <div className="textField">
        <label>
          Mot de passe : <span className="right">(min 8 char, Maj, Min, num, spécial)</span>
        </label>
        <input type="password" name="password" required />
      </div>

      {error && (
        <span className="formError">
          <MdOutlineClose className="icon" />
          {error}
        </span>
      )}

      <button type="submit" className="ok">
        S'inscrire
      </button>
    </form>
  );
};

export default Inscription;
