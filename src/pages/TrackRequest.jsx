import {
  useState
} from "react";

import {
  Search
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


  async function searchRequest(event) {

    event.preventDefault();


    const cleanCode =
      code.trim();


    if (!cleanCode) {

      setErrorMessage(
        "Masukkan kode request."
      );

      return;

    }


    setLoading(true);

    setErrorMessage("");

    setResult(null);


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


    setLoading(false);


    if (error) {

      setErrorMessage(
        "Gagal memeriksa request."
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


    setResult(row);

  }


  return (

    <PageTransition>


      <section className="page-hero section">

        <div className="container narrow">

          <span className="kicker">

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


      <section className="section section-tight">

        <div className="container track-container">


          <form
            className="track-form"
            onSubmit={searchRequest}
          >

            <label>

              <span>Kode Request</span>


              <div className="track-input">

                <input

                  value={code}

                  onChange={(event) =>
                    setCode(
                      event.target.value
                    )
                  }

                  placeholder="ARS-7AF2-B930"

                />


                <button
                  className="button"
                  type="submit"
                  disabled={loading}
                >

                  <Search size={18} />

                  {
                    loading
                      ? "Mencari..."
                      : "Lacak"
                  }

                </button>

              </div>

            </label>

          </form>


          {
            errorMessage &&
            (

              <div className="form-alert error">

                {errorMessage}

              </div>

            )
          }


          {
            result &&
            (

              <div className="track-result">


                <span className="kicker">

                  {
                    result.request_code
                  }

                </span>


                <h2>

                  {
                    result.event_name ||
                    result.service_id
                  }

                </h2>


                <div className="track-result-grid">


                  <div>

                    <span>Kategori</span>

                    <strong>

                      {
                        result.service_id
                      }

                    </strong>

                  </div>


                  <div>

                    <span>Status</span>

                    <strong>

                      {
                        result.status
                      }

                    </strong>

                  </div>


                  <div>

                    <span>Deadline</span>

                    <strong>

                      {
                        result.deadline
                      }

                    </strong>

                  </div>


                  <div>

                    <span>

                      Update Terakhir

                    </span>

                    <strong>

                      {
                        new Date(
                          result.updated_at
                        )
                        .toLocaleString(
                          "id-ID"
                        )
                      }

                    </strong>

                  </div>


                </div>


              </div>

            )
          }


        </div>

      </section>


    </PageTransition>

  );

}