import { ArrowRight, Archive, Clock3, Layers3, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { services } from "../data/services";
import { archiveItems } from "../data/archive";

export default function Home() {
  return (
    <PageTransition>
      <section className="hero section">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />

        <div className="container hero-layout">
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
            >
              <span className="status-dot" />
              KOMINFO CREATIVE SERVICE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75 }}
            >
              Creative Needs
              <span className="text-gradient"> One Organized System </span>
              ARSAWIRA.
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.65 }}
            >
              Pusat pengajuan kebutuhan desain, pengelolaan request, dan arsip visual
              Kabinet ARSAWIRA.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6 }}
            >
              <Link className="button" to="/pesan">
                Ajukan desain <ArrowRight size={18} />
              </Link>
              <Link className="button button-ghost" to="/arsip">
                Lihat arsip
              </Link>
            </motion.div>

            <motion.div
              className="hero-metrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <div>
                <strong>{services.length}</strong>
                <span>Kategori layanan</span>
              </div>
              <div>
                <strong>{archiveItems.length}+</strong>
                <span>Arsip demo</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Pintu request</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-console"
            initial={{ opacity: 0, scale: 0.96, rotateY: 6 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="console-top">
              <div className="console-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="console-label">REQUEST CENTER</span>
              <span className="console-online">ONLINE</span>
            </div>

            <div className="console-body">
              <div className="console-headline">
                <span>REQ / 2026</span>
                <strong>Creative Pipeline</strong>
              </div>

              <div className="pipeline">
                {[
                  ["01", "Brief masuk", "Waiting"],
                  ["02", "Produksi visual", "In Progress"],
                  ["03", "Review divisi", "Revision"],
                  ["04", "Publikasi", "Done"],
                ].map(([number, title, status], index) => (
                  <motion.div
                    className="pipeline-row"
                    key={number}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 + index * 0.12 }}
                  >
                    <span className="pipeline-number">{number}</span>
                    <div>
                      <strong>{title}</strong>
                      <small>{status}</small>
                    </div>
                    <span className={`pipeline-pill p-${index}`}>{status}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="kicker">Layanan</span>
                <h2>Pilih kebutuhan desainmu.</h2>
              </div>
              <Link className="text-link" to="/layanan">
                Lihat semua <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="service-grid">
            {services.slice(0, 6).map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.id} delay={index * 0.05}>
                  <article className="service-card">
                    <div className="service-icon"><Icon size={21} /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-meta">
                      <span>{service.size}</span>
                      <span>{service.turnaround}</span>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="workflow-panel">
              <div className="workflow-copy">
                <span className="kicker">Workflow</span>
                <h2>Dari brief sampai desain selesai.</h2>
                <p>
                  Sistem dibuat agar request lebih jelas, deadline tercatat, dan riwayat
                  desain mudah ditemukan selama masa kepengurusan.
                </p>
              </div>

              <div className="workflow-list">
                {[
                  { icon: Send, title: "01. Ajukan brief", text: "Isi kebutuhan, tujuan, deadline, dan referensi." },
                  { icon: Clock3, title: "02. Masuk antrean", text: "Kominfo meninjau prioritas dan kelengkapan brief." },
                  { icon: Layers3, title: "03. Produksi", text: "Desain masuk tahap pengerjaan dan revisi." },
                  { icon: Archive, title: "04. Arsip", text: "Karya final dapat dimasukkan ke katalog kabinet." },
                ].map(({ icon: Icon, title, text }) => (
                  <div className="workflow-item" key={title}>
                    <Icon size={20} />
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-panel">
              <div>
                <span className="kicker">Request center</span>
                <h2>Punya kebutuhan desain?</h2>
                <p>Masukkan brief dari awal supaya proses desain lebih cepat dan minim revisi.</p>
              </div>
              <Link className="button" to="/pesan">
                Buat request <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
