import test from "node:test";
import assert from "node:assert/strict";
import {
  clampText,
  doctorTitle,
  doctorDescription,
  DESC_MAX,
  DESC_MIN,
} from "./doctorSeo.js";

const doctor = {
  name: "Prof. Dr. M. Nazrul Islam",
  degree: "MBBS, FCPS, FRCP (London), FACC, FESC.",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI" }],
};

// Real record with a 190-character run-on degree field.
const longDegreeDoctor = {
  name: "Prof. Dr. A. A. Shafi Majumder",
  degree:
    "MBBS, D.Card, MD (Card), FACC, FSGC, FRCP. Research Fellow, NCVC 9Japam), " +
    "WHO Fellow in Cardiology,USA Director & Professor of Cardiology (Retd) " +
    "National Institute of Cardiovascular Diseases, Dhaka.",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI" }],
};

test("clampText leaves short text untouched", () => {
  assert.equal(clampText("hello", 20), "hello");
});

test("clampText never exceeds the maximum", () => {
  const out = clampText("a".repeat(50) + " " + "b".repeat(50), 40);
  assert.ok(out.length <= 40, `got ${out.length}`);
});

test("doctorTitle builds Name | Specialty in City | Org, matching the on-page headline", () => {
  const out = doctorTitle(doctor);
  assert.equal(
    out,
    "Prof. Dr. M. Nazrul Islam | Cardiology in Dhaka | Popular Diagnostic Centre Ltd."
  );
});

test("doctorTitle never drops the specialty/city clause for length, even past the old 70-char cap", () => {
  const longDoctor = {
    name: "Associate Prof. Dr. Iftekhar Ahmed Swapan ( Mornig)",
    specialists: [{ specialist_name: "Skin/Dermatology" }],
    branches: [{ name: "UTTARA GARIB E NEWAZ (SECTOR-13)" }],
  };
  const out = doctorTitle(longDoctor);
  assert.equal(
    out,
    "Associate Prof. Dr. Iftekhar Ahmed Swapan ( Mornig) | Skin/Dermatology in Dhaka | Popular Diagnostic Centre Ltd."
  );
  assert.ok(out.length > 70, `expected this to exceed the old cap, got ${out.length}`);
});

test("doctorTitle falls back to Specialist when there is no specialty or city", () => {
  assert.equal(
    doctorTitle({ name: "Dr. X", specialists: [], branches: [{ name: "MIRPUR" }] }),
    "Dr. X | Specialist | Popular Diagnostic Centre Ltd."
  );
});

test("doctorTitle only clamps the name once it alone is extremely long, never the specialty/city/org", () => {
  const veryLongName = {
    name: "Prof. Dr. Mohammad Abdul Karim Chowdhury Bin Rashid Al-Amin Hasan Uddin Al-Jabbar Ibn Khalid Rahman Siddiqui",
    specialists: [{ specialist_name: "Cardiology" }],
    branches: [{ name: "DHANMONDI" }],
  };
  const out = doctorTitle(veryLongName);
  assert.ok(out.includes("Cardiology in Dhaka | Popular Diagnostic Centre Ltd."));
  assert.ok(!out.startsWith(veryLongName.name), "name should have been clamped");
});

test("doctorDescription includes name, degrees, specialty and branch", () => {
  const out = doctorDescription(doctor);
  assert.ok(out.startsWith("Prof. Dr. M. Nazrul Islam, MBBS"), out);
  assert.ok(out.includes("Cardiology specialist"), out);
  assert.ok(out.includes("Dhanmondi"), out);
});

test("doctorDescription stays within the SERP budget", () => {
  const out = doctorDescription(doctor);
  assert.ok(out.length <= DESC_MAX, `too long: ${out.length}`);
  assert.ok(out.length >= DESC_MIN, `too short: ${out.length}`);
});

test("doctorDescription truncates a 190-character degree field", () => {
  const out = doctorDescription(longDegreeDoctor);
  assert.ok(out.length <= DESC_MAX, `too long: ${out.length}`);
  assert.ok(out.includes("Cardiology specialist"), out);
});

test("doctorDescription keeps only whole credentials", () => {
  const out = doctorDescription(longDegreeDoctor);
  const tailSuffix =
    ", Cardiology specialist at Popular Diagnostic Centre, Dhanmondi. View chamber schedule and book an appointment online.";
  assert.ok(out.endsWith(tailSuffix), out);
  const degreePart = out.slice(
    longDegreeDoctor.name.length + 2,
    out.length - tailSuffix.length
  );
  const originals = longDegreeDoctor.degree.split(",").map((part) => part.trim());
  for (const kept of degreePart.split(",").map((part) => part.trim())) {
    assert.ok(originals.includes(kept), `"${kept}" is not a whole credential`);
  }
});

