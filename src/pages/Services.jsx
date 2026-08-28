import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { services } from "../data/services";

export default function Services() {
  return (
    <PageTransition>
      <section className="page-hero section">
        <div className="container narrow">
          <span className="kicker">Design services</span>
          <h1>Kebutuhan desain, dengan brief yang lebih terstruktur.</h1>
          <p>
            Pilih kategori yang paling sesuai. Ukuran di bawah merupakan standar awal
            dan tetap dapat menyesuaikan kebutuhan publikasi.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container service-grid service-grid-large">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(index % 4) * 0.05}>
                <article className="service-card service-card-large">
                  <div className="service-card-top">
                    <div className="service-icon"><Icon size={22} /></div>
                    <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="service-details">
                    <div><span>Ukuran awal</span><strong>{service.size}</strong></div>
                    <div><span>Estimasi</span><strong>{service.turnaround}</strong></div>
                  </div>
                  <ul className="mini-checklist">
                    <li><CheckCircle2 size={15} /> Judul dan isi final</li>
                    <li><CheckCircle2 size={15} /> Deadline publikasi</li>
                    <li><CheckCircle2 size={15} /> Logo dan referensi</li>
                  </ul>
                  <Link className="text-link" to={`/pesan?service=${service.id}`}>
                    Ajukan kategori ini <ArrowRight size={16} />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
