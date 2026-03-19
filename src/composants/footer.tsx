import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ padding: "1rem", backgroundColor: "#222", color: "#eee", textAlign: "center" }}>
      <p>© {new Date().getFullYear()} BUDDEEPER. Tous droits réservés.</p>
      <nav>
        <Link href="/mentionslegales" style={{ color: "#61dafb", textDecoration: "none" }}>
          Mentions légales
        </Link>{" "}
        |{" "}
        <Link href="/nouscontacter" style={{ color: "#61dafb", textDecoration: "none" }}>
          Nous contacter
        </Link>
      </nav>
    </footer>
  );
}
