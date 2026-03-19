import { Adresse, CoordonneesGps } from "@/models/adresse";

export class User {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  tel: string;
  gardien: boolean;
  demandeur: boolean;
  note: string;
  description: string;
  adresse: Adresse;

  constructor(
    id: number,
    nom: string,
    prenom: string,
    mail: string,
    tel: string,
    gardien: boolean,
    demandeur: boolean,
    note: string,
    description: string,
    adresse: Adresse
  ) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.mail = mail;
    this.tel = tel;
    this.gardien = gardien;
    this.demandeur = demandeur;
    this.note = note;
    this.description = description;
    this.adresse = adresse;
  }

  serialize(): any {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      mail: this.mail,
      tel: this.tel,
      gardien: this.gardien,
      demandeur: this.demandeur,
      note: this.note,
      description: this.description,
      adresse: this.adresse,
    };
  }

  static creerDepuisResultatRequete(queryRes: any): User {
    return new User(
      queryRes.id,
      queryRes.nom,
      queryRes.prenom,
      queryRes.mail,
      queryRes.numTel,
      queryRes.gardien,
      queryRes.demandeur,
      queryRes.note,
      queryRes.description,
      new Adresse(
        queryRes.adresse,
        queryRes.ville,
        queryRes.code_postal,
        queryRes.pays,
        new CoordonneesGps(queryRes.longitude, queryRes.latitude),
        queryRes.complement
      )
    );
  }
}
