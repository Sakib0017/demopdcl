import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Nav, Navbar, Footer, Sidemenu, Error, ScrollToTop } from "./components";
import { initializeErrorSuppression } from "./utils/consoleErrorSuppression";
import { useBranchCounts } from "./hooks/useBranchCounts";
import { SITE_URL } from "./secrets";
import "./index.css";

// Initialize error suppression for better PageSpeed console error scores
initializeErrorSuppression();

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.5rem",
      color: "#333",
    }}>
    Loading...
  </div>
);

// Site-wide fallback SEO tags. Pages that render their own <Helmet> (e.g.
// DoctorDetail) override these by name/property — react-helmet-async keeps
// only the deepest declaration per tag, so this never leaves a duplicate
// behind the way a static tag baked into index.html would.
// Self-referencing canonical for every route. Query strings and hashes are
// dropped so /our-doctors?specialty=cardiology consolidates onto /our-doctors,
// and trailing slashes are stripped everywhere except the root so the value
// matches public/sitemap.xml byte for byte. Deliberately NOT in index.html:
// that one file is served on all 40+ paths, so a static "/" canonical would
// tell every non-JS crawler the whole site duplicates the homepage.
const canonicalHref = (pathname) =>
  `${SITE_URL}${pathname.replace(/\/+$/, "") || "/"}`;