test("doctorDescription works with no degree field", () => {
  const out = doctorDescription({
    name: "Dr. Y",
    specialists: [{ specialist_name: "Neurology" }],
    branches: [{ name: "UTTARA" }],
  });
  assert.ok(out.length <= DESC_MAX);
  assert.ok(out.includes("Neurology specialist"), out);
});

test("doctorDescription matches the exact '{name}, {specialty} specialist at {org}, {branch}. ...' template with no degree", () => {
  const out = doctorDescription({
    name: "Dr. Y",
    specialists: [{ specialist_name: "Neurology" }],
    branches: [{ name: "UTTARA" }],
  });
  assert.equal(
    out,
    "Dr. Y, Neurology specialist at Popular Diagnostic Centre, Uttara. View chamber schedule and book an appointment online."
  );
});

test("doctorDescription with long name exhausts budget, leaving no room for degrees", () => {
  const longName = "Dr. Very Long Name That Takes Up Most Of The Description Character Budget So No Degrees Fit";
  const out = doctorDescription({
    name: longName,
    degree: "MBBS, FCPS, MD, PhD",
    specialists: [{ specialist_name: "Cardiology" }],
    branches: [{ name: "DHAKA" }],
  });
  assert.ok(out.length <= DESC_MAX, `too long: ${out.length}`);
  assert.ok(out.length >= DESC_MIN, `too short: ${out.length}`);
  assert.ok(!out.includes("MBBS"), "no degrees should be included when budget exhausted");
});

test("doctorTitle with no specialty and no branch falls back to Specialist", () => {
  assert.equal(
    doctorTitle({ name: "Dr. Z", specialists: [], branches: [] }),
    "Dr. Z | Specialist | Popular Diagnostic Centre Ltd."
  );
});

import {
  to24Hour,
  openingHours,
  doctorJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "./doctorSeo.js";

const scheduled = {
  name: "Prof. Dr. M. Nazrul Islam",
  image: "https://old.populardiagnostic.com/x.jpeg",
  mobile: "01711563450",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI", phone: "09666 787801" }],
  schedule: [{ day: "Sunday", start_time: "2:00 pm", end_time: "5:00 pm" }],
};

test("to24Hour converts afternoon times", () => {
  assert.equal(to24Hour("2:00 pm"), "14:00");
  assert.equal(to24Hour("5:30 pm"), "17:30");
});

test("to24Hour converts morning times", () => {
  assert.equal(to24Hour("9:00 am"), "09:00");
  assert.equal(to24Hour("11:45 am"), "11:45");
});

test("to24Hour handles the noon and midnight edge cases", () => {
  assert.equal(to24Hour("12:00 pm"), "12:00");
  assert.equal(to24Hour("12:30 am"), "00:30");
});

test("to24Hour returns null for unparseable input", () => {
  assert.equal(to24Hour("closed"), null);
  assert.equal(to24Hour(""), null);
  assert.equal(to24Hour(null), null);
});

test("openingHours maps a schedule to schema.org shape", () => {
  assert.deepEqual(openingHours(scheduled.schedule), [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "https://schema.org/Sunday",
      opens: "14:00",
      closes: "17:00",
    },
  ]);
});

test("openingHours drops entries with unparseable times", () => {
  assert.deepEqual(
    openingHours([{ day: "Monday", start_time: "n/a", end_time: "5:00 pm" }]),
    []
  );
});

test("doctorJsonLd uses the branch phone, never the personal mobile", () => {
  const ld = doctorJsonLd(scheduled, "https://www.populardiagnostic.com/x");
  assert.equal(ld.telephone, "09666 787801");
  assert.notEqual(ld.telephone, scheduled.mobile);
  assert.ok(!JSON.stringify(ld).includes("01711563450"));
});

test("doctorJsonLd emits a Physician node with specialty and address", () => {
  const ld = doctorJsonLd(scheduled, "https://www.populardiagnostic.com/x");
  assert.equal(ld["@type"], "Physician");
  assert.equal(ld.medicalSpecialty, "Cardiology");
  assert.equal(ld.address.addressLocality, "Dhanmondi");
  assert.equal(ld.address.addressCountry, "BD");
  assert.equal(ld.worksFor.name, "Popular Diagnostic Centre Limited");
});

test("doctorJsonLd omits telephone when no branch phone exists", () => {
  const ld = doctorJsonLd(
    { name: "Dr. Z", mobile: "0170000000", branches: [{ name: "SAVAR" }] },
    "https://www.populardiagnostic.com/y"
  );
  assert.equal("telephone" in ld, false);
});

