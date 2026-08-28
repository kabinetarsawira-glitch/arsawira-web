import {
  useEffect,
  useState
} from "react";

import {
  ImagePlus,
  Trash2
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import PageTransition
from "../components/PageTransition";

import {
  supabase
} from "../lib/supabase";


const initialForm = {

  title: "",

  category:
    "Poster Feed",

  division: "",

  year:
    new Date()
      .getFullYear(),

  designer: "",

  description: "",

};


export default function AdminArchive() {

  const [form, setForm] =
    useState(initialForm);


  const [file, setFile] =
    useState(null);


  const [items, setItems] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


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

  }


  useEffect(() => {

    loadArchive();

  }, []);


  function update(event) {

    setForm({

      ...form,

      [event.target.name]:
        event.target.value,

    });

  }


  async function submit(event) {

    event.preventDefault();


    if (!file) {

      alert(
        "Pilih gambar desain."
      );

      return;

    }


    setLoading(true);


    try {


      const extension =
        file.name
          .split(".")
          .pop();


      const fileName =

        `${crypto.randomUUID()}.${extension}`;


      const {
        error: uploadError
      } =
        await supabase.storage

          .from("archive")

          .upload(
            fileName,
            file
          );


      if (uploadError) {

        throw uploadError;

      }


      const {
        data: urlData
      } =
        supabase.storage

          .from("archive")

          .getPublicUrl(
            fileName
          );


      const {
        error: insertError
      } =
        await supabase

          .from("archive_items")

          .insert({

            ...form,

            year:
              Number(form.year),

            image_url:
              urlData.publicUrl,

          });


      if (insertError) {

        throw insertError;

      }


      setForm(
        initialForm
      );


      setFile(null);


      await loadArchive();


      alert(
        "Karya berhasil masuk arsip."
      );


    } catch (error) {


      alert(
        error.message
      );


    } finally {


      setLoading(false);


    }

  }


  async function remove(item) {

    const confirmation =
      window.confirm(
        `Hapus ${item.title}?`
      );


    if (!confirmation) return;


    const {
      error
    } =
      await supabase

        .from("archive_items")

        .delete()

        .eq(
          "id",
          item.id
        );


    if (error) {

      alert(
        error.message
      );

      return;

    }


    await loadArchive();

  }


  return (

    <PageTransition>

      <section className="section admin-page">

        <div className="container">


          <div className="admin-header">

            <div>

              <span className="kicker">

                ARCHIVE MANAGER

              </span>

              <h1>

                Kelola Arsip

              </h1>

            </div>


            <Link
              className="button button-ghost"
              to="/admin"
            >

              Dashboard

            </Link>

          </div>


          <div className="archive-admin-grid">


            <form
              className="form-section"
              onSubmit={submit}
            >


              <h2>

                Tambah Karya

              </h2>


              <div className="form-grid">


                <label>

                  <span>Judul</span>

                  <input

                    name="title"

                    value={form.title}

                    onChange={update}

                    required

                  />

                </label>


                <label>

                  <span>Kategori</span>

                  <select

                    name="category"

                    value={
                      form.category
                    }

                    onChange={update}

                  >

                    <option>
                      Poster Feed
                    </option>

                    <option>
                      Instagram Story
                    </option>

                    <option>
                      Banner Cetak
                    </option>

                    <option>
                      Banner Digital
                    </option>

                    <option>
                      Sertifikat
                    </option>

                    <option>
                      Lainnya
                    </option>

                  </select>

                </label>


                <label>

                  <span>Divisi</span>

                  <input

                    name="division"

                    value={
                      form.division
                    }

                    onChange={update}

                  />

                </label>


                <label>

                  <span>Tahun</span>

                  <input

                    type="number"

                    name="year"

                    value={
                      form.year
                    }

                    onChange={update}

                  />

                </label>


                <label>

                  <span>Designer</span>

                  <input

                    name="designer"

                    value={
                      form.designer
                    }

                    onChange={update}

                  />

                </label>


                <label className="full">

                  <span>Deskripsi</span>

                  <textarea

                    name="description"

                    rows="4"

                    value={
                      form.description
                    }

                    onChange={update}

                  />

                </label>


                <label className="full">

                  <span>

                    Upload Desain

                  </span>

                  <input

                    type="file"

                    accept="image/png,image/jpeg,image/webp"

                    onChange={(event) =>
                      setFile(
                        event.target.files?.[0]
                      )
                    }

                    required

                  />

                </label>


              </div>


              <button
                className="button"
                type="submit"
                disabled={loading}
              >

                <ImagePlus size={18} />

                {
                  loading
                    ? "Uploading..."
                    : "Tambah ke Arsip"
                }

              </button>


            </form>


            <div className="archive-admin-list">


              {
                items.map(
                  item => (

                    <div
                      className="archive-admin-item"
                      key={item.id}
                    >


                      <img

                        src={
                          item.image_url
                        }

                        alt={
                          item.title
                        }

                      />


                      <div>

                        <strong>

                          {
                            item.title
                          }

                        </strong>

                        <span>

                          {
                            item.category
                          }

                          {" • "}

                          {
                            item.year
                          }

                        </span>

                      </div>


                      <button

                        type="button"

                        className="admin-icon-button"

                        onClick={() =>
                          remove(item)
                        }

                      >

                        <Trash2 size={17} />

                      </button>


                    </div>

                  )
                )
              }


            </div>


          </div>


        </div>

      </section>

    </PageTransition>

  );

}