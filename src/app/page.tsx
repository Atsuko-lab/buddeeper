import Header from "@/composants/header";
import Footer from "@/composants/footer";
import Recherche from "./recherche/recherche";

import { getCurrentUser } from "@/pages/api/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <main>
      <Header />

      <div className="p-4">
        <h1>Trouvez le gardien qu'il vous faut</h1>

        {currentUser ? (
          <Recherche villeUser={currentUser.adresse.ville + ", " + currentUser.adresse.codePostal} />
        ) : (
          <>
            <Recherche />
            <div className="actionConnect">
              <span>Connectez vous pour acceder à toutes les fonctionalités</span>
              <a href="/login">
                <button className="action">Se connecter</button>
              </a>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