test("jsonLdScript escapes </script> breakout while staying valid, round-tripping JSON", () => {
  const value = { name: "</script><img src=x>" };
  const out = jsonLdScript(value);
  assert.ok(!out.includes("<"), out);
  assert.deepEqual(JSON.parse(out), value);
});

test("breadcrumbJsonLd builds a four-level trail", () => {
  const ld = breadcrumbJsonLd(
    scheduled,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  assert.equal(ld["@type"], "BreadcrumbList");
  assert.equal(ld.itemListElement.length, 4);
  assert.equal(ld.itemListElement[2].name, "Cardiology");
  assert.equal(
    ld.itemListElement[2].item,
    "https://www.populardiagnostic.com/doctors/cardiology"
  );
  assert.equal(ld.itemListElement[3].position, 4);
});

import { displayName, doctorHeadline } from "./doctorSeo.js";
import { cityForBranch } from "./branchCity.js";

test("cityForBranch resolves known branch spellings to their city", () => {
  assert.equal(cityForBranch("Dhanmondi"), "Dhaka");
  assert.equal(cityForBranch("Barisal"), "Barishal");
  assert.equal(cityForBranch("Cumilla"), "Comilla");
  assert.equal(cityForBranch("Uttara (U-2)"), "Dhaka");
  assert.equal(cityForBranch("Rangpur (U-2)"), "Rangpur");
  assert.equal(cityForBranch("Kurigram"), "Kurigram");
});

test("cityForBranch folds the non-breaking space in the real Uttara Garib E Newaz branch name", () => {
  assert.equal(cityForBranch("Uttara Garib E Newaz (Sector-13)"), "Dhaka");
});

test("cityForBranch returns an empty string for unknown or empty input", () => {
  assert.equal(cityForBranch("Nonexistent Branch"), "");
  assert.equal(cityForBranch(""), "");
  assert.equal(cityForBranch(null), "");
  assert.equal(cityForBranch(undefined), "");
});

test("displayName leaves a name that already carries a professional title unchanged", () => {
  assert.equal(displayName({ name: "Prof. Dr. M. Nazrul Islam" }), "Prof. Dr. M. Nazrul Islam");
});

test("displayName leaves a name unchanged when the title token is embedded, not just 'Dr'", () => {
  assert.equal(
    displayName({ name: "Nutritionist. Md. Sazzadur Rahman" }),
    "Nutritionist. Md. Sazzadur Rahman"
  );
});

test("displayName leaves a bare non-physician name unchanged", () => {
  assert.equal(
    displayName({
      name: "Sazzadur Rahman",
      specialists: [{ specialist_name: "Food & Nutrition" }],
    }),
    "Sazzadur Rahman"
  );
});

test("displayName prepends Dr. to a bare physician name", () => {
  assert.equal(
    displayName({
      name: "Sonia Sabrin",
      specialists: [{ specialist_name: "Cardiology" }],
    }),
    "Dr. Sonia Sabrin"
  );
});

test("doctorHeadline combines one specialty and the branch city", () => {
  assert.equal(
    doctorHeadline({
      specialists: [{ specialist_name: "Cardiology" }],
      branches: [{ name: "DHANMONDI" }],
    }),
    "Cardiology in Dhaka"
  );
});

test("doctorHeadline joins two specialties with &", () => {
  assert.equal(
    doctorHeadline({
      specialists: [
        { specialist_name: "Colorectal Surgery" },
        { specialist_name: "Breast Cancer Specialist" },
      ],
      branches: [{ name: "DHANMONDI" }],
    }),
    "Colorectal Surgery & Breast Cancer Specialist in Dhaka"
  );
});

test("doctorHeadline drops the city clause when the branch doesn't resolve", () => {
  assert.equal(
    doctorHeadline({
      specialists: [{ specialist_name: "Neurology" }],
      branches: [{ name: "Some Unmapped Branch" }],
    }),
    "Neurology"
  );
});

test("doctorHeadline falls back to Specialist with no data", () => {
  assert.equal(doctorHeadline({}), "Specialist");
});

import { doctorFaq, doctorGraph, doctorJobTitle } from "./doctorSeo.js";

const fullDoctor = {
  name: "Prof. Dr. M. Nazrul Islam",
  image: "https://old.populardiagnostic.com/x.jpeg",
  mobile: "01711563450",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI", phone: "09666 787801" }],
  schedule: [
    { day: "Saturday", start_time: "2:00 pm", end_time: "5:00 pm" },
    { day: "Sunday", start_time: "2:00 pm", end_time: "5:00 pm" },
  ],
};

const bareDoctor = { name: "Dr. Z", specialists: [], branches: [], schedule: [] };

test("doctorFaq builds the chamber hours entry from a populated schedule", () => {
  const faqs = doctorFaq(fullDoctor);
  const hoursEntry = faqs.find((faq) => faq.question.includes("chamber hours"));
  assert.ok(hoursEntry, "hours entry should be present");
  assert.equal(
    hoursEntry.answer,
    "Saturday: 2:00 pm - 5:00 pm. Sunday: 2:00 pm - 5:00 pm."
  );
});

test("doctorFaq omits the hours entry when schedule is empty", () => {
  const faqs = doctorFaq({ ...fullDoctor, schedule: [] });
  assert.equal(
    faqs.some((faq) => faq.question.includes("chamber hours")),
    false
  );
});

test("doctorFaq omits the appointment entry when the branch has no phone", () => {
  const faqs = doctorFaq({ ...fullDoctor, branches: [{ name: "DHANMONDI" }] });
  assert.equal(
    faqs.some((faq) => faq.question.includes("book an appointment")),
    false
  );
});

test("doctorFaq includes the appointment entry using the branch phone, never mobile", () => {
  const faqs = doctorFaq(fullDoctor);
  const apptEntry = faqs.find((faq) => faq.question.includes("book an appointment"));
  assert.ok(apptEntry, "appointment entry should be present");
  assert.ok(apptEntry.answer.includes("09666 787801"));
  assert.ok(!apptEntry.answer.includes(fullDoctor.mobile));
});

test("doctorFaq returns no entries at all for a doctor with no schedule, branch, or specialty", () => {
  assert.deepEqual(doctorFaq(bareDoctor), []);
});

test("doctorGraph returns exactly the expected @types with resolving @id cross-links", () => {
  const graph = doctorGraph(
    fullDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  assert.equal(graph["@context"], "https://schema.org");

  const types = graph["@graph"].map((node) => node["@type"]);
  assert.deepEqual(types, [
    "MedicalOrganization",
    "Physician",
    "Person",
    "BreadcrumbList",
    "FAQPage",
  ]);

  const org = graph["@graph"].find((node) => node["@type"] === "MedicalOrganization");
  const physician = graph["@graph"].find((node) => node["@type"] === "Physician");
  const person = graph["@graph"].find((node) => node["@type"] === "Person");

  assert.equal(physician.worksFor["@id"], org["@id"]);
  assert.equal(person.worksFor["@id"], org["@id"]);
});

test("doctorGraph omits the FAQPage node when the doctor has no schedule, branch, or specialty", () => {
  const graph = doctorGraph(
    bareDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/general-practice/dr-z/1"
  );
  const types = graph["@graph"].map((node) => node["@type"]);
  assert.ok(!types.includes("FAQPage"), types.join(", "));
});

test("doctorGraph's FAQPage mainEntity length matches doctorFaq's length for a fully-populated doctor", () => {
  const graph = doctorGraph(
    fullDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  const faqPage = graph["@graph"].find((node) => node["@type"] === "FAQPage");
  assert.ok(faqPage, "FAQPage node should be present");
  assert.equal(faqPage.mainEntity.length, doctorFaq(fullDoctor).length);
});

test("doctorGraph never leaks doctor.mobile into the serialized output", () => {
  const graph = doctorGraph(
    fullDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  assert.ok(!JSON.stringify(graph).includes(fullDoctor.mobile));
});

test("doctorGraph's Person.jobTitle equals doctorJobTitle(doctor)", () => {
  const graph = doctorGraph(
    fullDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  const person = graph["@graph"].find((node) => node["@type"] === "Person");
  assert.equal(person.jobTitle, doctorJobTitle(fullDoctor));
});

test("doctorJobTitle appends Specialist to a medical specialty", () => {
  assert.equal(
    doctorJobTitle({ specialists: [{ specialist_name: "Cardiology" }] }),
    "Cardiology Specialist"
  );
});

test("doctorJobTitle leaves a non-physician specialty unsuffixed", () => {
  assert.equal(
    doctorJobTitle({ specialists: [{ specialist_name: "Nutritionist" }] }),
    "Nutritionist"
  );
});

test("doctorJobTitle falls back to Specialist with no specialty", () => {
  assert.equal(doctorJobTitle({ specialists: [] }), "Specialist");
});

test("doctorGraph honours a precomputed faqs array instead of recomputing its own", () => {
  const graph = doctorGraph(
    fullDoctor,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094",
    [{ question: "Q", answer: "A" }]
  );
  const faqPage = graph["@graph"].find((node) => node["@type"] === "FAQPage");
  assert.ok(faqPage, "FAQPage node should be present");
  assert.equal(faqPage.mainEntity.length, 1);
  assert.equal(faqPage.mainEntity[0].name, "Q");
});
