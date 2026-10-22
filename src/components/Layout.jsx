import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Feedbacks,
  Hero,
  Cor,
  Search,
  HomeContent,
} from "../components";
import { SITE_URL } from "../secrets";

// Copy supplied verbatim by the SEO team. Do not paraphrase or re-clamp — the
// exact characters are the deliverable. The missing space in "Bangladesh|" is
// theirs to correct; a query is open with them.
//
// These two strings are also mirrored as static tags in index.html, so that
// crawlers which never execute JS (Facebook, LinkedIn, WhatsApp) see real copy
// instead of an empty #root. Keep the two in sync: nothing breaks mechanically
// if they drift, but the copy those crawlers read would stop matching what the
// page actually renders, which is the entire reason for duplicating it.
//
// Why the static tags don't produce duplicates: each carries data-rh="true",
// the attribute react-helmet-async stamps on tags it owns. On mount its
// updateTags() collects every [data-rh] tag in <head>, keeps the ones matching
// a tag it wants to render, and removes the rest — so it takes ownership of
// them. og:type/og:site_name/twitter:card match the App shell in main.jsx
// exactly and are adopted in place; the three carrying homepage copy are
// removed and re-appended once, because Layout is lazy-loaded and the shell
// commits its generic fallback first. Either way the settled DOM holds exactly
// one correct tag of each. Verified with tag-count assertions across /, a
// branch page, a doctor page and the error route.
const HOME_TITLE =
  "Popular Diagnostic Centre Ltd. | Advanced Health Diagnosis & Specialist Doctors";
const HOME_DESCRIPTION =
  "Book accurate diagnostic & blood tests, health checkups, imaging, pathology, and doctors consultations from reliable medical care across Bangladesh.";

function Layout() {
  return (
    <div className="bg-[#ffffff]">
      {/* og:type, og:site_name, twitter:card and the canonical come from the
          App shell in main.jsx and are already correct here — re-declaring
          them would only add a second place to drift. */}
      <Helmet>
        {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
        <title>{HOME_TITLE}</title>
        <meta name="description" content={HOME_DESCRIPTION} />
        */}

        <meta property="og:title" content={HOME_TITLE} />
        <meta property="og:description" content={HOME_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />

        <meta name="twitter:title" content={HOME_TITLE} />
        <meta name="twitter:description" content={HOME_DESCRIPTION} />
      </Helmet>
      <Hero />
      <Search />
      <HomeContent />
      <Cor />
      <Feedbacks />
    </div>
  );
}

export default Layout;
