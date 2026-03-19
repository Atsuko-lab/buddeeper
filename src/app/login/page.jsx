import Connexion from "./connexion";
import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";

export default function LoginPage() {
  return (
    <main>
      <Header />
      <Connexion />
      <Footer />
    </main>
  );
}
