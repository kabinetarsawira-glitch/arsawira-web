import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const links = [
  {
    to: "/",
    label: "Beranda",
  },
  {
    to: "/layanan",
    label: "Layanan",
  },
  {
    to: "/arsip",
    label: "Arsip",
  },
  {
    to: "/track",
    label: "Lacak",
  },
  {
    to: "/tentang",
    label: "Tentang",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`navbar-wrap ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <nav
        className="container navbar"
        aria-label="Navigasi utama"
      >
        {/* LOGO + BRAND */}
        <Link
          className="brand"
          to="/"
          onClick={() => setOpen(false)}
        >
          <img
            src="/branding/logo-arsawira.png"
            alt="Logo Kabinet ARSAWIRA"
            className="brand-logo"
          />

          <span>
            <strong>ARSAWIRA</strong>
            <small>Creative Service</small>
          </span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="nav-toggle"
          type="button"
          aria-label={
            open ? "Tutup menu" : "Buka menu"
          }
          aria-expanded={open}
          onClick={() =>
            setOpen((value) => !value)
          }
        >
          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        {/* NAVIGATION */}
        <div
          className={`nav-links ${
            open ? "open" : ""
          }`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* CTA BUTTON */}
          <Link
            className="button button-small"
            to="/pesan"
            onClick={() => setOpen(false)}
          >
            Ajukan Desain
          </Link>
        </div>
      </nav>
    </header>
  );
}