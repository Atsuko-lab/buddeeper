import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";

export default function NousContacterPage() {
  return (
    <main>
      <Header />
      <h1>NousContacter</h1>

      <Link href="/">Retour à l'accueil</Link>
      <Footer />
    </main>
  );
}
