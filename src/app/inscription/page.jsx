import Inscription from "./inscription";
import Link from "next/link";
import Header from "@/composants/header";
import Footer from "@/composants/footer";

export default function Page() {
  return (
    <div>
      <Header />
      <h1>Créer un compte</h1>
      <Inscription />
      <Footer />
    </div>
  );
}
