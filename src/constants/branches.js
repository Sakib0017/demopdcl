// Branch-related image imports
import {
  Badda,
  Barishal,
  BoguraU1,
  BoguraU2,
  BoguraU3,
  Chattogram,
  Dhanmondi,
  Dinajpur,
  EnglishRoad,
  Gazipur,
  Jatrabari,
  Khulna,
  Kushtia,
  MirpurU1,
  MirpurU2,
  Mymensingh,
  Narayangonj,
  Noakhali,
  Rajshahi,
  RangpurU1,
  RangpurU2,
  Savar,
  ShantinagarU1,
  ShantinaagarUnit1,
  ShantinagarU2,
  ShyamoliU1,
  ShyamoliU2,
  UttaraGaribENewaz,
  UttaraU1,
  UttaraU2,
  UttaraU3,
  ShantinagarU3,
} from "../assets";

// Manager image imports
import {
  AchintoKumarNag,
  AjoyKumarDatta,
  MdSirazulKabir,
  MdFoyzurRahman,
  MdJahurulIslamRony,
  MdMahbuburRahmanChowdhury,
  MdMizanurRahmanBiswas,
  MdMosharrofHossain,
  MdShahidulIslam,
  MdShahiMahmud,
  MrAbdullahAlMahmud,
  MrFaridMohammadShamim,
  MrFirozMia,
  MrMdAbdulAhad,
  MrMuhammadReazHossain,
  MrNezamulHaqueRipon,
  MrNurIslam,
  MrOalyAshrafKhan,
  MrRajuAhmmedKhalek,
  MrRezwanAhmed,
  MrZohurulIslam,
  ShamsuzzohaKhanJohn,
} from "../assets";

const reportDownload = [
  {
    braID: 2,
    braName: "Dhanmondi",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 12,
    braName: "English Road",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 9,
    braName: "Shantinagar",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 9,
    braName: "Shyamoli",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=706:3:13078707145556:::::",
    braCity: "Dhaka",
  },
  {
    braID: 13,
    braName: "Mirpur",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 3,
    braName: "Badda",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 7,
    braName: "Uttara Sector 04",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=707:3:16081085007203:::::",
    braCity: "Dhaka",
  },
  {
    braID: 39,
    braName: "Uttara Sector 13",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=709:3:26943732129529:::::",
    braCity: "Dhaka",
  },
  {
    braID: 19,
    braName: "Jatrabari",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 16,
    braName: "Savar",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 8,
    braName: "Gazipur",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 11,
    braName: "Narayangonj",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Dhaka",
  },
  {
    braID: 12,
    braName: "Bogura",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=708:3:6485788705866:::::",
    braCity: "Bogura",
  },
  {
    braID: 18,
    braName: "Rajshahi",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Rajshahi",
  },
  {
    braID: 5,
    braName: "Noakhali",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Noakhali",
  },
  {
    braID: 15,
    braName: "Chattogram",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Chattogram",
  },
  {
    braID: 10,
    braName: "Mymensingh",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Mymensingh",
  },
  {
    braID: 15,
    braName: "Rangpur",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=711:3:3739606336319:::::",
    braCity: "Rangpur",
  },
  {
    braID: 19,
    braName: "Dinajpur",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=710:3:3614899581560:::::",
    braCity: "Dinajpur",
  },
  {
    braID: 14,
    braName: "Khulna",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Khulna",
  },
  {
    braID: 4,
    braName: "Kushtia",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Kushtia",
  },
  {
    braID: 6,
    braName: "Barishal",
    downloadLink: "https://report.populardiagnostic.com/",
    braCity: "Barishal",
  },
  {
    braID: 32,
    braName: "Tangail",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=780:3:1469279010548:::::",
    braCity: "Tangail",
  },
  {
    braID: 33,
    braName: "Comilla",
    downloadLink:
      "http://reports.populardiagnostic.com:8877/ords/f?p=781:3:9820756140585:::::",
    braCity: "Comilla",
  },
];

