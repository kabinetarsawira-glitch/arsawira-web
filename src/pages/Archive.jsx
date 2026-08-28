import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  X
} from "lucide-react";

import {
  AnimatePresence,
  motion
} from "framer-motion";

import PageTransition
from "../components/PageTransition";

import {
  supabase
} from "../lib/supabase";


export default function Archive() {

  const [items, setItems] =
    useState([]);


  const [category, setCategory] =
    useState("Semua");


  const [query, setQuery] =
    useState("");


  const [selected, setSelected] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadArchive() {

      const {
        data
      } =
        await supabase

          .from("archive_items")

          .select("*")

          .order(
            "created_at",
            {
              ascending: false
            }
          );


      setItems(
        data || []
      );


      setLoading(false);

    }


    loadArchive();

  }, []);


  const categories =
    useMemo(() => {

      return [

        "Semua",

        ...new Set(
          items.map(
            item =>
              item.category
          )
        )

      ];

    }, [items]);


  const filtered =
    useMemo(() => {

      const text =
        query
          .trim()
          .toLowerCase();


      return items.filter(
        item => {

          const categoryMatch =

            category === "Semua" ||

            item.category === category;


          const searchable = [

            item.title,

            item.category,

            item.division,

            item.year,

            item.designer,

          ]

            .filter(Boolean)

            .join(" ")

            .toLowerCase();


          return (

            categoryMatch &&

            (
              !text ||

              searchable.includes(text)
            )

          );

        }
      );

    }, [
      items,
      category,
      query
    ]);


  return (

    <PageTransition>


      <section className="page-hero section">

        <div className="container narrow">

          <span className="kicker">

            DESIGN ARCHIVE

          </span>

          <h1>

            Jejak visual Kabinet ARSAWIRA.

          </h1>

          <p>

            Kumpulan karya final
            Kominfo selama masa
            kepengurusan.

          </p>

        </div>

      </section>


      <section className="section section-tight">

        <div className="container">


          <div className="archive-toolbar">


            <div className="filter-pills">

              {
                categories.map(
                  item => (

                    <button

                      key={item}

                      type="button"

                      className={
                        category === item
                          ? "active"
                          : ""
                      }

                      onClick={() =>
                        setCategory(item)
                      }

                    >

                      {item}

                    </button>

                  )
                )
              }

            </div>


            <label className="search-box">

              <Search size={17} />

              <input

                value={query}

                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }

                placeholder="Cari arsip..."

              />

            </label>


          </div>


          {
            loading
              ? (

                <div className="empty-state">

                  Memuat arsip...

                </div>

              )
              : (

                <div className="archive-grid">


                  {
                    filtered.map(
                      item => (

                        <motion.button

                          type="button"

                          className="archive-card"

                          key={item.id}

                          onClick={() =>
                            setSelected(item)
                          }

                          initial={{
                            opacity: 0,
                            y: 15
                          }}

                          animate={{
                            opacity: 1,
                            y: 0
                          }}

                        >


                          <div
                            className="archive-db-image"
                          >

                            <img

                              src={
                                item.image_url
                              }

                              alt={
                                item.title
                              }

                            />

                          </div>


                          <div
                            className="archive-card-copy"
                          >

                            <div>

                              <span>

                                {
                                  item.category
                                }

                                {" • "}

                                {
                                  item.year
                                }

                              </span>


                              <h3>

                                {
                                  item.title
                                }

                              </h3>

                            </div>


                          </div>


                        </motion.button>

                      )
                    )
                  }


                </div>

              )
          }


        </div>

      </section>


      <AnimatePresence>


        {
          selected &&
          (

            <motion.div

              className="modal-backdrop"

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              exit={{
                opacity: 0
              }}

              onMouseDown={() =>
                setSelected(null)
              }

            >


              <motion.div

                className="archive-modal"

                onMouseDown={(event) =>
                  event.stopPropagation()
                }

              >


                <button
                  className="modal-close"
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }
                >

                  <X size={20} />

                </button>


                <div
                  className="archive-modal-image"
                >

                  <img

                    src={
                      selected.image_url
                    }

                    alt={
                      selected.title
                    }

                  />

                </div>


                <div className="modal-copy">


                  <span className="kicker">

                    {
                      selected.category
                    }

                  </span>


                  <h2>

                    {
                      selected.title
                    }

                  </h2>


                  <p className="muted">

                    {
                      selected.description
                    }

                  </p>


                  <div className="modal-meta">


                    <div>

                      <span>Divisi</span>

                      <strong>

                        {
                          selected.division ||
                          "-"
                        }

                      </strong>

                    </div>


                    <div>

                      <span>Tahun</span>

                      <strong>

                        {
                          selected.year
                        }

                      </strong>

                    </div>


                    <div>

                      <span>Designer</span>

                      <strong>

                        {
                          selected.designer ||
                          "Kominfo"
                        }

                      </strong>

                    </div>


                  </div>


                </div>


              </motion.div>


            </motion.div>

          )
        }


      </AnimatePresence>


    </PageTransition>

  );

}