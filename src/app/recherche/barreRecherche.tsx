"use client";
import React from "react";
import { MdOutlineSearch } from "react-icons/md";

import "@/public/styles/recherche.css";
import ToastContainer from "@/composants/toastContainer";
import { useToast } from "@/context/toastContext";

const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const formattedToday = formatDate(today);
const formattedNextWeek = formatDate(nextWeek);

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const BarreRecherche = ({ onGardiensTrouves, villeUser = "" }: any) => {
  const { addToast } = useToast();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const ville = data.get("ville");
    const startDate = data.get("startDate");
    const endDate = data.get("endDate");

    console.log("Payload envoyé:", { ville, startDate, endDate });

    const payload = { ville, startDate, endDate };

    try {
      const res = await fetch("/api/recherche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        onGardiensTrouves(result);
      } else {
        addToast("Erreur : " + result.message, "error");
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
      addToast("Une erreur est survenue", "error");
    }
  };

  return (
    <form className="searchForm" onSubmit={handleSearch}>
      <div className="searchBloc">
        <div className="searchCriteria">
          <label htmlFor="ville">Près de</label>
          <input type="text" name="ville" placeholder="Paris, Cherbourg..." defaultValue={villeUser} />
        </div>
        <div className="searchCriteria">
          <label htmlFor="startDate">Du</label>
          <input type="date" name="startDate" defaultValue={formattedToday} />
        </div>
        <div className="searchCriteria">
          <label htmlFor="endDate">Au</label>
          <input type="date" name="endDate" defaultValue={formattedNextWeek} />
        </div>
        <button type="submit">
          <MdOutlineSearch />
          Rechercher
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default BarreRecherche;
