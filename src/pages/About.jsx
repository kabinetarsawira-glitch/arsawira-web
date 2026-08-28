import { Archive, Layers3, ShieldCheck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <PageTransition>
      <section className="page-hero section">
        <div className="container narrow">
          <span className="kicker">About the system</span>
          <h1>Kominfo bukan hanya tempat “minta desain”.</h1>
          <p>
            Website ini dibuat sebagai sistem kerja kreatif agar brief, antrean,
            identitas visual, dan arsip kabinet lebih terorganisasi.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container about-grid">
          {[
            {
              icon: Layers3,
              title: "Standarisasi request",
              text: "Divisi pemesan memberi data yang cukup sebelum produksi dimulai.",
            },
            {
              icon: ShieldCheck,
              title: "Kontrol proses",
              text: "Deadline, tujuan publikasi, serta revisi dapat dikelola dengan lebih jelas.",
            },
            {
              icon: Archive,
              title: "Memori kabinet",
              text: "Karya yang selesai tidak hilang di chat dan dapat menjadi referensi kepengurusan.",
            },
          ].map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <article className="about-card">
                <Icon size={25} />
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
