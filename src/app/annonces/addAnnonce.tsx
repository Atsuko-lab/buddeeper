"use client";

import { useEffect, useState } from "react";
import { MdOutlineArrowBack, MdOutlineArrowForward } from "react-icons/md";

import "@/public/styles/animal.css";
import "@/public/styles/annonce.css";
import "@/public/styles/card.css";
import AnimalIcon from "@/composants/animalIcon";
import ToastContainer from "@/composants/toastContainer";
import { useToast } from "@/context/toastContext";

export default function AddAnnonce({ endSubmit }: any) {
  const [mesAnimaux, setMesAnimaux] = useState<any[]>([]);
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState({
    description: "",
    dateDébut: new Date().toISOString().split("T")[0], // aujourd’hui
    dateFin: "",
    lieu: "",
    prix: "",
    animaux: [] as number[],
  });

  useEffect(() => {
    fetch("/api/listerAnimaux")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMesAnimaux(data);
        else setMesAnimaux([]);
      });
  }, []);

  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === "animaux") {
      const val = Number(value);
      let newAnimaux = [...form.animaux];

      if ((e.target as HTMLInputElement).checked) {
        if (!newAnimaux.includes(val)) newAnimaux.push(val);
      } else {
        newAnimaux = newAnimaux.filter((id) => id !== val);
      }

      setForm((prev) => ({ ...prev, animaux: newAnimaux }));
    } else {
      // Vérifications logiques de date
      if (name === "dateDébut" && form.dateFin && value > form.dateFin) {
        addToast("La date de début doit être anterieur à la date de fin", "error");
        return;
      }

      if (name === "dateFin" && form.dateDébut && value < form.dateDébut) {
        addToast("La date de fin doit être ulterieur à la date de début", "error");
        return;
      }

      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/creerAnnonce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      addToast("Annonce crée !", "success");
      endSubmit();

      setForm({
        description: "",
        dateDébut: new Date().toISOString().split("T")[0],
        dateFin: "",
        lieu: "",
        prix: "",
        animaux: [],
      });
    } else {
      const error = await res.json();
      addToast("Erreur " + error.message, "error");
    }
  };

  const goStep = (nextStep: number) => {
    if (step === 1 && nextStep === 2) {
      if (form.animaux.length === 0) {
        addToast("Choisir au moins 1 animal", "error");
        return;
      }
    }
    const currentStepEl = document.querySelector(".step" + step);
    currentStepEl?.classList.add("cache");
    setTimeout(() => {
      setStep(nextStep);
    }, 200);
  };

  useEffect(() => {
    const nextStepEl = document.querySelector(`.step${step}`);
    nextStepEl?.classList.remove("precache");
    nextStepEl?.classList.remove("cache");
  }, [step]);

  return (
    <>
      <form onSubmit={handleSubmit} className="classique addAnnonce">
        {step === 1 && (
          <>
            <fieldset className="step step1">
              {/* Choix animaux */}
              <h2>Animaux à garder</h2>
              {Array.isArray(mesAnimaux) && mesAnimaux.length > 0 ? (
                mesAnimaux.map((animal) => (
                  <div className="checkboxField" key={animal.id}>
                    <input
                      type="checkbox"
                      name="animaux"
                      id={"animal" + animal.id}
                      value={animal.id}
                      checked={form.animaux.includes(animal.id)}
                      onChange={handleChange}
                    />
                    <label htmlFor={"animal" + animal.id}>
                      <AnimalIcon espece={animal.espece}></AnimalIcon> {animal.nom}
                    </label>
                  </div>
                ))
              ) : (
                <p>Aucun animal trouvé.</p>
              )}
            </fieldset>
            <div onClick={() => goStep(2)} className={form.animaux ? "stepButton" : "stepButton disable"}>
              <span>Suivant</span>
              <MdOutlineArrowForward />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="step step2 precache">
            <div className="dates">
              <div className="textField">
                <label>Début :</label>
                <input
                  type="date"
                  name="dateDébut"
                  value={form.dateDébut}
                  max={form.dateFin || undefined}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="textField">
                <label>Fin :</label>
                <input
                  type="date"
                  name="dateFin"
                  value={form.dateFin}
                  min={form.dateDébut || undefined}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="textField">
              <label>Lieu :</label>
              <input type="text" name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} required />
            </div>
            <div className="textField">
              <label>Description :</label>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="buttons">
              <div onClick={() => goStep(1)} className="stepButton">
                <MdOutlineArrowBack />
                <span>Retour</span>
              </div>
              <button type="submit" className="ok">
                Créer une annonce
              </button>
            </div>
          </div>
        )}
      </form>
      <ToastContainer />
    </>
  );
}
