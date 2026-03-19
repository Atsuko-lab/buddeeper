"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AnimalIcon from "@/composants/animalIcon";

import "@/public/styles/card.css";
import "@/public/styles/animal.css";

export default function AjouterAnimal({
  endSubmit,
  editId = null,
  f = { nom: "", espece: "", poids: "", age: "", taille: "", description: "" },
}: any) {
  const [form, setForm] = useState(f);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changeEspeceSelect = (espece: string) => {
    const especeButton = document.querySelector(".choixEspece ." + espece)! as HTMLDivElement;
    document.querySelector(".choixEspece .selected")?.classList.remove("selected");
    especeButton.classList.add("selected");

    const especeInput = document.querySelector("#especeInput")! as HTMLInputElement;
    if (espece === "autre") {
      espece = "";
      especeInput.parentElement!.classList.remove("hidden");
    } else {
      especeInput.parentElement!.classList.add("hidden");
    }
    especeInput.value = espece;
    setForm({ ...form, [especeInput.name]: especeInput.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;

    const res = await fetch("/api/animal", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      endSubmit();
    }
  };

  return (
    <>
      <h2>Ajouter un animal</h2>
      <form onSubmit={handleSubmit} className="addAnimal classique">
        <div className="textField">
          <label>Nom :</label>
          <input name="nom" type="text" placeholder="Rosie" value={form.nom} onChange={handleChange} required />
        </div>

        <div className="choixEspece">
          <div className="card chien tooltip" onClick={() => changeEspeceSelect("chien")}>
            <span className="tooltipText">Chien</span>
            <AnimalIcon espece="chien"></AnimalIcon>
          </div>
          <div className="card chat tooltip" onClick={() => changeEspeceSelect("chat")}>
            <span className="tooltipText">Chat</span>
            <AnimalIcon espece="chat"></AnimalIcon>
          </div>
          <div className="card lapin tooltip" onClick={() => changeEspeceSelect("lapin")}>
            <span className="tooltipText">Lapin</span>
            <AnimalIcon espece="lapin"></AnimalIcon>
          </div>
          <div className="card poisson tooltip" onClick={() => changeEspeceSelect("poisson")}>
            <span className="tooltipText">Poisson</span>
            <AnimalIcon espece="poisson"></AnimalIcon>
          </div>
          <div className="card oiseau tooltip" onClick={() => changeEspeceSelect("oiseau")}>
            <span className="tooltipText">Oiseau</span>
            <AnimalIcon espece="oiseau"></AnimalIcon>
          </div>
          <div className="card autre tooltip" onClick={() => changeEspeceSelect("autre")}>
            <span className="tooltipText">Autre</span>
            <AnimalIcon espece="autre"></AnimalIcon>
          </div>
        </div>

        <div className="textField hidden">
          <input
            id="especeInput"
            name="espece"
            type="text"
            placeholder="Varan, Migale"
            value={form.espece}
            onChange={handleChange}
            className=""
            required
          />
        </div>

        <div className="animalInfo">
          <div className="textField">
            <label>Age :</label>
            <input name="age" type="number" placeholder="5" value={form.age} onChange={handleChange} required />
          </div>
          <div className="textField">
            <label>Poids (en kg) :</label>
            <input name="poids" type="number" placeholder="12" value={form.poids} onChange={handleChange} required />
          </div>
        </div>
        {
          // TODO: Supprimer la taille ?
          /* <div className="textField">
          <label>Taille (en cm) :</label>
          <input name="taille" type="number" placeholder="50" value={form.taille} onChange={handleChange} />
        </div> */
        }
        <div className="textField">
          <label>Description :</label>
          <textarea
            name="description"
            placeholder="Très calme, gentil avec les enfants, foufou, ..."
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="ok">
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </>
  );
}
