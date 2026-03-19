import Header from "@/composants/header";
import Footer from "@/composants/footer";
import Profil from "./profil";
import ListeAnimaux from "./listeAnimaux";
import { getCurrentUser } from "@/pages/api/session";

import "@/public/styles/profile.css";

export default async function Page() {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Header />
      <div className="profileContainer">
        <div className="blankZone"></div>
        <Profil currentUserId={currentUser.id} />
        <ListeAnimaux />
      </div>
      <Footer />
    </>
  );
}
