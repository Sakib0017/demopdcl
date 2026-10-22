import {
  healthConsultation,
  healthDiagnosis,
  healthPackage,
  Amarlab,
  PureHealth,
  Arogga,
  Hajj,
  MRI,
  CT,
  BMD,
  ECG,
  Lithotripsy,
} from "../assets";
import {
  FaUserMd,
  FaFlask,
  FaXRay,
  FaFileMedicalAlt,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaTint,
  FaMicroscope,
  FaProcedures,
  FaWaveSquare,
  FaHeartbeat,
  FaHeart,
  FaMagnet,
} from "react-icons/fa";
import { GiStomach } from "react-icons/gi";

export const ourTechnologies = [
  {
    id: 1,
    name: "MRI",
    image: MRI,
  },
  {
    id: 2,
    name: "CT",
    image: CT,
  },
  {
    id: 3,
    name: "BMD",
    image: BMD,
  },
  {
    id: 4,
    name: "ECG",
    image: ECG,
  },
  {
    id: 5,
    name: "Lithotripsy",
    image: Lithotripsy,
  },
];

export const servicePartners = [
  {
    id: 1,
    name: "Arogga,",
    icon: Arogga,
  },
  {
    id: 2,
    name: "Amarlab",
    icon: Amarlab,
  },
  {
    id: 3,
    name: "Hajj",
    icon: Hajj,
  },
  {
    id: 4,
    name: "PureHealth",
    icon: PureHealth,
  },
];

export const healthPakage = [
  {
    id: 1,
    name: "Health Diagnosis – Diagnostic Tests & Laboratory Services",
    description:
      "At Popular Diagnostic Centre Ltd., we offer precise and prompt diagnostic services using state-of-the-art technology and expert medical insight. Our commitment is to provide accurate health evaluations that form the foundation of effective treatment.",
    tags: [
      {
        name: "Indhaka",
        color: "blue-text-gradient",
      },
      {
        name: "Outsidedhaka",
        color: "green-text-gradient",
      },
    ],
    video: healthDiagnosis,
    source_code_link: "http://populardiagnostic.com/",
    link: "/",
  },
  {
    id: 2,
    name: "Health Consultation – Specialist Doctor Consultations",
    description:
      "Popular Diagnostic Centre Ltd. offers expert health consultations tailored to your individual needs. Our experienced physicians provide clear, compassionate guidance, helping you make informed decisions about your health.",
    tags: [
      {
        name: "Indhaka",
        color: "blue-text-gradient",
      },
      {
        name: "Outsidedhaka",
        color: "green-text-gradient",
      },
    ],
    video: healthConsultation,
    source_code_link: "http://populardiagnostic.com/",
    link: "/our-doctors",
  },
  {
    id: 3,
    name: "Health Packages – Preventive Health Checkup Packages",
    description:
      "Discover a proactive approach to wellness with our specially designed health packages at Popular Diagnostic Centre Ltd. Each package is curated to offer comprehensive screenings for early detection and peace of mind.",
    tags: [
      {
        name: "Indhaka",
        color: "blue-text-gradient",
      },
      {
        name: "Outsidedhaka",
        color: "green-text-gradient",
      },
    ],
    video: healthPackage,
    source_code_link: "http://populardiagnostic.com/",
    link: "/health",
  },
];

export const whyChooseUs = [
  {
    id: 1,
    icon: FaUserMd,
    title: "Experienced Specialists",
    description:
      "Seek the advice of highly qualified specialist doctors in various medical fields for precise diagnosis, tailored treatment plans, and empathetic healthcare services throughout Bangladesh.",
  },
  {
    id: 2,
    icon: FaFlask,
    title: "Modern Laboratory",
    description:
      "Our modern pathology laboratory is equipped with the latest diagnostic technology and adheres to international quality standards, ensuring accurate blood tests, comprehensive lab investigations, and dependable medical reports.",
  },
  {
    id: 3,
    icon: FaXRay,
    title: "Advanced Medical Imaging",
    description:
      "State-of-the-art diagnostic imaging services including MRI, CT Scan, X-Ray, Ultrasound, Mammography, Lithotripsy, BMD, ECG and more, all performed with precision for accurate clinical diagnosis.",
  },
  {
    id: 4,
    icon: FaFileMedicalAlt,
    title: "Quick & Accurate Reporting",
    description:
      "Get fast, accurate, and reliable diagnostic reports from experienced medical professionals using advanced laboratory systems. Download your reports online anytime to support timely diagnosis and effective treatment decisions.",
  },
  {
    id: 5,
    icon: FaMapMarkerAlt,
    title: "Nationwide Branches",
    description:
      "Get trusted diagnostic tests, specialist consultations, health checkup packages and quality medical care at any of our 24+ conveniently located branches across Bangladesh.",
  },
  {
    id: 6,
    icon: FaCalendarCheck,
    title: "Appointment Scheduling Online",
    description:
      "Book diagnostic tests, health checkup packages and laboratory services online in just a few clicks for a faster, more convenient healthcare experience.",
  },
];

