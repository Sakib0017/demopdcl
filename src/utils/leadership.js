// Band definitions and helpers shared by the About page variants.
// Copied from About.jsx (which keeps its own inline copies untouched);
// consolidate after a winning variant is promoted.
export const BANDS = [
  { key: "advisory", label: "Advisory" },
  { key: "gm", label: "General Management" },
  { key: "heads", label: "Departmental Heads" },
  { key: "managers", label: "Management" },
];

// Sort a person into a band from their designation. Deputy General Managers
// each head a department, so they sit with the other departmental heads.
export const bandOf = (designation = "") => {
  if (/advis/i.test(designation)) return "advisory";
  if (/general\s+manager/i.test(designation) && !/deputy/i.test(designation)) return "gm";
  if (/deputy\s+general\s+manager/i.test(designation) || /\bhead\b/i.test(designation)) return "heads";
  return "managers";
};

// Initials for the graceful fallback when a portrait fails to load.
export const getInitials = (name = "") =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => !/^(dr\.?|mr\.?|mrs\.?|ms\.?|md\.?|late)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
