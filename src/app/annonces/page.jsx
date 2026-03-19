import Header from "@/composants/header";
import Footer from "@/composants/footer";
import Annonce from "./annonce";
import { getCurrentUser } from "@/pages/api/session";

export default async function AnnoncesPage() {
  const currentUser = await getCurrentUser();

  return (
    <main>
      <Header />
      <Annonce currentUserId={currentUser.id} />
      <Footer />
    </main>
  );
}