// `department` is the real lab taxonomy, not a label for decoration — it tells a
// visitor which part of the centre performs the test before they book it.
export const diagnosticServices = [
  { id: 1, icon: FaTint, name: "Blood Tests", department: "Laboratory" },
  { id: 2, icon: FaMicroscope, name: "Pathology", department: "Laboratory" },
  // FaXRay belongs to the X-Ray card, not MRI: it draws an x-ray plate. That
  // left X-Ray on FaBone, which renders as a dog bone. MRI takes FaMagnet
  // instead, which is what the machine actually is.
  { id: 3, icon: FaMagnet, name: "MRI", department: "Imaging" },
  { id: 4, icon: FaProcedures, name: "CT Scan", department: "Imaging" },
  { id: 5, icon: FaWaveSquare, name: "Ultrasound", department: "Imaging" },
  { id: 6, icon: FaXRay, name: "X-Ray", department: "Imaging" },
  { id: 7, icon: FaHeartbeat, name: "ECG", department: "Cardiac" },
  { id: 8, icon: FaHeart, name: "Echocardiogram", department: "Cardiac" },
  // Was FaSearchPlus, a plain zoom magnifier that said nothing about the
  // procedure. The stomach names what an upper GI endoscopy looks at, and it
  // is a solid glyph like the other eight.
  { id: 9, icon: GiStomach, name: "Endoscopy", department: "Endoscopy" },
];

// `slug` is what /our-doctors?specialty= matches against: DoctorSearch compares
// it to slugify(<name from /api/doctor-speciality>). The patient-facing label
// and the API's own wording differ for a third of these ("Dentistry" vs
// "Dentist", "Ophthalmology" vs "Eye / Ophthalmology"), so the slug is written
// out per speciality rather than derived from the label — deriving it left those
// chips landing on an unfiltered doctor list. Verified against the live
// speciality list; recheck a slug here if a chip stops filtering.
export const medicalSpecialities = [
  { name: "Cardiology", slug: "cardiology" },
  { name: "Medicine", slug: "medicine" },
  { name: "Child / Paediatrics", slug: "child-paediatrics" },
  { name: "Gynaecology & Obstetrics", slug: "gynaecology" },
  { name: "Dermatology (Skin, Hair & Cosmetic)", slug: "dermatology" },
  { name: "Neurology", slug: "neurology" },
  { name: "ENT", slug: "ent" },
  { name: "Gastroenterology", slug: "gastroenterology" },
  { name: "Orthopedics", slug: "orthopedics" },
  { name: "Endocrinology & Diabetology", slug: "endocrinology" },
  { name: "Nephrology (Kidney Medicine)", slug: "nephrology" },
  { name: "Ophthalmology", slug: "eye-ophthalmology" },
  { name: "Chest Medicine", slug: "chest-medicine" },
  { name: "Urology", slug: "urology-surgery" },
  { name: "Dentistry", slug: "dentist" },
  { name: "Oncology (Cancer Care)", slug: "oncology-cancer" },
  {
    name: "Physical Medicine & Rehabilitation (Physiotherapy)",
    slug: "physical-medicine-rehabilitation",
  },
  { name: "General Surgery", slug: "general-surgery" },
  { name: "Psychiatry", slug: "psychiatry" },
  { name: "Nutrition & Dietetics", slug: "nutritionist" },
  { name: "Rheumatology", slug: "rheumatology-medicine" },
  { name: "Liver Medicine (Hepatology)", slug: "liver-medicine" },
  { name: "Haematology", slug: "haematology" },
  { name: "Pain Management", slug: "pain-management" },
];