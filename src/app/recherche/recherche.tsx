"use client";
import React, { useState } from "react";

import "@/public/styles/recherche.css";
import BarreRecherche from "./barreRecherche";
import ResultatRecherche from "./resultatRecherche";

const Recherche = ({ villeUser }: any = "") => {
  const [gardiens, setGardiens] = useState(null);
  const handleGardiensFromRecherche = (gardiensTrouves: any) => {
    setGardiens(gardiensTrouves);
  };

  return (
    <div>
      <BarreRecherche villeUser={villeUser} onGardiensTrouves={handleGardiensFromRecherche} />
      {gardiens && <ResultatRecherche gardiens={gardiens}></ResultatRecherche>}
    </div>
  );
};

export default Recherche;