const branch = [
  {
    branchID: 1,
    heading: "Dhanmondi",
    image: Dhanmondi,
    Hotline: "09666787801 ",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2197080792394!2d90.37959757619976!3d23.73954337867781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ca7af5f82b%3A0xce7d1ab6b16a027!2sPopular%20Diagnostic%20Centre%20Ltd.!5e0!3m2!1sen!2sbd!4v1706512680599!5m2!1sen!2sbd",

    braManImg: AchintoKumarNag,
    braManName: "Achinto Kumar Nag",
    braManDesignation: "DGM (HR & Admin)",
    name: "Popular Diagnostic Centre Ltd. (Dhanmondi)",
    address: "House # 16, Road # 2, Dhanmondi, Dhaka1205",
  },
  {
    branchID: 2,
    heading: "English Road",
    image: EnglishRoad,
    Hotline: "09666787802",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.713776,90.4109699&hl=es;z=14&output=embed",
    braManImg: MdMahbuburRahmanChowdhury,
    braManName: "Md. Mahbubur Rahman Chowdhury",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (English road)",
    address: "House # 2, English Road, Dhaka.",
  },
  {
    branchID: 3,
    heading: "Shantinagar",
    image: ShantinaagarUnit1,
    Hotline: "09666787803",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    braManImg: MdShahiMahmud,
    braManName: "Md. Shahi Mahmud",
    braManDesignation: "DGM & Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Shantinagar)",
    address: "House # 11, Shantinagar , Motijheel, Dhaka.",
    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: ShantinaagarUnit1,
        location:
          "https://maps.google.com/maps?q=23.7412031,90.4124384&hl=es;z=14&output=embed",
        name: "Shantinagar (U-1)",
        address: "House # 11, Shantinagar , Motijheel, Dhaka.",
      },
      {
        unitID: 2,
        BranchUnit: "U2",
        image: ShantinagarU2,
        location:
          "https://maps.google.com/maps?q=23.7412031,90.4124384&hl=es;z=14&output=embed",
        name: "Shantinagar (U-2)",
        address: "Building#15, Shantinagar, Motijheel, Dhaka.",
      },
      {
        unitID: 3,
        BranchUnit: "U3",
        image: ShantinagarU3,
        location:
          "https://maps.google.com/maps?q=23.7412031,90.4124384&hl=es;z=14&output=embed",
        name: "Shantinagar (U-3)",
        address: "House-170, Shantinagar, Dhaka-1217.",
      },
    ],
  },
  {
    branchID: 9,
    heading: "Shyamoli",
    image: ShyamoliU1,
    Hotline: "09666787806",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    braManImg: MrNezamulHaqueRipon,
    braManName: "Mr. Nezamul Haque Ripon",
    braManDesignation: "AGM & Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Shyamoli)",
    address:
      "22/7 A S M Nuruzzaman Road, Block-B, Babor Road, Mohammadpur, Dhaka-1207.",

    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: ShyamoliU1,
        location:
          "https://maps.google.com/maps?q=23.7718253,90.3674465&hl=es;z=14&output=embed",
        name: "Shyamoli (U-1)",
        address:
          "22/7 A S M Nuruzzaman Road, Block-B, Babor Road, Mohammadpur, Dhaka-1207.",
      },
      {
        unitID: 2,
        BranchUnit: "U2",
        image: ShyamoliU2,
        location:
          "https://maps.google.com/maps?q=23.76892267744971,90.36856338476504&hl=es;z=14&output=embed",
        name: "Shyamoli (U-2)",
        address:
          "House: 1/5, Block- B, Mohammadpur Housing State, Gajnabi Road, Mohammadpur",
      },
    ],
  },

  {
    branchID: 10,
    heading: "Mirpur",
    image: MirpurU1,
    Hotline: "09666787807",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    braManImg: MrAbdullahAlMahmud,
    braManName: "Abdullah Al Mahmud",
    braManDesignation: "AGM & Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Mirpur)",
    address:
      "House # 67, Avenue # 5, Block # C, Section-6 Mirpur, (Original-10),Pallabi, Dhaka.",
    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: MirpurU1,
        location:
          "https://maps.google.com/maps?q=23.8106471,90.3673446&hl=es;z=14&output=embed",
        name: "Mirpur (U-1)",
        address:
          "House # 67, Avenue # 5, Block # C, Section-6 Mirpur, (Original-10),Pallabi, Dhaka.",
      },
      {
        unitID: 2,
        BranchUnit: "U2",
        image: MirpurU2,
        location:
          "https://maps.google.com/maps?q=24.7433735,90.4059255&hl=es;z=14&output=embed",
        name: "Mirpur (U-2)",
        address:
          "House # 02, Avenue # 01, Block # A, Section-10(Bnaroshi Polli Gate-01), Pallabi, Mirpur, Dhaka.",
      },
    ],
  },
  {
    branchID: 7,
    heading: "Uttara",
    image: UttaraU1,
    Hotline: "09666787805",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    braManImg: MrZohurulIslam,
    braManName: "Mr. Zohurul Islam",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Uttara)",
    address:
      "House # 21, Road # 7, Sector # 4, Jashim Uddin More, Uttara, Dhaka-1230",
    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: UttaraU1,
        location:
          "https://maps.google.com/maps?q=23.8610668,90.40031&hl=es;z=14&output=embed",

        name: "Uttara (U-1)",
        address:
          "House # 23, Road # 7, Sector # 4, Jashim Uddin More, Uttara, Dhaka-1230",
      },

      {
        unitID: 2,
        BranchUnit: "U2",
        image: UttaraU2,
        location:
          "https://maps.google.com/maps?q=23.8613902,90.4007901&hl=es;z=14&output=embed",
        name: "Uttara (U-2)",
        address:
          "House # 21, Road # 7, Sector # 4, Jashim Uddin More, Uttara, Dhaka-1230",
      },
      {
        unitID: 3,
        BranchUnit: "U3",
        image: UttaraU3,
        location:
          "https://maps.google.com/maps?q=23.8610668,90.40031&hl=es;z=14&output=embed",
        name: "Uttara (U-3)",
        address:
          "House # 25, Road # 7, Sector # 4, Jashim Uddin More, Uttara, Dhaka-1230",
      },
    ],
  },
  {
    branchID: 39,
    heading: "Uttara Garib E Newaz",
    image: UttaraGaribENewaz,
    Hotline: "09666787823",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
    "https://maps.google.com/maps?q=23.872516,90.3906607&hl=es;z=14&output=embed",
      

    braManImg: MdJahurulIslamRony,
    braManName: " Md. Jahurul Islam Rony",
    braManDesignation: "Branch In-Charge",
    name: "Popular Diagnostic Centre Ltd. (Uttara Garib-E-Newaz)",
    address:
      "House #41, Uttara-Garib-E-Newaz Avenue, Sector # 13, Uttara, Dhaka",
      branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: UttaraGaribENewaz,
        location:
          "https://maps.google.com/maps?q=23.872516,90.3906607&hl=es;z=14&output=embed",

        name: "Uttara (U-1)",
        address:
          "House #41, Uttara-Garib-E-Newaz Avenue, Sector # 13, Uttara, Dhaka",
      }
    ]
  },
  {
    branchID: 18,
    heading: "Badda",
    image: Badda,
    Hotline: "09666787809",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.7885462,90.4250215&hl=es;z=14&output=embed",

    braManImg: MrFirozMia,
    braManName: "Mr. Firoz Mia",
    braManDesignation: "Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Badda)",
    address: "Cha-90/2, North Badda (Pragoti Sharoni), Dhaka-1212.",
  },
  {
    branchID: 37,
    heading: "Jatrabari",
    image: Jatrabari,
    Hotline: "09666787822",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.709443131735878,90.43211759426138&hl=es;z=14&output=embed",
    braManImg: MdMizanurRahmanBiswas,
    braManName: " Md. Mizanur Rahman Biswas",
    braManDesignation: "Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Jatrabari)",
    address: "33,Shahid Faruk sarak, North jatrabari, Dhaka-1204",
  },
  {
    branchID: 6,
    heading: "Savar",
    image: Savar,
    Hotline: "09666787808",
    Email: "info@populardiagnostic.com",
    name: "Popular Diagnostic Centre Ltd. (Savar)",
    address: "E/22, Talbagh, Anandapur, Savar, Dhaka.",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.839972,90.257242&hl=es;z=14&output=embed",
    braManImg: MrRajuAhmmedKhalek,
    braManName: " Mr. Raju Ahmmed Khalek",
    braManDesignation: "Branch Manager",
  },
  {
    branchID: 27,
    heading: "Gazipur",
    image: Gazipur,
    Hotline: "09666787816",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.9969328,90.4148069&hl=es;z=14&output=embed",

    braManImg: AjoyKumarDatta,
    braManName: "Ajoy Kumar Datta",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Gazipur)",
    address:
      "Gazipur Shibbari More (Near VIP Bus Terminal and Walton Show Room)",
  },
  {
    branchID: 5,
    heading: "Narayangonj",
    image: Narayangonj,
    Hotline: "09666787804",
    Email: "info@populardiagnostic.com",
    braCity: "Dhaka",
    location:
      "https://maps.google.com/maps?q=23.6223054,90.5004152&hl=es;z=14&output=embed",

    braManImg: MdShahidulIslam,
    braManName: "Md. Shahidul Islam Swapon",
    braManDesignation: "DGM & Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Narayangonj)",
    address: "231/4, Bangabandhu Road, Balur Math, Chashara, Narayangonj.",
  },

  {
    branchID: 12,
    heading: "Bogura",
    image: BoguraU1,
    Hotline: "09666787812",
    Email: "info@populardiagnostic.com",
    braCity: "Bogura",
    braManImg: MrRezwanAhmed,
    braManName: "Rezwan Ahmed",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Bogura)",
    address: "H # 12/305, Thanthania Bus-Stand Sherpur Road, Bogura.",
    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: BoguraU1,
        location:
          "https://maps.google.com/maps?q=24.8321186,89.3762719&hl=es;z=14&output=embed",
        name: "Bogura (U-1)",
        address: "H # 12/305, Thanthania Bus-Stand Sherpur Road, Bogura.",
      },
      {
        unitID: 2,
        BranchUnit: "U2",
        image: BoguraU2,
        location:
          "https://maps.google.com/maps?q=24.8321186,89.3762719&hl=es;z=14&output=embed",
        name: "Bogura (U-2)",
        address: "H # 12/310, Thanthania Bus-Stand Sherpur Road, Bogura.",
      },
      {
        unitID: 3,
        BranchUnit: "U3",
        image: BoguraU3,
        location:
          "https://maps.google.com/maps?q=24.8280095,89.3527289&hl=es;z=14&output=embed",
        name: "Bogura (U-3)",
        address: "H # 14/1979, Rahman Market, Silimpur, Bogra.",
      },
    ],
  },

  {
    branchID: 42,
    heading: "Rajshahi",
    image: Rajshahi,
    Hotline: "09666787811",
    Email: "info@populardiagnostic.com",
    braCity: "Rajshahi",
    location:
      "https://maps.google.com/maps?q=24.3723311,88.5811372&hl=es;z=14&output=embed",

    braManImg: MrFaridMohammadShamim,
    braManName: "Mr. Farid Mohammad Shamim",
    braManDesignation: "AGM & Head of Branch",
    name: "Popular Diagnostic Centre Ltd. (Rajshahi)",
    address: "House # 474, Chowdhury Tower, Laxmipur, Rajshahi.",
  },
  {
    branchID: 29,
    heading: "Noakhali",
    image: Noakhali,
    Hotline: "09666787818",
    Email: "info@populardiagnostic.com",
    braCity: "Noakhali",
    location:
      "https://maps.google.com/maps?q=22.875063,91.097225&hl=es;z=14&output=embed",

    braManImg: MrMuhammadReazHossain,
    braManName: "Mr. Kazi Md. Reaz Hossain",
    braManDesignation: "Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Noakhali)",
    address:
      "House #1222, New Bus stand (Near Shaheed Bhulu Stadium) Maijdee Court, Noakhali.",
  },
  {
    branchID: 16,
    heading: "Chattogram",
    image: Chattogram,
    Hotline: "09666787810",
    Email: "info@populardiagnostic.com",
    braCity: "Chattogram",
    location:
      "https://maps.google.com/maps?q=22.360777,91.831786&hl=es;z=14&output=embed",

    braManImg: MrOalyAshrafKhan,
    braManName: "Mr. Oaly Ashraf Khan",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Chattogram)",
    address: "20/B. K. B. Fazlul Kader Road, Panchlaish, Chattogram.",
  },
  {
    branchID: 26,
    heading: "Mymensingh",
    image: Mymensingh,
    Hotline: "09666787814",
    Email: "info@populardiagnostic.com",
    braCity: "Mymensingh",
    location:
      "https://maps.google.com/maps?q=24.744623,90.408583&hl=es;z=14&output=embed",

    braManImg: MrNurIslam,
    braManName: "Mr. Nur Islam",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Mymensingh)",
    address:
      "252/1, Charpara Road (Opposite of Mymensingh Medical College & Hospital), Mymensingh.",
  },

  {
    branchID: 15,
    heading: "Rangpur",
    image: RangpurU1,
    Hotline: "09666787813",
    Email: "info@populardiagnostic.com",
    braCity: "Rangpur",
    braManImg: MrMdAbdulAhad,
    braManName: "Mr. Md. Abdul Ahad",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Rangpur)",
    address: "77/1, Road No-1, Dhap, Jail Road, Rangpur.",
    branchUnits: [
      {
        unitID: 1,
        BranchUnit: "U1",
        image: RangpurU1,
        location:
          "https://maps.google.com/maps?q=25.7610566,89.2348999&hl=es;z=14&output=embed",
        name: "Rangpur (U-1)",
        address: "77/1, Road No-1, Dhap, Jail Road, Rangpur.",
      },
      {
        unitID: 2,
        BranchUnit: "U2",
        image: RangpurU2,
        location:
          "https://maps.google.com/maps?q=25.7610566,89.2348999&hl=es;z=14&output=embed",
        name: "Rangpur (U-2)",
        address: "77/1, Road No-1, Dhap, Jail Road, Rangpur.",
      },
    ],
  },
  {
    branchID: 19,
    heading: "Dinajpur",
    image: Dinajpur,
    Hotline: "09666787815",
    Email: "info@populardiagnostic.com",
    braCity: "Dinajpur",
    location:
      "https://maps.google.com/maps?q=25.6199955,88.6449272&hl=es;z=14&output=embed",

    braManImg: MdFoyzurRahman,
    braManName: "Md. Foyzur Rahman",
    braManDesignation: "Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Dinajpur)",
    address: "House #44, 1 No. Upashahar, Fulbari Bus stand, Dinajpur.",
  },
  {
    branchID: 36,
    heading: "Khulna",
    image: Khulna,
    Hotline: "09666787821",
    Email: "info@populardiagnostic.com",
    braCity: "Khulna",
    location:
      "https://maps.google.com/maps?q=22.815210,89.555067&hl=es;z=14&output=embed",

    braManImg: MdSirazulKabir,
    braManName: "Md. Sirazul Kabir",
    braManDesignation: "Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Khulna)",
    address:
      "Popular  Diagnostic  Centre Ltd. Khulna Branch, 37 KDA Avenue, Khulna.",
  },
  {
    branchID: 30,
    heading: "Kushtia",
    image: Kushtia,
    Hotline: "09666787817",
    Email: "info@populardiagnostic.com",
    braCity: "Kushtia",
    location:
      "https://maps.google.com/maps?q=23.903603,89.127746&hl=es;z=14&output=embed",

    braManImg: ShamsuzzohaKhanJohn,
    braManName: "Shamsuzzoha Khan John",
    braManDesignation: "Branch In Charge",
    name: "Popular Diagnostic Centre Ltd. (Kushtia)",
    address:
      "City Tower - House No.1, Mir Mosharraf Hossain Road, Coart Para, Kushtia",
  },
  {
    branchID: 31,
    heading: "Barishal",
    image: Barishal,
    Hotline: "09666787819",
    Email: "info@populardiagnostic.com",
    braCity: "Barishal",
    location:
      "https://maps.google.com/maps?q=22.692741,90.361966&hl=es;z=14&output=embed",
    braManImg: MdMosharrofHossain,
    braManName: "Md. Mosharrof Hossain",
    braManDesignation: "Senior Branch Manager",
    name: "Popular Diagnostic Centre Ltd. (Barishal)",
    address:
      "109, 955 Shahid Nazrul Islam Sarak, South Alekanda Banglabazar, Barishal.",
  },
  {
    branchID: 55,
    heading: "Tangail",
    image: Dhanmondi,
    Hotline: "09666787824 ",
    Email: "info@populardiagnostic.com",
    braCity: "Tangail",
    location:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2197080792394!2d90.37959757619976!3d23.73954337867781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ca7af5f82b%3A0xce7d1ab6b16a027!2sPopular%20Diagnostic%20Centre%20Ltd.!5e0!3m2!1sen!2sbd!4v1706512680599!5m2!1sen!2sbd",

    braManImg: AchintoKumarNag,
    braManName: "Achinto Kumar Nag",
    braManDesignation: "DGM (HR & Admin)",
    name: "Popular Diagnostic Centre Ltd. (Tangail)",
    address: "Akota Tower, Mymensingh Road, Sabalia Tangail",
  },
  {
    branchID: 56,
    heading: "Comilla",
    Hotline: "09666787825",
    Email: "info@populardiagnostic.com",
    braCity: "Comilla",
    name: "Popular Diagnostic Centre Ltd. (Comilla)",
  },
];

export { branch, reportDownload };