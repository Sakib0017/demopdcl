#!/usr/bin/env node
// Emits public/sitemap.xml from the live doctor list.
// Failure is non-fatal: a flaky API must never block a deploy.

import { writeFile, mkdir } from "node:fs/promises";
import { buildDoctorPath } from "../src/utils/doctorUrl.js";

const SITE_URL = process.env.VITE_SITE_URL || "https://www.populardiagnostic.com";
const BASE_URL = process.env.VITE_BASE_URL || "https://api.populardiagnostic.com";
const TOKEN = process.env.VITE_API_TOKEN;

const STATIC_PATHS = [
  "/", "/our-doctors", "/our-branches", "/sample-collection", "/about",
  "/tech", "/goals", "/director", "/chairman", "/dmd", "/hotlines",
  "/notice", "/video", "/contact-us", "/health", "/gallery",
  "/terms&conditions", "/privacy&policy", "/refund",
  "/shantinagar", "/shyamoli", "/mirpur", "/uttarasector4", "/bogura",
  "/rangpur", "/badda", "/barishal", "/chattogram", "/dhanmondi",
  "/dinajpur", "/englishRoad", "/gazipur", "/jatrabari", "/khulna",
  "/kushtia", "/mymensingh", "/narayangonj", "/noakhali", "/rajshahi",
  "/savar", "/uttarasector13",
];

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (char) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char])
  );

const urlEntry = (path, changefreq, priority) =>
  `  <url>\n` +
  `    <loc>${escapeXml(SITE_URL + path)}</loc>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

const main = async () => {
  if (!TOKEN) throw new Error("VITE_API_TOKEN is not set");

  const fetchPage = async (page) => {
    const res = await fetch(`${BASE_URL}/api/doctors?token=${TOKEN}&page=${page}`);
    if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
    return res.json();
  };

  const first = await fetchPage(1);
  const lastPage = first.data.last_page;
  const expectedTotal = first.data.total;
  const doctors = [...first.data.data];

  // Same guard as scripts/verify-seo.mjs, and it matters more here: an
  // unreadable last_page makes `2 <= undefined` false, the loop never runs, and
  // this script would overwrite the committed 3,400-URL sitemap with a ~50-URL
  // one — silently de-indexing the site. Throwing is safe: the try/catch below
  // converts it to a warning, and the existing sitemap is left untouched.
  if (!Number.isInteger(lastPage) || lastPage < 1) {
    throw new Error(`unusable last_page from API: ${JSON.stringify(lastPage)}`);
  }

  for (let page = 2; page <= lastPage; page += 1) {
    const body = await fetchPage(page);
    doctors.push(...body.data.data);
  }

  if (Number.isInteger(expectedTotal) && doctors.length !== expectedTotal) {
    throw new Error(`collected ${doctors.length} doctors, API reports ${expectedTotal}`);
  }

  // Same guard as scripts/verify-seo.mjs: a null/missing id would otherwise
  // silently ship "/doctors/x/y/undefined" into the sitemap.
  let skippedCount = 0;
  const doctorEntries = [];
  for (const doctor of doctors) {
    if (doctor.id == null || !/^[1-9][0-9]*$/.test(String(doctor.id))) {
      skippedCount += 1;
      continue;
    }
    doctorEntries.push(urlEntry(buildDoctorPath(doctor), "weekly", "0.7"));
  }
  if (skippedCount > 0) {
    console.warn(`Skipped ${skippedCount} doctor record(s) with a missing/invalid id.`);
  }

  const entries = [
    ...STATIC_PATHS.map((path) =>
      urlEntry(path, "weekly", path === "/" ? "1.0" : "0.8")
    ),
    ...doctorEntries,
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries.join("\n")}\n</urlset>\n`;

  await mkdir("public", { recursive: true });
  await writeFile("public/sitemap.xml", xml, "utf8");
  console.log(`Wrote public/sitemap.xml with ${entries.length} URLs.`);
};

try {
  await main();
} catch (error) {
  console.warn(`Sitemap generation skipped: ${error.message}`);
  console.warn("Keeping the existing public/sitemap.xml.");
}
