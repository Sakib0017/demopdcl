// Branch -> city for doctor page headings.
// MUST NOT import anything: this module is loaded by plain Node in tests and in
// scripts/generate-sitemap.mjs. In particular do not import src/constants/branches.js,
// which imports image assets and cannot resolve outside Vite.
//
// Keys cover every branch name the doctor API returns. Values follow the project's own
// braCity values in src/constants/branches.js, which treat the Dhaka metro branches
// (including Gazipur, Savar and Narayangonj) as Dhaka.

const BRANCH_CITY = {
  badda: "Dhaka",
  barishal: "Barishal",
  barisal: "Barishal",
  bogura: "Bogura",
  chattogram: "Chattogram",
  comilla: "Comilla",
  cumilla: "Comilla",
  dhanmondi: "Dhaka",
  dinajpur: "Dinajpur",
  englishroad: "Dhaka",
  gazipur: "Dhaka",
  jatrabari: "Dhaka",
  khulna: "Khulna",
  kurigram: "Kurigram",
  kushtia: "Kushtia",
  mirpur: "Dhaka",
  mymensingh: "Mymensingh",
  narayangonj: "Dhaka",
  noakhali: "Noakhali",
  rajshahi: "Rajshahi",
  rangpur: "Rangpur",
  savar: "Dhaka",
  shantinagar: "Dhaka",
  shyamoli: "Dhaka",
  tangail: "Tangail",
  uttara: "Dhaka",
};

// Fold case, punctuation, unit/sector suffixes and non-breaking spaces (U+00A0
// appears in "Uttara Garib E Newaz (Sector-13)") down to a lookup key.
const normalizeBranch = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z]+/g, "");

export const cityForBranch = (branchName) => {
  const key = normalizeBranch(branchName);
  if (!key) return "";
  if (BRANCH_CITY[key]) return BRANCH_CITY[key];
  // "uttarajashimuddin", "uttaragaribenewaz", "rangpuru" etc. -> longest matching prefix
  const match = Object.keys(BRANCH_CITY)
    .filter((candidate) => key.startsWith(candidate))
    .sort((a, b) => b.length - a.length)[0];
  return match ? BRANCH_CITY[match] : "";
};
