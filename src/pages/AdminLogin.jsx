import {
  useState
} from "react";

import {
  LockKeyhole,
  LogIn
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import PageTransition
from "../components/PageTransition";

import {
  supabase
} from "../lib/supabase";


export default function AdminLogin() {

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [errorMessage, setErrorMessage] =
    useState("");


  async function submit(event) {

    event.preventDefault();


    setLoading(true);

    setErrorMessage("");


    const {
      error
    } =
      await supabase.auth
        .signInWithPassword({

          email:
            email.trim(),

          password,

        });


    if (error) {

      setLoading(false);

      setErrorMessage(
        "Email atau password tidak valid."
      );

      return;

    }


    const {
      data: isAdmin,
      error: roleError
    } =
      await supabase.rpc(
        "is_current_admin"
      );


    if (
      roleError ||
      isAdmin !== true
    ) {

      await supabase.auth.signOut();


      setLoading(false);


      setErrorMessage(
        "Akun ini bukan admin Kominfo."
      );


      return;

    }


    navigate(
      "/admin",
      {
        replace: true
      }
    );

  }


  return (

    <PageTransition>

      <section
        className="section admin-login-page"
      >

        <div
          className="container admin-login-container"
        >

          <form
            className="admin-login-card"
            onSubmit={submit}
          >

            <div
              className="admin-login-icon"
            >
              <LockKeyhole size={24} />
            </div>


            <span className="kicker">

              KOMINFO CONTROL CENTER

            </span>


            <h1>

              Login Admin

            </h1>


            <p className="muted">

              Hanya pengurus Kominfo
              yang terdaftar sebagai
              admin.

            </p>


            <label>

              <span>Email</span>

              <input

                type="email"

                value={email}

                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }

                required

                placeholder="Email admin"

              />

            </label>


            <label>

              <span>Password</span>

              <input

                type="password"

                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }

                required

                placeholder="Password"

              />

            </label>


            {
              errorMessage &&
              (

                <div
                  className="form-alert error"
                >

                  {errorMessage}

                </div>

              )
            }


            <button
              className="button"
              type="submit"
              disabled={loading}
            >

              <LogIn size={18} />

              {
                loading
                  ? "Masuk..."
                  : "Login"
              }

            </button>

          </form>

        </div>

      </section>

    </PageTransition>

  );

}