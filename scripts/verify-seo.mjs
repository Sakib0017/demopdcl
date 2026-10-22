#!/usr/bin/env node
// Validates the slug and metadata generators against every live doctor record.
// Run: npm run verify:seo

import { buildDoctorPath } from "../src/utils/doctorUrl.js";
import {
  doctorTitle,
  doctorDescription,
  to24Hour,
  DESC_MAX,
  DESC_MIN,
  TITLE_MAX,
} from "../src/utils/doctorSeo.js";

const BASE_URL = process.env.VITE_BASE_URL || "https://api.populardiagnostic.com";
const TOKEN = process.env.VITE_API_TOKEN;

if (!TOKEN) {
  console.error("VITE_API_TOKEN is required. Try: node --env-file=.env scripts/verify-seo.mjs");
  process.exit(1);
}

const fetchPage = async (page) => {
  const res = await fetch(`${BASE_URL}/api/doctors?token=${TOKEN}&page=${page}`);
  if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
  return res.json();
};

const failures = [];
const fail = (id, message) => failures.push(`  [${id}] ${message}`);
let minDescription = Number.POSITIVE_INFINITY;
let maxDescription = 0;
let minTitle = Number.POSITIVE_INFINITY;
let maxTitle = 0;

const first = await fetchPage(1);
const lastPage = first.data.last_page;
const expectedTotal = first.data.total;
const doctors = [...first.data.data];

// Without this, a renamed/missing last_page makes `2 <= undefined` false, the
// loop never runs, and the script "passes" having checked only page 1.
if (!Number.isInteger(lastPage) || lastPage < 1) {
  throw new Error(`unusable last_page from API: ${JSON.stringify(lastPage)}`);
}

for (let page = 2; page <= lastPage; page += 1) {
  const body = await fetchPage(page);
  doctors.push(...body.data.data);
}

// The API reports its own total — assert we collected all of it rather than
// trusting a hardcoded floor. Catches silent under-collection exactly.
if (Number.isInteger(expectedTotal) && doctors.length !== expectedTotal) {
  throw new Error(`collected ${doctors.length} doctors, API reports ${expectedTotal}`);
}

console.log(`Fetched ${doctors.length} doctors across ${lastPage} pages.`);

const seenPaths = new Map();
const SEGMENT = /^[a-z0-9-]+$/;

for (const doctor of doctors) {
  // Check the id independently. The round-trip test below cannot catch a
  // missing id: buildDoctorPath renders `undefined` into the path, and
  // String(undefined) === "undefined" makes the comparison pass.
  if (doctor.id == null || !/^[0-9]+$/.test(String(doctor.id))) {
    fail(doctor.id, `missing or non-numeric id: ${JSON.stringify(doctor.id)}`);
  }

  const path = buildDoctorPath(doctor);
  const segments = path.split("/").slice(1);

  if (segments.length !== 4 || segments[0] !== "doctors") {
    fail(doctor.id, `malformed path: ${path}`);
  }
  for (const segment of segments.slice(1, 3)) {
    if (!SEGMENT.test(segment)) fail(doctor.id, `unsafe segment "${segment}" in ${path}`);
  }
  if (String(segments[3]) !== String(doctor.id)) {
    fail(doctor.id, `id does not round-trip: ${path}`);
  }
  if (seenPaths.has(path)) {
    fail(doctor.id, `duplicate path with doctor ${seenPaths.get(path)}: ${path}`);
  }
  seenPaths.set(path, doctor.id);

  const title = doctorTitle(doctor);
  minTitle = Math.min(minTitle, title.length);
  maxTitle = Math.max(maxTitle, title.length);
  if (!title.trim()) fail(doctor.id, "empty title");
  if (title.length > TITLE_MAX) {
    fail(doctor.id, `title ${title.length} chars (max ${TITLE_MAX})`);
  }

  const description = doctorDescription(doctor);
  minDescription = Math.min(minDescription, description.length);
  maxDescription = Math.max(maxDescription, description.length);
  if (description.length > DESC_MAX) {
    fail(doctor.id, `description ${description.length} chars (max ${DESC_MAX})`);
  }
  if (description.length < DESC_MIN) {
    fail(doctor.id, `description ${description.length} chars (min ${DESC_MIN})`);
  }

  for (const slot of doctor.schedule || []) {
    if (slot.start_time && !to24Hour(slot.start_time)) {
      fail(doctor.id, `unparseable start_time "${slot.start_time}"`);
    }
    if (slot.end_time && !to24Hour(slot.end_time)) {
      fail(doctor.id, `unparseable end_time "${slot.end_time}"`);
    }
  }
}

console.log(`Unique paths: ${seenPaths.size} / ${doctors.length}`);
console.log(`Title lengths: ${minTitle}-${maxTitle} (limit ${TITLE_MAX})`);
console.log(`Description lengths: ${minDescription}-${maxDescription} (limit ${DESC_MAX})`);

if (failures.length) {
  console.error(`\nFAILED with ${failures.length} problem(s):`);
  console.error(failures.slice(0, 40).join("\n"));
  if (failures.length > 40) console.error(`  ...and ${failures.length - 40} more`);
  process.exit(1);
}

console.log("\nAll SEO assertions passed.");
