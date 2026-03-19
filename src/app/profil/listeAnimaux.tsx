"use client";

import { useEffect, useState } from "react";

import { MdOutlineDelete, MdOutlineEdit, MdAddCircleOutline } from "react-icons/md";

import "@/public/styles/card.css";
import "@/public/styles/animal.css";
import Popup from "@/composants/popup";
import AjouterAnimal from "./ajouterAnimal";
import { Animal } from "@/models/animal";
import AnimalIcon from "@/composants/animalIcon";

export default function ListeAnimaux() {
  const [animaux, setAnimaux] = useState<Animal[]>([]);
  const [form, setForm] = useState({ nom: "", espece: "", poids: "", age: "", taille: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);

  const afficherForm = () => {
    setShowForm(!showForm);
  };

  const fetchAnimaux = async () => {
    const res = await fetch("/api/animal");
    if (res.ok) {
      const data = (await res.json()) as Animal[];
      setAnimaux(data);
    }
  };

  useEffect(() => {
    fetchAnimaux();
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/animal", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) fetchAnimaux();
  };

  const handleEdit = (animal: Animal) => {
    setEditId(animal.idMaitre);
    setForm(animal as any);
    console.log(form);
    afficherForm();
  };

  const endSubmit = () => {
    setForm({ nom: "", espece: "", poids: "", age: "", taille: "", description: "" });
    setEditId(null);
    afficherForm();
    fetchAnimaux();
  };

  return (
    <div className="animalsManager">
      <h2>Mes animaux</h2>
      <ul className="card-container">
        {animaux.map((animal: Animal) => (
          <li key={animal.id} className="card">
            <h3>
              <AnimalIcon espece={animal.espece}></AnimalIcon>
              <span className="animalName">{animal.nom}</span>
              <div className="boutonsActions">
                <MdOutlineEdit className="action modifier" onClick={() => handleEdit(animal)}></MdOutlineEdit>
                <MdOutlineDelete className="action supprimer" onClick={() => handleDelete(animal.id)}></MdOutlineDelete>
              </div>
            </h3>
          </li>
        ))}
        <li key="Ajouter animal" className="card add" onClick={afficherForm}>
          <MdAddCircleOutline className="addIcon" />
          Ajouter un animal
        </li>
      </ul>

      <Popup isOpen={showForm} onClose={afficherForm}>
        <AjouterAnimal editId={editId} f={form} endSubmit={endSubmit} />
      </Popup>
    </div>
  );
}
