import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";
import AfficherProfile from "./afficherProfile";

export default function ConversationPage() {
  return (
    <main>
      <Header />
      <h1>Profile de : </h1>
      <AfficherProfile />
      <Link href="/">Retour à l'accueil</Link>
      <Footer />
    </main>
  );
}
