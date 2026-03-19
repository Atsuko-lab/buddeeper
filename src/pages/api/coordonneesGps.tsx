import { CoordonneesGps } from "@/models/adresse";

export default async function getCoordonneesGps(adresseComplete: string): Promise<CoordonneesGps> {
  const adresseEncode = encodeURIComponent(adresseComplete);
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${adresseEncode}&key=AIzaSyD0yITupgRpaw3PqdZfW-JfD_aFcnwW4u4`
  );
  const json = await res.json();
  const location = json.results[0].geometry.location;

  return new CoordonneesGps(location.lng, location.lat);
}
