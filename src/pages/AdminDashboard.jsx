import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  LogOut,
  RefreshCw,
  Search,
  Archive
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


    setRequests(
      data || []
    );


    setLoading(false);

  }


  useEffect(() => {

    loadRequests();

  }, []);


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


  async function saveRequest() {

    if (!selected) return;


    setSaving(true);


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

        })

        .eq(
          "id",
          selected.id
        );


    if (error) {

      alert(error.message);

      setSaving(false);

      return;

    }


    setSaving(false);


    await loadRequests();


    alert(
      "Request berhasil diperbarui."
    );

  }


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


          <div className="admin-stats">

            <div>

              <span>Total Request</span>

              <strong>
                {stats.total}
              </strong>

            </div>


            <div>

              <span>Waiting</span>

              <strong>
                {stats.waiting}
              </strong>

            </div>


            <div>

              <span>In Progress</span>

              <strong>
                {stats.progress}
              </strong>

            </div>


            <div>

              <span>Done</span>

              <strong>
                {stats.done}
              </strong>

            </div>

          </div>


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
                        setFilter(status)
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

                <Search size={17} />

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
              >

                <RefreshCw size={18} />

              </button>

            </div>

          </div>


          <div className="admin-workspace">


            <div className="admin-request-list">


              {
                loading
                  ? (

                    <div className="empty-state">

                      Memuat data...

                    </div>

                  )
                  : filtered.map(
                    item => (

                      <button

                        type="button"

                        key={item.id}

                        className="admin-request-row"

                        onClick={() =>
                          setSelected(item)
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

                            {item.division}

                            {" • "}

                            {
                              item.requester_name
                            }

                          </small>

                        </div>


                        <div>

                          <strong>

                            {item.status}

                          </strong>

                          <small>

                            {item.deadline}

                          </small>

                        </div>

                      </button>

                    )
                  )
              }


            </div>


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


                      <div className="admin-detail-grid">


                        <div>

                          <span>Pemesan</span>

                          <strong>

                            {
                              selected.requester_name
                            }

                          </strong>

                        </div>


                        <div>

                          <span>Divisi</span>

                          <strong>

                            {
                              selected.division
                            }

                          </strong>

                        </div>


                        <div>

                          <span>Kontak</span>

                          <strong>

                            {
                              selected.contact ||
                              "-"
                            }

                          </strong>

                        </div>


                        <div>

                          <span>Deadline</span>

                          <strong>

                            {
                              selected.deadline
                            }

                          </strong>

                        </div>


                      </div>


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

                          </a>

                        )
                      }


                      <label className="admin-field">

                        <span>Status</span>

                        <select

                          value={
                            selected.status
                          }

                          onChange={(event) =>
                            setSelected({

                              ...selected,

                              status:
                                event.target.value,

                            })
                          }

                        >

                          {
                            STATUSES.map(
                              status => (

                                <option
                                  key={status}
                                  value={status}
                                >

                                  {status}

                                </option>

                              )
                            )
                          }

                        </select>

                      </label>


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

                        />

                      </label>


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