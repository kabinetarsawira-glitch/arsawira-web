import {
  AnimatePresence
} from "framer-motion";

import {
  Route,
  Routes,
  useLocation
} from "react-router-dom";


import Navbar
from "./components/Navbar";

import Footer
from "./components/Footer";

import OpeningScreen
from "./components/OpeningScreen";

import ScrollToTop
from "./components/ScrollToTop";

import ProtectedAdminRoute
from "./components/ProtectedAdminRoute";


import Home
from "./pages/Home";

import Services
from "./pages/Services";

import Archive
from "./pages/Archive";

import RequestDesign
from "./pages/RequestDesign";

import TrackRequest
from "./pages/TrackRequest";

import About
from "./pages/About";

import AdminLogin
from "./pages/AdminLogin";

import AdminDashboard
from "./pages/AdminDashboard";

import AdminArchive
from "./pages/AdminArchive";

import NotFound
from "./pages/NotFound";


export default function App() {

  const location =
    useLocation();


  return (

    <>


      <OpeningScreen />


      <ScrollToTop />


      <div className="site-shell">


        <Navbar />


        <AnimatePresence mode="wait">


          <Routes

            location={location}

            key={
              location.pathname
            }

          >


            <Route
              path="/"
              element={<Home />}
            />


            <Route
              path="/layanan"
              element={<Services />}
            />


            <Route
              path="/arsip"
              element={<Archive />}
            />


            <Route
              path="/pesan"
              element={<RequestDesign />}
            />


            <Route
              path="/track"
              element={<TrackRequest />}
            />


            <Route
              path="/tentang"
              element={<About />}
            />


            <Route

              path="/admin/login"

              element={
                <AdminLogin />
              }

            />


            <Route

              path="/admin"

              element={

                <ProtectedAdminRoute>

                  <AdminDashboard />

                </ProtectedAdminRoute>

              }

            />


            <Route

              path="/admin/arsip"

              element={

                <ProtectedAdminRoute>

                  <AdminArchive />

                </ProtectedAdminRoute>

              }

            />


            <Route

              path="*"

              element={
                <NotFound />
              }

            />


          </Routes>


        </AnimatePresence>


        <Footer />


      </div>


    </>

  );

}