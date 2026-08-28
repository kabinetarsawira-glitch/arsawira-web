import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { services } from "../data/services";
import { createRequest } from "../lib/requestService";
import { hasSupabase } from "../lib/supabase";

const initialState = {
  requester_name: "",
  division: "",
  service_id: "",
  event_name: "",
  deadline: "",
  publication_date: "",
  brief: "",
  drive_link: "",
  notes: "",
  contact: "",
};

export default function RequestDesign() {
  const [params] = useSearchParams();
  const serviceParam = params.get("service") || "";
  const [form, setForm] = useState({ ...initialState, service_id: serviceParam });
  const [state, setState] = useState({ loading: false, error: "", success: null });

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.service_id),
    [form.service_id]
  );

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: "", success: null });

    if (!form.requester_name || !form.division || !form.service_id || !form.deadline || !form.brief) {
      setState({
        loading: false,
        error: "Isi nama, divisi, kategori desain, deadline, dan brief.",
        success: null,
      });
      return;
    }

    const deadline = new Date(`${form.deadline}T00:00:00`);
    if (Number.isNaN(deadline.getTime())) {
      setState({ loading: false, error: "Tanggal deadline tidak valid.", success: null });
      return;
    }

    try {
      const result = await createRequest(form);
      setState({ loading: false, error: "", success: result });
      setForm({ ...initialState, service_id: serviceParam });
    } catch (error) {
      setState({
        loading: false,
        error: error.message || "Request gagal dikirim.",
        success: null,
      });
    }
  }

  return (
    <PageTransition>
      <section className="page-hero section">
        <div className="container narrow">
          <span className="kicker">Request center</span>
          <h1>Masukkan brief yang siap dikerjakan.</h1>
          <p>
            Semakin lengkap input dari divisi pemesan, semakin kecil risiko revisi karena
            informasi yang berubah di tengah proses.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container request-layout">
          <form className="request-form" onSubmit={submit}>
            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>
                <div>
                  <h2>Identitas request</h2>
                  <p>Siapa yang mengajukan dan dari divisi mana.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  <span>Nama pemesan *</span>
                  <input
                    name="requester_name"
                    value={form.requester_name}
                    onChange={update}
                    placeholder="Nama lengkap"
                  />
                </label>

                <label>
                  <span>Divisi *</span>
                  <input
                    name="division"
                    value={form.division}
                    onChange={update}
                    placeholder="Contoh: PSDM"
                  />
                </label>

                <label>
                  <span>Kontak</span>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={update}
                    placeholder="WhatsApp / ID Line"
                  />
                </label>

                <label>
                  <span>Nama kegiatan</span>
                  <input
                    name="event_name"
                    value={form.event_name}
                    onChange={update}
                    placeholder="Nama program atau kegiatan"
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>
                <div>
                  <h2>Kebutuhan desain</h2>
                  <p>Tentukan output dan waktu yang dibutuhkan.</p>
                </div>
              </div>

              <div className="form-grid">
                <label className="full">
                  <span>Kategori desain *</span>
                  <select name="service_id" value={form.service_id} onChange={update}>
                    <option value="">Pilih kategori</option>
                    {services.map((service) => (
                      <option value={service.id} key={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Deadline desain *</span>
                  <input type="date" name="deadline" value={form.deadline} onChange={update} />
                </label>

                <label>
                  <span>Tanggal publikasi</span>
                  <input
                    type="date"
                    name="publication_date"
                    value={form.publication_date}
                    onChange={update}
                  />
                </label>

                <label className="full">
                  <span>Brief lengkap *</span>
                  <textarea
                    name="brief"
                    value={form.brief}
                    onChange={update}
                    rows="8"
                    placeholder="Tujuan desain, headline, isi final, CTA, target audiens, informasi wajib, dan arahan visual."
                  />
                </label>

                <label className="full">
                  <span>Link Google Drive</span>
                  <input
                    name="drive_link"
                    value={form.drive_link}
                    onChange={update}
                    placeholder="Link aset, logo, foto, atau referensi"
                  />
                </label>

                <label className="full">
                  <span>Catatan tambahan</span>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={update}
                    rows="4"
                    placeholder="Opsional"
                  />
                </label>
              </div>
            </div>

            {state.error && <div className="form-alert error">{state.error}</div>}

            {state.success && (
              <div className="form-alert success">
                <CheckCircle2 size={19} />
                <div>
                  <strong>Request berhasil dicatat.</strong>
                  <span>ID request: {state.success.id}</span>
                </div>
              </div>
            )}

            <button className="button form-submit" type="submit" disabled={state.loading}>
              {state.loading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
              {state.loading ? "Mengirim..." : "Kirim request"}
            </button>
          </form>

          <aside className="request-sidebar">
            <div className="sidebar-card sticky-card">
              <span className="kicker">Preview kategori</span>
              <h3>{selectedService?.title || "Belum memilih kategori"}</h3>
              <p>
                {selectedService?.description ||
                  "Pilih kategori untuk melihat standar awal output."}
              </p>

              {selectedService && (
                <div className="sidebar-stats">
                  <div><span>Ukuran</span><strong>{selectedService.size}</strong></div>
                  <div><span>Estimasi</span><strong>{selectedService.turnaround}</strong></div>
                </div>
              )}

              <div className="sidebar-rule">
                <ShieldCheck size={19} />
                <p>
                  Deadline yang dikirim bukan jaminan otomatis. Kominfo tetap perlu
                  menilai antrean dan kelengkapan brief.
                </p>
              </div>

              <div className="backend-status">
                <span className={`status-dot ${hasSupabase ? "live" : ""}`} />
                {hasSupabase ? "Supabase aktif" : "Mode demo: localStorage"}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}
