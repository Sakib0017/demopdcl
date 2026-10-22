import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  truncateSlug,
  titleCase,
  primarySpecialty,
  primaryBranch,
  buildDoctorPath,
} from "./doctorUrl.js";

const listDoctor = {
  id: 2094,
  name: "Prof. Dr. M. Nazrul Islam",
  specialists: [{ specialist: { name: "Cardiology" } }],
  branches: [{ branch: { name: "Dhanmondi" } }],
};

const detailDoctor = {
  name: "Prof. Dr. M. Nazrul Islam",
  specialists: [{ specialist_id: 167, specialist_name: "Cardiology" }],
  branches: [{ branch_id: 1, name: "DHANMONDI", phone: "09666 787801" }],
};

test("slugify lowercases and hyphenates", () => {
  assert.equal(slugify("Prof. Dr. M. Nazrul Islam"), "prof-dr-m-nazrul-islam");
});

test("slugify converts a slash to a hyphen, never a path separator", () => {
  assert.equal(slugify("Eye / Ophthalmology"), "eye-ophthalmology");
  assert.equal(slugify("Child/Paediatrics"), "child-paediatrics");
});

test("slugify strips parenthetical scheduling notes", () => {
  assert.equal(
    slugify("Assistant Prof. Dr. Md.  Minhaj Uddin Bhuiyan (Friday Morning)"),
    "assistant-prof-dr-md-minhaj-uddin-bhuiyan"
  );
});

test("slugify handles ampersands and commas", () => {
  assert.equal(slugify("ENT, Head & Neck Surgery"), "ent-head-neck-surgery");
});

test("slugify returns empty string for empty input", () => {
  assert.equal(slugify(""), "");
  assert.equal(slugify(null), "");
  assert.equal(slugify(undefined), "");
});

test("truncateSlug keeps a segment that ends exactly on a boundary", () => {
  assert.equal(truncateSlug("aaa-bbb-ccc-ddd", 11), "aaa-bbb-ccc");
});

test("truncateSlug drops a word the cut would split", () => {
  assert.equal(truncateSlug("aaa-bbb-ccccccc", 12), "aaa-bbb");
});

test("truncateSlug leaves short slugs untouched", () => {
  assert.equal(truncateSlug("short-slug", 70), "short-slug");
});

test("titleCase normalizes an uppercase branch name", () => {
  assert.equal(titleCase("DHANMONDI"), "Dhanmondi");
  assert.equal(titleCase("english road"), "English Road");
});

test("primarySpecialty reads the list API shape", () => {
  assert.equal(primarySpecialty(listDoctor), "Cardiology");
});

test("primarySpecialty reads the detail API shape", () => {
  assert.equal(primarySpecialty(detailDoctor), "Cardiology");
});

test("primaryBranch reads both API shapes", () => {
  assert.equal(primaryBranch(listDoctor), "Dhanmondi");
  assert.equal(primaryBranch(detailDoctor), "DHANMONDI");
});

test("buildDoctorPath builds the canonical four-segment path", () => {
  assert.equal(
    buildDoctorPath(listDoctor),
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
});

test("buildDoctorPath accepts an explicit id for detail-shaped data", () => {
  assert.equal(
    buildDoctorPath(detailDoctor, 2094),
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
});

test("buildDoctorPath falls back to general-practice with no specialty", () => {
  assert.equal(
    buildDoctorPath({ id: 7, name: "Dr. A B", specialists: [] }),
    "/doctors/general-practice/dr-a-b/7"
  );
});

test("buildDoctorPath falls back to doctor-{id} with no name", () => {
  assert.equal(
    buildDoctorPath({ id: 9, name: "", specialists: [] }),
    "/doctors/general-practice/doctor-9/9"
  );
});
