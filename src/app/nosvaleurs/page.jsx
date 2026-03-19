import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";

export default function NosValeursPage() {
  return (
    <main>
      <Header />
      <h1>Nos valeurs</h1>

      <Link href="/">Retour à l'accueil</Link>
      <Footer />
    </main>
  );
}
