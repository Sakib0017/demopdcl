// Pure SEO metadata generators for doctor profile pages.
// MUST NOT import secrets.js or use import.meta.env — the site origin is
// always passed in as a parameter so plain Node can import this module.

import { primaryBranch, primarySpecialty, slugify, titleCase } from "./doctorUrl.js";
import { cityForBranch } from "./branchCity.js";

const ORG = "Popular Diagnostic Centre";
const ORG_TITLE = "Popular Diagnostic Centre Ltd.";
export const DESC_MAX = 160;
export const DESC_MIN = 70;

// Absolute safety net against a corrupted/absurdly long name field. Specialty,
// city, and the org suffix are never dropped for length — search engines
// accept full <title> tags past their own visual SERP truncation — only the
// name is clamped, and only once it alone would blow up the tag.
const NAME_SAFETY_MAX = 100;

export const resolveDoctorMeta = (doctor) => ({
  name: doctor?.name?.trim() || "Doctor",
  specialty: primarySpecialty(doctor),
  branch: titleCase(primaryBranch(doctor)),
});

export const clampText = (text, max) => {
  const value = String(text || "");
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,.-]+$/, "")}…`;
};

// "[Name] | [Specialty] in [City] | Popular Diagnostic Centre Ltd." — reuses
// doctorHeadline for the middle clause so the title always matches the
// on-page heading rendered under the doctor's name.
export const doctorTitle = (doctor) => {
  const { name } = resolveDoctorMeta(doctor);
  const headline = doctorHeadline(doctor);
  return `${clampText(name, NAME_SAFETY_MAX)} | ${headline} | ${ORG_TITLE}`;
};

// Fit as many comma-separated credentials as the remaining budget allows,
// always cutting on a comma boundary. Degree fields run up to 190 characters.
const fitDegrees = (degree, budget) => {
  if (!degree || budget <= 0) return "";
  const parts = String(degree)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const kept = [];
  let length = 0;
  for (const part of parts) {
    const addition = kept.length ? part.length + 2 : part.length;
    if (length + addition > budget) break;
    kept.push(part);
    length += addition;
  }
  return kept.join(", ");
};

export const doctorDescription = (doctor) => {
  const { name, specialty, branch } = resolveDoctorMeta(doctor);
  const role = specialty ? `${specialty} specialist` : "Consultant";
  const where = branch ? `${ORG}, ${branch}` : ORG;
  const tail = `${role} at ${where}. View chamber schedule and book an appointment online.`;

  const base = `${name}, ${tail}`;
  const degrees = fitDegrees(doctor?.degree, DESC_MAX - base.length - 2);
  const full = degrees ? `${name}, ${degrees}, ${tail}` : base;
  return clampText(full, DESC_MAX);
};

const ORG_FULL = "Popular Diagnostic Centre Limited";

// Schedules store "2:00 pm"; schema.org requires "14:00".
export const to24Hour = (value) => {
  const match = /^\s*(\d{1,2}):(\d{2})\s*([ap])\.?m\.?\s*$/i.exec(String(value || ""));
  if (!match) return null;
  const hour = (Number(match[1]) % 12) + (match[3].toLowerCase() === "p" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
};

export const openingHours = (schedule) =>
  (schedule || [])
    .map((slot) => {
      const opens = to24Hour(slot?.start_time);
      const closes = to24Hour(slot?.end_time);
      if (!opens || !closes || !slot?.day) return null;
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${slot.day}`,
        opens,
        closes,
      };
    })
    .filter(Boolean);

export const doctorJsonLd = (doctor, url) => {
  const { name, specialty, branch } = resolveDoctorMeta(doctor);
  // Never doctor.mobile — that is a personal cell number.
  const telephone = doctor?.branches?.[0]?.phone || "";
  const hours = openingHours(doctor?.schedule);

  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name,
    url,
    ...(doctor?.image ? { image: doctor.image } : {}),
    ...(specialty ? { medicalSpecialty: specialty } : {}),
    worksFor: { "@type": "MedicalOrganization", name: ORG_FULL },
    ...(branch
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: branch,
            addressCountry: "BD",
          },
        }
      : {}),
    ...(telephone ? { telephone } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
  };
};

// react-helmet-async assigns <script> children via innerHTML, not textContent
// (lib/index.esm.js:473-520), and JSON.stringify escapes neither "<" nor "/".
// A doctor field containing "</script" would close the tag and break the head.
export const jsonLdScript = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

// Specialties whose practitioners are not physicians. Prefixing "Dr." for these
// would misrepresent them on a healthcare site.
const NON_PHYSICIAN_SPECIALTIES = new Set([
  "nutritionist",
  "dietician",
  "foodnutrition",
  "physiotherapydepartment",
]);

const TITLE_TOKENS =
  /\b(dr|prof|professor|assoc|asso|assis|asst|asstt|assistant|assistan|consultant|nutritionist|dietician)\b/i;

// 58 of ~3,386 names carry no professional title. 27 of those are genuinely
// non-physician (nutritionists, dieticians, physiotherapists); the rest are doctors
// whose record simply omits the title. Only the latter get "Dr." added.
export const displayName = (doctor) => {
  const name = doctor?.name?.trim() || "Doctor";
  if (TITLE_TOKENS.test(name)) return name;
  const key = primarySpecialty(doctor).toLowerCase().replace(/[^a-z]+/g, "");
  if (NON_PHYSICIAN_SPECIALTIES.has(key)) return name;
  return `Dr. ${name}`;
};

