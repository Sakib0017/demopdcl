import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaQuoteLeft, FaClinicMedical } from "react-icons/fa";
import { MdMedicalServices, MdOutlineHealthAndSafety } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import "@fontsource/ubuntu";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";

const UnitCard = ({ unit }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="sm:w-[399px] w-full p-4 shadow-2xl rounded-2xl bg-white">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <img
          src={unit.image}
          alt={`Branch ${unit.BranchUnit}`}
          className="w-full shadow-xl rounded-3xl object-cover p-2 object-center"
        />
        <div className="p-4">
          <h2 className="title-font text-2xl font-medium text-center text-gray-900 mb-3 flex items-center justify-center gap-2">
            <FaClinicMedical className="text-[#00984a]" />
            {unit.name}
          </h2>
          <p className="leading-relaxed text-gray-800 mb-3 flex items-start gap-2">
            <FaMapMarkerAlt className="text-[#00664a] mt-1 flex-shrink-0" />
            <span>
              <span className="font-medium">Address:</span> {unit.address}
            </span>
          </p>
          <div className="bg-slate-100 justify-center border-dashed border-2 border-[#00664a]/30 rounded-lg">
            <iframe
              src={unit.location}
              className="p-2 w-full h-5/6 object-cover rounded-3xl"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <h1 className="text-center font-medium rounded-md p-2 font-ubuntu text-[18px] text-black shadow-xl">
              Location On Map 🗺️📌
            </h1>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Shantinagar = () => {
  const branchInfo = branch.find((b) => b.heading === "Shantinagar");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 3;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative py-32 lg:py-36 bg-white overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#00984a]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -right-20 bottom-1/3 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-1/2 top-1/4 w-48 h-48 bg-[#00664a]/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col lg:flex-row gap-10 lg:gap-12 pb-20 relative z-10">
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center text-center lg:text-left lg:py-7 xl:py-8 
            lg:items-start lg:max-w-none max-w-3xl mx-auto lg:mx-0 lg:flex-1 lg:w-1/2">
          <h1
            className="text-3xl leading-tight sm:text-4xl md:text-5xl xl:text-6xl
            font-bold text-[#00664a]">
            Popular Diagnostic Centre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00664a] from-20% via-[#00984a] via-30% to-blue-600">
              {branchName}{" "}
            </span>
            Branch.
          </h1>
          <div className="mt-10 w-full flex max-w-md mx-auto lg:mx-0"></div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-1 relative mx-auto">
          <video
            className="lg:absolute lg:w-full rounded-3xl object-cover shadow-2xl border-4 border-white/20"
            alt="Hero Video"
            src={video}
            loop
            muted
            playsInline
            preload="metadata"
          />
        </motion.div>
      </div>

      <div className="relative md:mt-[250px] mb-[100px] z-10">
        <SearchBoxBranch
          branchId={branchId}
          branchForDoctor={branchForDoctor}
        />
      </div>

      <motion.div variants={itemVariants} className="relative z-10 m-4">
        <div className="bg-gradient-to-bl from-white from-10% via-white via-30% to-[#00984a]/20 mt-12 mx-auto lg:max-w-7xl w-full flex flex-col lg:flex-row justify-evenly rounded-3xl items-start border border-[#00664a]/10 shadow-xl backdrop-blur-sm">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            src={branchInfo.braManImg}
            alt="Md. Shahi Mahmud"
            className="relative mx-auto h-full w-auto border-[6px] border-[#00984a] rounded-3xl shadow-2xl mt-16 lg:mt-20"
          />

          <div className="flex lg:item-start relative w-full">
            <div className="absolute -top-10 left-0 right-0 text-center">
              <h1 className="text-gray-500/30 text-center -ml-10 lg:-ml-96 mt-4 font-bold text-[70px] lg:text-[120px] tracking-wider overflow-hidden select-none">
                Head of
              </h1>
              <h1 className="text-gray-500/20 text-center ml-28 lg:ml-40 -mt-10 lg:-mt-20 font-bold text-[50px] lg:text-[100px] tracking-wider overflow-hidden select-none">
                Branch
              </h1>
            </div>

            <div className="relative mt-24 p-5 lg:p-8 w-full">
              <div className="flex items-center gap-4 mb-6">
                <MdOutlineHealthAndSafety className="text-4xl text-[#00664a]" />
                <div>
                  <h1 className="text-gray-600 font-bold text-[36px]">
                    {branchInfo.braManName}
                  </h1>
                  <h1 className="text-gray-500 font-bold text-[18px]">
                    {branchInfo.braManDesignation}
                  </h1>
                </div>
              </div>

              <div className="relative bg-white/80 p-6 rounded-xl shadow-inner border border-[#00984a]/20">
                <FaQuoteLeft className="absolute -top-3 -left-3 text-4xl text-[#00664a]/20" />
                <p className="text-gray-700 leading-relaxed text-justify">
                  <div className="my-4 font-medium">
                    Bismillahir Rahmanir Raheem, <br /> Assalamu Alaikum.
                  </div>
                  Since its establishment in Dhaka in 1983, Popular Diagnostic
                  Centre Ltd. has been the leading contributor to Bangladesh's
                  healthcare sector. True to this legacy, the Shantinagar Branch
                  was inaugurated 25 years ago in the heart of Dhaka City, with
                  a mission to bring world-class healthcare closer to the
                  people. Over the years, the Shantinagar Branch has earned the
                  trust of countless patients by delivering exceptional
                  diagnostic and healthcare services through cutting-edge
                  technology, renowned doctors, and a dedicated team. Responding
                  to the growing demand, we are proud to announce the launch of
                  our 3rd Unit (Bhaban-3), a 1 lakh square feet facility
                  featuring:
                  <ul className="list-disc pl-5 mt-3 space-y-1">
                    <li>
                      <span className="font-medium">90-car parking space</span>{" "}
                      for hassle-free visits
                    </li>
                    <li>
                      <span className="font-medium">
                        3 Tesla MRI (GE Signa Hero)
                      </span>{" "}
                      for ultra-precise imaging
                    </li>
                    <li>
                      <span className="font-medium">
                        500-slice Ultra-modern GE Revolution Maxima CT-Scan
                      </span>
                    </li>
                    <li>
                      <span className="font-medium">
                        Latest Siemens Digital Mammography
                      </span>{" "}
                      and all types of imaging
                    </li>
                    <li>
                      <span className="font-medium">
                        Fully Automated Modern Lab (TLA - Total Laboratory
                        Automation)
                      </span>
                    </li>
                    <li>
                      <span className="font-medium">
                        Highly skilled professionals
                      </span>{" "}
                      from Bangladesh and abroad
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-[#00984a]/5 rounded-lg border-l-4 border-[#00984a]">
                    Our team is driven by sincerity, compassion, and an
                    unwavering commitment to service, ensuring every patient
                    receives the highest standard of care. We continuously
                    strive to enhance our services based on valuable feedback
                    from patients and their families.
                  </div>
                  <div className="mt-4 font-medium italic text-[#00984a]">
                    *Our Pledge:* "Patient Satisfaction is our Motto, Service is
                    our Passion."
                  </div>
                  <div className="mt-4">
                    With patience and dedication, we work tirelessly to
                    alleviate suffering and bring peace of mind to our patients.
                    May Almighty Allah guide and bless our efforts.
                  </div>
                  <div className="mt-10 font-medium text-right">
                    Best Regards, <br />
                    <div className="font-bold">Md. Shahi Mahmud</div>
                    DGM & Head of Branch, Shantinagar, Dhaka <br />
                    <div className=" text-[#00664a]">
                      Popular Diagnostic Centre Ltd. <br />
                      <span className="font-light text-sm italic text-[#00664a]">
                        {" "}
                        -Where care meets commitment.
                      </span>
                    </div>{" "}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="px-5 py-16 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#00664a] text-center text-4xl font-bold font-ubuntu relative inline-block">
            <GiHealthNormal className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-3xl text-[#00984a]" />
            Units in {branchInfo.heading}
            <MdMedicalServices className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-3xl text-[#00984a]" />
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00664a] to-[#00984a] mx-auto mt-4 rounded-full"></div>
        </div>

        <motion.div
          className="flex mx-auto flex-wrap max-w-7xl justify-center gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}>
          {branchInfo.branchUnits.map((unit) => (
            <motion.div
              key={unit.unitID}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}>
              <UnitCard unit={unit} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Shantinagar;
