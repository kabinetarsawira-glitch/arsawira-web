import {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";

import {
  supabase
} from "../lib/supabase";


export default function ProtectedAdminRoute({
  children
}) {

  const [state, setState] = useState({

    loading: true,

    allowed: false,

  });


  useEffect(() => {

    let active = true;


    async function checkAdmin() {

      const {
        data: sessionData
      } =
        await supabase.auth.getSession();


      const session =
        sessionData?.session;


      if (!session) {

        if (active) {

          setState({

            loading: false,

            allowed: false,

          });

        }

        return;

      }


      const {
        data,
        error
      } =
        await supabase.rpc(
          "is_current_admin"
        );


      if (active) {

        setState({

          loading: false,

          allowed:
            !error &&
            data === true,

        });

      }

    }


    checkAdmin();


    const {
      data: listener
    } =
      supabase.auth.onAuthStateChange(
        () => {

          checkAdmin();

        }
      );


    return () => {

      active = false;

      listener
        ?.subscription
        ?.unsubscribe();

    };

  }, []);


  if (state.loading) {

    return (

      <main className="section">

        <div className="container narrow">

          <div className="empty-state">

            Memeriksa akses admin...

          </div>

        </div>

      </main>

    );

  }


  if (!state.allowed) {

    return (

      <Navigate

        to="/admin/login"

        replace

      />

    );

  }


  return children;

}