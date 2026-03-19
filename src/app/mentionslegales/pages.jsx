import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";

export default function MentionsLégalesPage() {
  return (
    <main>
      <Header />
      <h1>MentionsLégales</h1>

      <Link href="/">Retour à l'accueil</Link>
      <Footer />
    </main>
  );
}
