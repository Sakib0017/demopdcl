// Pure URL helpers for doctor profile pages.
// MUST NOT import secrets.js or use import.meta.env — this module is imported
// by plain Node in tests and in scripts/generate-sitemap.mjs.

const SPECIALTY_FALLBACK = "general-practice";
const MAX_NAME_SEGMENT = 70;

export const slugify = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\([^)]*\)/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const truncateSlug = (slug, max = MAX_NAME_SEGMENT) => {
  if (!slug || slug.length <= max) return slug || "";
  // The cut already lands on a boundary — keep the full allowance.
  if (slug[max] === "-") return slug.slice(0, max);
  const cut = slug.slice(0, max);
  const lastDash = cut.lastIndexOf("-");
  const trimmed = lastDash > 0 ? cut.slice(0, lastDash) : cut;
  return trimmed.replace(/-+$/g, "");
};

export const titleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());

// The list endpoint nests specialty under `specialist.name`; the detail
// endpoint flattens it to `specialist_name`. Handle both.
export const primarySpecialty = (doctor) => {
  const first = doctor?.specialists?.[0];
  if (!first) return "";
  return first.specialist?.name || first.specialist_name || "";
};

// The list endpoint nests branch under `branch.name`; the detail endpoint
// flattens it to `name` and returns it uppercased.
export const primaryBranch = (doctor) => {
  const first = doctor?.branches?.[0];
  if (!first) return "";
  return first.branch?.name || first.name || "";
};

export const buildDoctorPath = (doctor, id = doctor?.id) => {
  const specialty = slugify(primarySpecialty(doctor)) || SPECIALTY_FALLBACK;
  const name = truncateSlug(slugify(doctor?.name)) || `doctor-${id}`;
  return `/doctors/${specialty}/${name}/${id}`;
};
