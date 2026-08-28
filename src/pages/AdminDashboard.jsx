import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  LogOut,
  RefreshCw,
  Search,
  Archive,
  UploadCloud,
  FileCheck2,
  ExternalLink
} from "lucide-react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import PageTransition
from "../components/PageTransition";

import {
  supabase
} from "../lib/supabase";


const STATUSES = [
  "Waiting",
  "Reviewing",
  "In Progress",
  "Revision",
  "Approved",
  "Done",
  "Archived",
];


export default function AdminDashboard() {

  const navigate =
    useNavigate();


  const [requests, setRequests] =
    useState([]);


  const [selected, setSelected] =
    useState(null);


  const [filter, setFilter] =
    useState("Semua");


  const [query, setQuery] =
    useState("");


  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  const [finalFile, setFinalFile] =
    useState(null);


  // =====================================================
  // LOAD SEMUA REQUEST
  // =====================================================

  async function loadRequests() {

    setLoading(true);


    const {
      data,
      error
    } =
      await supabase

        .from("design_requests")

        .select("*")

        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(error);

      setLoading(false);

      return;

    }


    const rows =
      data || [];


    setRequests(
      rows
    );


    // Kalau sedang membuka detail request,
    // refresh datanya juga setelah update.
    setSelected(
      current => {

        if (!current) {
          return null;
        }

        return (
          rows.find(
            item =>
              item.id === current.id
          ) || current
        );

      }
    );


    setLoading(false);

  }


  useEffect(() => {

    loadRequests();

  }, []);


  // =====================================================
  // STATISTIK DASHBOARD
  // =====================================================

  const stats =
    useMemo(() => {

      return {

        total:
          requests.length,

        waiting:
          requests.filter(
            item =>
              item.status ===
              "Waiting"
          ).length,

        progress:
          requests.filter(
            item =>
              [
                "Reviewing",
                "In Progress",
                "Revision"
              ].includes(
                item.status
              )
          ).length,

        done:
          requests.filter(
            item =>
              [
                "Done",
                "Archived"
              ].includes(
                item.status
              )
          ).length,

      };

    }, [requests]);


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filtered =
    useMemo(() => {

      const text =
        query
          .trim()
          .toLowerCase();


      return requests.filter(
        item => {

          const statusMatch =

            filter === "Semua" ||

            item.status === filter;


          const searchable = [

            item.request_code,

            item.requester_name,

            item.division,

            item.event_name,

            item.service_id,

            item.status,

          ]

            .filter(Boolean)

            .join(" ")

            .toLowerCase();


          return (

            statusMatch &&

            (
              !text ||
              searchable.includes(text)
            )

          );

        }
      );

    }, [
      requests,
      filter,
      query
    ]);


  // =====================================================
  // PILIH REQUEST
  // =====================================================

  function chooseRequest(item) {

    setSelected(item);

    // Reset file yang sebelumnya dipilih
    // supaya tidak ikut ke request berikutnya.
    setFinalFile(null);

  }


  // =====================================================
  // SAVE REQUEST + UPLOAD FINAL FILE
  // =====================================================

  async function saveRequest() {

    if (!selected) {
      return;
    }


    setSaving(true);


    try {

      let finalFileUrl =
        selected.final_file_url ||
        null;


      let finalFileName =
        selected.final_file_name ||
        null;


      // =================================================
      // STATUS DONE WAJIB PUNYA FILE
      // =================================================

      if (
        selected.status === "Done" &&
        !finalFile &&
        !selected.final_file_url
      ) {

        alert(
          "Upload file hasil desain terlebih dahulu sebelum mengubah status menjadi Done."
        );

        setSaving(false);

        return;

      }


      // =================================================
      // UPLOAD FILE BARU
      // =================================================

      if (finalFile) {

        const extension =
          finalFile.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "file";


        const storageName =
          `${crypto.randomUUID()}.${extension}`;


        const {
          error: uploadError
        } =
          await supabase.storage

            .from("deliverables")

            .upload(
              storageName,
              finalFile,
              {
                cacheControl:
                  "3600",

                upsert:
                  false,
              }
            );


        if (uploadError) {

          throw uploadError;

        }


        // ===============================================
        // AMBIL PUBLIC URL FILE
        // ===============================================

        const {
          data: publicUrlData
        } =
          supabase.storage

            .from("deliverables")

            .getPublicUrl(
              storageName
            );


        finalFileUrl =
          publicUrlData.publicUrl;


        finalFileName =
          finalFile.name;

      }


      // =================================================
      // UPDATE REQUEST DI DATABASE
      // =================================================

      const {
        error
      } =
        await supabase

          .from("design_requests")

          .update({

            status:
              selected.status,

            assigned_to:
              selected.assigned_to ||
              null,

            internal_notes:
              selected.internal_notes ||
              null,

            final_file_url:
              finalFileUrl,

            final_file_name:
              finalFileName,

          })

          .eq(
            "id",
            selected.id
          );


      if (error) {

        throw error;

      }


      // Reset file input
      setFinalFile(null);


      // Refresh dashboard
      await loadRequests();


      if (
        selected.status === "Done"
      ) {

        alert(
          "Request berhasil diselesaikan. File final sudah tersedia untuk pemesan."
        );

      } else {

        alert(
          "Request berhasil diperbarui."
        );

      }


    } catch (error) {

      console.error(
        error
      );


      alert(
        error.message ||
        "Gagal menyimpan perubahan."
      );


    } finally {

      setSaving(false);

    }

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  async function logout() {

    await supabase.auth.signOut();


    navigate(
      "/admin/login"
    );

  }


  return (

    <PageTransition>

      <section
        className="section admin-page"
      >

        <div className="container">


          {/* =========================================
              HEADER
          ========================================= */}

          <div className="admin-header">

            <div>

              <span className="kicker">

                ARSAWIRA

              </span>

              <h1>

                Kominfo Control Center

              </h1>

            </div>


            <div className="admin-actions">

              <Link
                to="/admin/arsip"
                className="button button-ghost"
              >

                <Archive size={18} />

                Kelola Arsip

              </Link>


              <button
                type="button"
                className="button button-ghost"
                onClick={logout}
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>

          </div>


          {/* =========================================
              STATISTICS
          ========================================= */}

          <div className="admin-stats">

            <div>

              <span>
                Total Request
              </span>

              <strong>
                {stats.total}
              </strong>

            </div>


            <div>

              <span>
                Waiting
              </span>

              <strong>
                {stats.waiting}
              </strong>

            </div>


            <div>

              <span>
                In Progress
              </span>

              <strong>
                {stats.progress}
              </strong>

            </div>


            <div>

              <span>
                Done
              </span>

              <strong>
                {stats.done}
              </strong>

            </div>

          </div>


          {/* =========================================
              FILTER + SEARCH
          ========================================= */}

          <div className="admin-toolbar">

            <div className="filter-pills">

              {
                [
                  "Semua",
                  ...STATUSES
                ]
                  .map(
                    status => (

                      <button

                        key={status}

                        type="button"

                        className={
                          filter === status
                            ? "active"
                            : ""
                        }

                        onClick={() =>
                          setFilter(
                            status
                          )
                        }

                      >

                        {status}

                      </button>

                    )
                  )
              }

            </div>


            <div className="admin-search">

              <label className="search-box">

                <Search
                  size={17}
                />

                <input

                  value={query}

                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }

                  placeholder="Cari request..."

                />

              </label>


              <button
                type="button"
                className="admin-icon-button"
                onClick={loadRequests}
                aria-label="Refresh request"
              >

                <RefreshCw
                  size={18}
                />

              </button>

            </div>

          </div>


          {/* =========================================
              WORKSPACE
          ========================================= */}

          <div className="admin-workspace">


            {/* =======================================
                REQUEST LIST
            ======================================= */}

            <div className="admin-request-list">


              {
                loading
                  ? (

                    <div className="empty-state">

                      Memuat data...

                    </div>

                  )
                  : filtered.length === 0
                    ? (

                      <div className="empty-state">

                        Tidak ada request.

                      </div>

                    )
                    : filtered.map(
                      item => (

                        <button

                          type="button"

                          key={item.id}

                          className={
                            `admin-request-row ${
                              selected?.id ===
                              item.id
                                ? "selected"
                                : ""
                            }`
                          }

                          onClick={() =>
                            chooseRequest(
                              item
                            )
                          }

                        >

                          <div>

                            <span>

                              {
                                item.request_code
                              }

                            </span>


                            <strong>

                              {
                                item.event_name ||
                                item.service_id
                              }

                            </strong>


                            <small>

                              {
                                item.division
                              }

                              {" • "}

                              {
                                item.requester_name
                              }

                            </small>

                          </div>


                          <div>

                            <strong>

                              {
                                item.status
                              }

                            </strong>


                            <small>

                              {
                                item.deadline
                              }

                            </small>

                          </div>

                        </button>

                      )
                    )
              }


            </div>


            {/* =======================================
                REQUEST DETAIL
            ======================================= */}

            <aside className="admin-detail">


              {
                !selected
                  ? (

                    <div className="empty-state">

                      Pilih request
                      untuk melihat detail.

                    </div>

                  )
                  : (

                    <>


                      <span className="kicker">

                        {
                          selected.request_code
                        }

                      </span>


                      <h2>

                        {
                          selected.event_name ||
                          selected.service_id
                        }

                      </h2>


                      {/* =================================
                          REQUEST INFORMATION
                      ================================= */}

                      <div className="admin-detail-grid">


                        <div>

                          <span>
                            Pemesan
                          </span>

                          <strong>

                            {
                              selected.requester_name
                            }

                          </strong>

                        </div>


                        <div>

                          <span>
                            Divisi
                          </span>

                          <strong>

                            {
                              selected.division
                            }

                          </strong>

                        </div>


                        <div>

                          <span>
                            Kontak
                          </span>

                          <strong>

                            {
                              selected.contact ||
                              "-"
                            }

                          </strong>

                        </div>


                        <div>

                          <span>
                            Deadline
                          </span>

                          <strong>

                            {
                              selected.deadline
                            }

                          </strong>

                        </div>


                      </div>


                      {/* =================================
                          BRIEF
                      ================================= */}

                      <div className="admin-brief">

                        <strong>
                          Brief
                        </strong>

                        <p>

                          {
                            selected.brief
                          }

                        </p>

                      </div>


                      {/* =================================
                          GOOGLE DRIVE
                      ================================= */}

                      {
                        selected.drive_link &&
                        (

                          <a

                            className="text-link"

                            href={
                              selected.drive_link
                            }

                            target="_blank"

                            rel="noreferrer"

                          >

                            Buka Google Drive

                            <ExternalLink
                              size={15}
                            />

                          </a>

                        )
                      }


                      {/* =================================
                          STATUS
                      ================================= */}

                      <label className="admin-field">

                        <span>
                          Status
                        </span>

                        <select

                          value={
                            selected.status
                          }

                          onChange={(event) => {

                            setSelected({

                              ...selected,

                              status:
                                event.target.value,

                            });


                            // Reset file yang baru dipilih
                            // kalau status berubah.
                            setFinalFile(
                              null
                            );

                          }}

                        >

                          {
                            STATUSES.map(
                              status => (

                                <option
                                  key={status}
                                  value={status}
                                >

                                  {
                                    status
                                  }

                                </option>

                              )
                            )
                          }

                        </select>

                      </label>


                      {/* =================================
                          ASSIGNED DESIGNER
                      ================================= */}

                      <label className="admin-field">

                        <span>

                          Assigned Designer

                        </span>

                        <input

                          value={
                            selected.assigned_to ||
                            ""
                          }

                          onChange={(event) =>
                            setSelected({

                              ...selected,

                              assigned_to:
                                event.target.value,

                            })
                          }

                          placeholder="Nama staff Kominfo"

                        />

                      </label>


                      {/* =================================
                          INTERNAL NOTES
                      ================================= */}

                      <label className="admin-field">

                        <span>

                          Catatan Internal

                        </span>

                        <textarea

                          rows="5"

                          value={
                            selected.internal_notes ||
                            ""
                          }

                          onChange={(event) =>
                            setSelected({

                              ...selected,

                              internal_notes:
                                event.target.value,

                            })
                          }

                          placeholder="Catatan untuk internal Kominfo"

                        />

                      </label>


                      {/* =================================
                          FINAL DESIGN FILE
                          MUNCUL SAAT DONE / ARCHIVED
                      ================================= */}

                      {
                        [
                          "Done",
                          "Archived"
                        ].includes(
                          selected.status
                        )
                        &&
                        (

                          <div className="admin-final-file">


                            <div className="admin-final-file-header">

                              <div>

                                <span className="kicker">

                                  FINAL DELIVERABLE

                                </span>

                                <h3>

                                  File Hasil Desain

                                </h3>

                              </div>


                              <FileCheck2
                                size={24}
                              />

                            </div>


                            {/* ==========================
                                FILE YANG SUDAH ADA
                            ========================== */}

                            {
                              selected.final_file_url &&
                              (

                                <div className="existing-final-file">

                                  <div>

                                    <span>

                                      File saat ini

                                    </span>

                                    <strong>

                                      {
                                        selected.final_file_name ||
                                        "File hasil desain"
                                      }

                                    </strong>

                                  </div>


                                  <a

                                    href={
                                      selected.final_file_url
                                    }

                                    target="_blank"

                                    rel="noreferrer"

                                    className="text-link"

                                  >

                                    Lihat File

                                    <ExternalLink
                                      size={15}
                                    />

                                  </a>

                                </div>

                              )
                            }


                            {/* ==========================
                                UPLOAD FILE
                            ========================== */}

                            <label className="admin-field">

                              <span>

                                {
                                  selected.final_file_url
                                    ? "Ganti File Final"
                                    : "Upload File Final *"
                                }

                              </span>


                              <input

                                type="file"

                                accept=".png,.jpg,.jpeg,.webp,.pdf,.zip,image/png,image/jpeg,image/webp,application/pdf,application/zip"

                                onChange={(event) =>

                                  setFinalFile(

                                    event.target
                                      .files?.[0] ||
                                    null

                                  )

                                }

                              />


                              <small className="admin-file-help">

                                Format:
                                PNG, JPG, WebP,
                                PDF, atau ZIP.

                              </small>

                            </label>


                            {/* ==========================
                                FILE YANG BARU DIPILIH
                            ========================== */}

                            {
                              finalFile &&
                              (

                                <div className="selected-final-file">

                                  <UploadCloud
                                    size={19}
                                  />

                                  <div>

                                    <span>

                                      File dipilih

                                    </span>

                                    <strong>

                                      {
                                        finalFile.name
                                      }

                                    </strong>

                                  </div>

                                </div>

                              )
                            }


                          </div>

                        )
                      }


                      {/* =================================
                          SAVE BUTTON
                      ================================= */}

                      <button

                        type="button"

                        className="button"

                        onClick={
                          saveRequest
                        }

                        disabled={
                          saving
                        }

                      >

                        {
                          saving
                            ? "Menyimpan..."
                            : selected.status ===
                              "Done"
                              ? "Selesaikan & Kirim File"
                              : "Simpan Perubahan"
                        }

                      </button>


                    </>

                  )
              }


            </aside>


          </div>


        </div>

      </section>

    </PageTransition>

  );

}