const App = () => {
  const { pathname } = useLocation();
  // Both descriptions below stated 22 branches and had been wrong since the
  // 23rd opened.
  const { totalBranches } = useBranchCounts();

  return (
    <div>
      <Helmet>
        <title>Popular Diagnostic Centre Ltd.</title>
        <meta
          name="description"
          content={`Popular Diagnostic Centre Limited — Bangladesh's trusted diagnostic and healthcare network. Find specialist doctors, chamber schedules, diagnostic services, and book appointments across ${totalBranches} branches.`}
        />
        {/* Pages needing a different canonical (DoctorDetail rewrites legacy
            /doctordetail/:id URLs) declare their own. react-helmet-async keys
            <link rel="canonical"> by `rel`, not `href`, so the deepest
            declaration wins and exactly one is ever emitted. */}
        <link rel="canonical" href={canonicalHref(pathname)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Popular Diagnostic Centre" />
        <meta property="og:title" content="Popular Diagnostic Centre Ltd." />
        <meta
          property="og:description"
          content={`Find specialist doctors, chamber schedules, and diagnostic services across ${totalBranches} branches in Bangladesh.`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <ScrollToTop />
      <Nav />
      <Navbar />
      <Outlet />
      <Sidemenu />
      <Footer />
    </div>
  );
};

const lazyLoad = (componentName) => {
  return lazy(() =>
    import("./components").then((module) => ({
      default: module[componentName],
    }))
  );
};

const Layout = lazyLoad("Layout");
const ReportDownload = lazyLoad("ReportDownload");
const SampleCollectionMain = lazyLoad("SampleCollectionMain");
const DoctorDetail = lazyLoad("DoctorDetail");
const DoctorSearch = lazyLoad("DoctorSearch");
const SpecialtyRedirect = lazyLoad("SpecialtyRedirect");
const Technology = lazyLoad("Technology");
const Goals = lazyLoad("Goals");
const Branch = lazyLoad("Branch");
const Director = lazyLoad("Director");
const ManagingDirector = lazyLoad("ManagingDirector");
const Chairman = lazyLoad("Chairman");
const Hotlines = lazyLoad("Hotlines");
const Dmd = lazyLoad("Dmd");
const Notice = lazyLoad("Notice");
const NoticeDetails = lazy(() => import("./components/NoticeDetails")); 
const Videos = lazyLoad("Videos");
// const HealthTalks = lazyLoad("HealthTalks");
const Contact = lazyLoad("Contact");
const Health = lazyLoad("Health");
const About = lazyLoad("About");
const AboutLedger = lazyLoad("AboutLedger");
const AboutInstrument = lazyLoad("AboutInstrument");
const AboutGallery = lazyLoad("AboutGallery");
const Terms = lazyLoad("Terms");
const Privacy = lazyLoad("Privacy");
const Gallery = lazyLoad("Gallery");
const Refund = lazyLoad("Refund");

// Branch Pages
const Shantinagar = lazyLoad("Shantinagar");
const Shyamoli = lazyLoad("Shyamoli");
const Mirpur = lazyLoad("Mirpur");
const Uttara = lazyLoad("Uttara");
const Bogura = lazyLoad("Bogura");
const Rangpur = lazyLoad("Rangpur");
const Badda = lazyLoad("Badda");
const Barishal = lazyLoad("Barishal");
const Chattogram = lazyLoad("Chattogram");
const Dhanmondi = lazyLoad("Dhanmondi");
const Dinajpur = lazyLoad("Dinajpur");
const EnglishRoad = lazyLoad("EnglishRoad");
const Gazipur = lazyLoad("Gazipur");
const Jatrabari = lazyLoad("Jatrabari");
const Khulna = lazyLoad("Khulna");
const Kushtia = lazyLoad("Kushtia");
const Mymensingh = lazyLoad("Mymensingh");
const Narayangonj = lazyLoad("Narayangonj");
const Noakhali = lazyLoad("Noakhali");
const Rajshahi = lazyLoad("Rajshahi");
const Savar = lazyLoad("Savar");
const UttaraGaribENewaz = lazyLoad("UttaraGaribENewaz");

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          { path: "/", element: <Layout /> },
          { path: "/patient_portal", element: <ReportDownload /> },
          { path: "/sample-collection", element: <SampleCollectionMain /> },
          { path: "/doctors/:specialty/:name/:id", element: <DoctorDetail /> },
          { path: "/doctordetail/:doctorId", element: <DoctorDetail /> },
          { path: "/doctors/:specialty", element: <SpecialtyRedirect /> },
          { path: "/doctors", element: <SpecialtyRedirect /> },
          { path: "/our-doctors", element: <DoctorSearch /> },
          { path: "/tech", element: <Technology /> },
          { path: "/goals", element: <Goals /> },
          { path: "/our-branches", element: <Branch /> },
          { path: "/director", element: <Director />},
          { path: "/md", element: <ManagingDirector /> },
          { path: "/chairman", element: <Chairman /> },
          { path: "/hotlines", element: <Hotlines /> },
          { path: "/dmd", element: <Dmd /> },
          { path: "/notice", element: <Notice /> },
          { path: "/notices/:id", element: <NoticeDetails /> },
          { path: "/video", element: <Videos /> },
          // { path: "/health-talks", element: <HealthTalks /> },
          { path: "/contact-us", element: <Contact /> },
          { path: "/health", element: <Health /> },
          { path: "/about", element: <About /> },
          { path: "/about1", element: <AboutLedger /> },
          { path: "/about2", element: <AboutInstrument /> },
          { path: "/about3", element: <AboutGallery /> },
          { path: "/terms&conditions", element: <Terms /> },
          { path: "/privacy&policy", element: <Privacy /> },
          { path: "/gallery", element: <Gallery /> },
          { path: "/refund", element: <Refund /> },

          // Branch pages
          { path: "/shantinagar", element: <Shantinagar /> },
          { path: "/shyamoli", element: <Shyamoli /> },
          { path: "/mirpur", element: <Mirpur /> },
          { path: "/uttarasector4", element: <Uttara /> },
          { path: "/bogura", element: <Bogura /> },
          { path: "/rangpur", element: <Rangpur /> },
          { path: "/badda", element: <Badda /> },
          { path: "/barishal", element: <Barishal /> },
          { path: "/chattogram", element: <Chattogram /> },
          { path: "/dhanmondi", element: <Dhanmondi /> },
          { path: "/dinajpur", element: <Dinajpur /> },
          { path: "/englishRoad", element: <EnglishRoad /> },
          { path: "/gazipur", element: <Gazipur /> },
          { path: "/jatrabari", element: <Jatrabari /> },
          { path: "/khulna", element: <Khulna /> },
          { path: "/kushtia", element: <Kushtia /> },
          { path: "/mymensingh", element: <Mymensingh /> },
          { path: "/narayangonj", element: <Narayangonj /> },
          { path: "/noakhali", element: <Noakhali /> },
          { path: "/rajshahi", element: <Rajshahi /> },
          { path: "/savar", element: <Savar /> },
          { path: "/uttarasector13", element: <UttaraGaribENewaz /> },
        ],
      },
    ],
    errorElement: <Error />,
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
