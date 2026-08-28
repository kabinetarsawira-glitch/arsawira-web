import {
  useState
} from "react";

import {
  Search,
  Download,
  CheckCircle2
} from "lucide-react";

import PageTransition
from "../components/PageTransition";

import {
  supabase
} from "../lib/supabase";


export default function TrackRequest() {

  const [code, setCode] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [errorMessage, setErrorMessage] =
    useState("");


  const [result, setResult] =
    useState(null);


  // =====================================================
  // CARI REQUEST
  // =====================================================

  async function searchRequest(event) {

    event.preventDefault();


    const cleanCode =
      code
        .trim()
        .toUpperCase();


    if (!cleanCode) {

      setErrorMessage(
        "Masukkan kode request."
      );

      setResult(null);

      return;

    }


    setLoading(true);

    setErrorMessage("");

    setResult(null);


    try {

      const {
        data,
        error
      } =
        await supabase.rpc(
          "track_design_request",
          {
            p_code:
              cleanCode
          }
        );


      if (error) {

        console.error(
          error
        );

        setErrorMessage(
          "Gagal memeriksa request. Silakan coba kembali."
        );

        return;

      }


      const row =
        Array.isArray(data)
          ? data[0]
          : null;


      if (!row) {

        setErrorMessage(
          "Kode request tidak ditemukan."
        );

        return;

      }


      setResult(
        row
      );


    } catch (error) {

      console.error(
        error
      );


      setErrorMessage(
        "Terjadi kesalahan saat memeriksa request."
      );


    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // FORMAT WAKTU
  // =====================================================

  function formatUpdatedAt(value) {

    if (!value) {

      return "-";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "-";

    }


    return date
      .toLocaleString(
        "id-ID",
        {
          dateStyle:
            "medium",

          timeStyle:
            "short"
        }
      );

  }


  // =====================================================
  // APAKAH FILE SUDAH BISA DIDOWNLOAD?
  // =====================================================

  const canDownload =
    result &&
    [
      "Done",
      "Archived"
    ].includes(
      result.status
    )
    &&
    result.final_file_url;


  return (

    <PageTransition>


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section
        className="page-hero section"
      >

        <div
          className="container narrow"
        >

          <span
            className="kicker"
          >

            REQUEST TRACKING

          </span>


          <h1>

            Lacak progres desainmu.

          </h1>


          <p>

            Masukkan kode request
            yang diterima setelah
            form berhasil dikirim.

          </p>

        </div>

      </section>


      {/* =================================================
          TRACKING FORM
      ================================================= */}

      <section
        className="section section-tight"
      >

        <div
          className="container track-container"
        >


          <form
            className="track-form"
            onSubmit={searchRequest}
          >

            <label>

              <span>
                Kode Request
              </span>


              <div
                className="track-input"
              >

                <input

                  value={code}

                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .toUpperCase()
                    )
                  }

                  placeholder="ARS-7AF2-B930"

                  autoComplete="off"

                />


                <button
                  className="button"
                  type="submit"
                  disabled={loading}
                >

                  <Search
                    size={18}
                  />


                  {
                    loading
                      ? "Mencari..."
                      : "Lacak"
                  }

                </button>

              </div>

            </label>

          </form>


          {/* =================================================
              ERROR
          ================================================= */}

          {
            errorMessage &&
            (

              <div
                className="form-alert error"
              >

                {
                  errorMessage
                }

              </div>

            )
          }


          {/* =================================================
              RESULT
          ================================================= */}

          {
            result &&
            (

              <div
                className="track-result"
              >


                <span
                  className="kicker"
                >

                  {
                    result.request_code
                  }

                </span>


                <h2>

                  {
                    result.event_name ||
                    result.service_id ||
                    "Request Desain"
                  }

                </h2>


                {/* =============================================
                    REQUEST INFORMATION
                ============================================= */}

                <div
                  className="track-result-grid"
                >


                  <div>

                    <span>
                      Kategori
                    </span>

                    <strong>

                      {
                        result.service_id ||
                        "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <span>
                      Status
                    </span>

                    <strong>

                      {
                        result.status ||
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
                        result.deadline ||
                        "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <span>

                      Update Terakhir

                    </span>

                    <strong>

                      {
                        formatUpdatedAt(
                          result.updated_at
                        )
                      }

                    </strong>

                  </div>


                </div>


                {/* =================================================
                    FINAL DESIGN DOWNLOAD
                    HANYA MUNCUL JIKA DONE / ARCHIVED
                ================================================= */}

                {
                  canDownload &&
                  (

                    <div
                      className="track-download"
                    >


                      <div
                        className="track-download-info"
                      >


                        <div
                          className="track-download-icon"
                        >

                          <CheckCircle2
                            size={24}
                          />

                        </div>


                        <div>

                          <span>

                            DESAIN SELESAI

                          </span>


                          <strong>

                            {
                              result.final_file_name ||
                              "File hasil desain"
                            }

                          </strong>


                          <p>

                            File final desain
                            sudah tersedia dan
                            dapat diunduh.

                          </p>

                        </div>


                      </div>


                      <a

                        className="button track-download-button"

                        href={
                          result.final_file_url
                        }

                        target="_blank"

                        rel="noreferrer"

                      >

                        <Download
                          size={18}
                        />

                        Download Hasil

                      </a>


                    </div>

                  )
                }


                {/* =================================================
                    BELUM SELESAI
                ================================================= */}

                {
                  ![
                    "Done",
                    "Archived"
                  ].includes(
                    result.status
                  )
                  &&
                  (

                    <div
                      className="track-progress-note"
                    >

                      <span>

                        Request masih dalam proses.

                      </span>

                      <p>

                        File hasil desain akan
                        tersedia di halaman ini
                        setelah status berubah
                        menjadi Done.

                      </p>

                    </div>

                  )
                }


                {/* =================================================
                    DONE TAPI FILE BELUM ADA
                ================================================= */}

                {
                  [
                    "Done",
                    "Archived"
                  ].includes(
                    result.status
                  )
                  &&
                  !result.final_file_url
                  &&
                  (

                    <div
                      className="track-progress-note"
                    >

                      <span>

                        Status desain sudah selesai.

                      </span>

                      <p>

                        File final belum tersedia.
                        Silakan hubungi Kominfo
                        jika kondisi ini berlanjut.

                      </p>

                    </div>

                  )
                }


              </div>

            )
          }


        </div>

      </section>


    </PageTransition>

  );

}