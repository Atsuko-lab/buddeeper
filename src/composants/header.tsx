import Link from "next/link";
import {
  MdOutlineChat,
  MdOutlineCampaign,
  MdOutlineDiversity1,
  MdOutlinePerson,
  MdOutlineLogin,
  MdOutlineLogout,
} from "react-icons/md";

import "@/public/styles/header.css";
import { getCurrentUser } from "@/pages/api/session";

export default async function Header() {
  const user = await getCurrentUser();
  let isLoggedIn = user ? true : false;

  return (
    <header className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="headerTitle">
          <span>BUDDEEPER</span>
        </Link>
        <nav>
          <Link href="/listeConversation" className="link">
            <span className="linkText">Conversation</span>
            <MdOutlineChat className="linkIcon" />
          </Link>
          <Link href="/annonces" className="link">
            <span className="linkText">Annonces</span>
            <MdOutlineCampaign className="linkIcon" />
          </Link>
          <Link href="/nosvaleurs" className="link">
            <span className="linkText">Nos valeurs</span>
            <MdOutlineDiversity1 className="linkIcon" />
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profil" className="link">
                <span className="linkText">Profil</span>
                <MdOutlinePerson className="linkIcon" />
              </Link>
              <Link href="/api/logout" className="link">
                <span className="linkText">Déconnexion</span>
                <MdOutlineLogout className="linkIcon" />
              </Link>
            </>
          ) : (
            <Link href="/login" className="link">
              <span className="linkText">Connexion</span>
              <MdOutlineLogin className="linkIcon" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