// schema.org jobTitle expects a role, not a heading — no location clause.
// Non-physician specialties already read as roles ("Nutritionist"), so they are
// used verbatim; medical specialties become "<Specialty> Specialist".
export const doctorJobTitle = (doctor) => {
  const specialty = primarySpecialty(doctor);
  if (!specialty) return "Specialist";
  const key = specialty.toLowerCase().replace(/[^a-z]+/g, "");
  if (NON_PHYSICIAN_SPECIALTIES.has(key)) return specialty;
  return `${specialty} Specialist`;
};

// The list endpoint nests specialty names under `specialist.name`; the detail
// endpoint flattens them to `specialist_name`. Handle both, same as
// primarySpecialty in doctorUrl.js but returning every specialty, not just
// the first.
const specialtyNames = (doctor) =>
  (doctor?.specialists || [])
    .map((entry) => entry?.specialist?.name || entry?.specialist_name || "")
    .filter(Boolean);

// "[Specialty] & [Subspecialty] in [City]", degrading as data allows.
// Only ~6% of doctors have a second specialty.
export const doctorHeadline = (doctor) => {
  const specialties = specialtyNames(doctor);
  const city = cityForBranch(primaryBranch(doctor));
  const subject = specialties.slice(0, 2).join(" & ");
  if (subject && city) return `${subject} in ${city}`;
  if (subject) return subject;
  return "Specialist";
};

export const breadcrumbJsonLd = (doctor, origin, path) => {
  const { name, specialty } = resolveDoctorMeta(doctor);
  const specialtySlug = slugify(specialty);
  const trail = [
    { name: "Home", item: `${origin}/` },
    { name: "Doctors", item: `${origin}/our-doctors` },
    ...(specialty
      ? [{ name: specialty, item: `${origin}/doctors/${specialtySlug}` }]
      : []),
    { name, item: `${origin}${path}` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
};

// "A", "A and B", "A, B, and C" — joins a list of specialty names the way a
// person would say them, for use inside an FAQ answer sentence.
const naturalJoin = (items) => {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

// Google requires FAQ markup to correspond to Q&A actually visible on the
// page, so this returns plain data: the component renders it verbatim AND
// feeds the same array into doctorGraph's FAQPage node, guaranteeing the DOM
// and the structured data can never drift apart. Every entry is built only
// from data already present on the doctor record — no placeholder text — and
// omitted entirely when its source data is missing.
export const doctorFaq = (doctor) => {
  const name = displayName(doctor);
  const faqs = [];

  const hours = (doctor?.schedule || []).filter(
    (slot) => slot?.day && slot?.start_time && slot?.end_time
  );
  if (hours.length) {
    faqs.push({
      question: `What are ${name}'s chamber hours?`,
      answer: hours
        .map((slot) => `${slot.day}: ${slot.start_time} - ${slot.end_time}.`)
        .join(" "),
    });
  }

  const branch = primaryBranch(doctor);
  if (branch) {
    const city = cityForBranch(branch);
    faqs.push({
      question: `Where does ${name} practise?`,
      answer: `${ORG}, ${titleCase(branch)}${city ? `, ${city}` : ""}.`,
    });
  }

  const specialties = specialtyNames(doctor);
  if (specialties.length) {
    faqs.push({
      question: `What does ${name} specialise in?`,
      answer: naturalJoin(specialties),
    });
  }

  // Never doctor.mobile — that is a personal cell number.
  const phone = doctor?.branches?.[0]?.phone;
  if (phone) {
    faqs.push({
      question: `How do I book an appointment with ${name}?`,
      answer: `Call ${phone} or book online through the Popular Diagnostic Centre appointment system.`,
    });
  }

  return faqs;
};

// Drop @context from a node destined for @graph — only the top-level graph
// object carries it.
const stripContext = (node) => {
  const copy = { ...node };
  delete copy["@context"];
  return copy;
};

// One @graph tying together everything schema.org needs to understand a
// doctor profile page: the organization the doctor works for, the doctor as
// both a Physician (medical facts) and a Person (identity/authorship facts),
// the page's breadcrumb trail, and — only when there is real visible content
// to back it — an FAQPage. Cross-references use { "@id": ... } rather than
// repeating whole entities inline.
export const doctorGraph = (doctor, origin, path, faqs = doctorFaq(doctor)) => {
  const url = `${origin}${path}`;
  const orgId = `${origin}/#organization`;

  const organization = {
    "@type": "MedicalOrganization",
    "@id": orgId,
    name: ORG_FULL,
    url: `${origin}/`,
  };

  const physician = {
    ...stripContext(doctorJsonLd(doctor, url)),
    "@id": `${url}#physician`,
    name: displayName(doctor),
    worksFor: { "@id": orgId },
  };

  const specialties = specialtyNames(doctor);
  const person = {
    "@type": "Person",
    "@id": `${url}#person`,
    name: displayName(doctor),
    url,
    ...(doctor?.image ? { image: doctor.image } : {}),
    jobTitle: doctorJobTitle(doctor),
    worksFor: { "@id": orgId },
    ...(specialties.length ? { knowsAbout: specialties } : {}),
  };

  const breadcrumb = {
    ...stripContext(breadcrumbJsonLd(doctor, origin, path)),
    "@id": `${url}#breadcrumb`,
  };

  const faqPage = faqs.length
    ? {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, physician, person, breadcrumb, faqPage].filter(Boolean),
  };
};
