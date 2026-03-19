export class Adresse {
  adresse: string;
  complement: string;
  ville: string;
  codePostal: string;
  pays: string;
  coordonneesGps: CoordonneesGps;

  constructor(
    adresse: string,
    ville: string,
    codePostal: string,
    pays: string = "France",
    coordonneesGps: CoordonneesGps,
    complement: string = ""
  ) {
    this.adresse = adresse;
    this.complement = complement;
    this.ville = ville;
    this.pays = pays;
    this.codePostal = codePostal;
    this.coordonneesGps = coordonneesGps;
  }
}

export class CoordonneesGps {
  lon: string;
  lat: string;

  constructor(lon: string, lat: string) {
    this.lon = lon;
    this.lat = lat;
  }
}
