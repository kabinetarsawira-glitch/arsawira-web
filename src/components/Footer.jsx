import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <img
              src="/branding/logo-arsawira.png"
               alt="Logo Kabinet ARSAWIRA"
                className="brand-logo"
            />
            <span>
              <strong>ARSAWIRA</strong>
              <small>Creative Service</small>
            </span>
          </div>
          <p className="muted footer-copy">
            Pusat layanan desain, dokumentasi karya, dan kebutuhan kreatif Kominfo.
          </p>
        </div>

        <div>
          <p className="footer-title">Navigasi</p>
          <div className="footer-links">
            <Link to="/layanan">Layanan</Link>
            <Link to="/arsip">Arsip</Link>
            <Link to="/pesan">Ajukan desain</Link>
          </div>
        </div>

        <div>
          <p className="footer-title">Kontak</p>
          <div className="footer-links">
            <a href="mailto:kominfo@example.com"><Mail size={16} /> Email Kominfo</a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ARSAWIRA.</span>
        <span>Built by Kominfo.</span>
      </div>
    </footer>
  );
}
