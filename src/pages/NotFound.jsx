import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <section className="section not-found">
        <div className="container narrow">
          <span className="giant-number">404</span>
          <h1>Halaman tidak ditemukan.</h1>
          <p className="muted">Kembali ke halaman utama ARSAWIRA.</p>
          <Link className="button" to="/">Kembali ke beranda</Link>
        </div>
      </section>
    </PageTransition>
  );
}
