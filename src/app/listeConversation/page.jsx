import Header from "@/composants/header";
import Footer from "@/composants/footer";
import ListeConversations from "./listeConversations";
import { getCurrentUser } from "@/pages/api/session";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  return (
    <main>
      <Header />
      <ListeConversations currentUserId={currentUser.id} />
      <Footer />
    </main>
  );
}
