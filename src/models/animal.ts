import { User } from "./user";

export class Animal {
  id: number;
  idMaitre: number;
  nom: string;
  espece: string;
  poids: number;
  age: number;
  taille: number;
  description: string;

  constructor(
    id: number,
    maitreId: number,
    nom: string,
    espece: string,
    age: number,
    taille: number,
    poids: number,
    description: string
  ) {
    this.id = id;
    this.idMaitre = maitreId;
    this.nom = nom;
    this.espece = espece;
    this.age = age;
    this.taille = taille;
    this.poids = poids;
    this.description = description;
  }

  static creerDepuisResultatRequete(queryRes: any): Animal {
    console.log("Créer animal :", queryRes);

    return new Animal(
      queryRes.id,
      queryRes.idMaitre,
      queryRes.nom,
      queryRes.espece,
      queryRes.age,
      queryRes.taille,
      queryRes.poids,
      queryRes.description
    );
  }
}
