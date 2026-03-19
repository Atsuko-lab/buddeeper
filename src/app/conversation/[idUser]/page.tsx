import Header from "@/composants/header";
import Footer from "@/composants/footer";
import Conversation from "./conv";
import { getCurrentUser } from "@/pages/api/session";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  return (
    <main>
      <Header />
      <Conversation currentUserId={currentUser!.id} />
      <Footer />
    </main>
  );
}
