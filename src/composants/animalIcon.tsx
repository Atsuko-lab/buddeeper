"use client";

import { LuDog, LuCat, LuFish, LuRabbit, LuBird, LuPawPrint } from "react-icons/lu";
import { VscSnake } from "react-icons/vsc";

export default function AnimalIcon({ espece }: any) {
  const getIconeEspeceAnimal = (espece: string) => {
    switch (espece.toLowerCase()) {
      case "chien":
        return <LuDog className="espece" />;
      case "chat":
        return <LuCat className="espece" />;
      case "poisson":
        return <LuFish className="espece" />;
      case "lapin":
        return <LuRabbit className="espece" />;
      case "oiseau":
        return <LuBird className="espece" />;
      case "reptile":
        return <VscSnake className="espece" />;
      default:
        return <LuPawPrint className="espece" />;
    }
  };

  return getIconeEspeceAnimal(espece);
}
