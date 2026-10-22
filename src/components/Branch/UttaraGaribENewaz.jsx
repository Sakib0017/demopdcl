import React from "react";
import "@fontsource/ubuntu";
import { motion } from "framer-motion";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";

const UnitCard = ({ unit }) => {
  return (
    <div className="sm:w-[399px] w-full p-4 shadow-2xl rounded-2xl">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <img
          src={unit.image}
          alt={`Branch ${unit.BranchUnit}`}
          className="w-full shadow-xl rounded-3xl object-cover p-2 object-center"
        />
        <div className="p-4">
          <h2 className="title-font text-2xl font-medium text-center text-gray-900 mb-3">
            {unit.name}
          </h2>
          <p className="leading-relaxed text-gray-800 mb-3">
            <span className=" font-medium">Address:</span> {unit.address}
          </p>
          <div className=" bg-slate-100 justify-center border-dashed border-2  rounded-lg">
            <iframe
              src={unit.location}
              className="p-2 w-full h-5/6 object-cover rounded-3xl"
              allowfullscreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <h1 className="text-center font-medium rounded-md p-2 font-ubuntu text-[18px] text-black shadow-xl">
              Location On Map 🗺️📌
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

const UttaraGaribENewaz = () => {
  const branchInfo = branch.find((b) => b.heading === "Uttara Garib E Newaz");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 35;
  return (
    <section className="relative py-32 lg:py-36 bg-white">
      <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col lg:flex-row gap-10 lg:gap-12 pb-20">
        <div className="absolute w-full lg:w-1/2 inset-y-0 lg:right-0 hidden lg:block">
          <span className="absolute -left-6 md:left-4 top-24 lg:top-28 w-24 h-24 rotate-90 skew-x-12 rounded-3xl bg-[#00984a] blur-xl opacity-60 lg:opacity-95 lg:block hidden"></span>
          <span className="absolute right-4 top-96 w-24 h-24 rounded-3xl bg-blue-600 blur-xl opacity-80"></span>
        </div>
        <span className="w-4/12 lg:w-2/12 aspect-square bg-gradient-to-tr from-blue-600 to-[#00984a] absolute -top-5 lg:left-0 rounded-full skew-y-12 blur-2xl opacity-40 skew-x-12 rotate-90"></span>
        <div
          className="relative flex flex-col items-center text-center lg:text-left lg:py-7 xl:py-8 
            lg:items-start lg:max-w-none max-w-3xl mx-auto lg:mx-0 lg:flex-1 lg:w-1/2">
          <h1
            className="text-3xl leading-tight sm:text-4xl md:text-5xl xl:text-6xl
            font-bold text-[#00664a]">
            Popular Diagnostic Centre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00664a]  from-20% via-[#00984a] via-30% to-blue-600">
              Uttara Sector 13{" "}
            </span>
            Branch.
          </h1>
          <div className="mt-10  w-full flex max-w-md mx-auto lg:mx-0"></div>
        </div>
        <div className="flex flex-1 relative mx-auto ">
          <video
            className="lg:absolute lg:w-full rounded-3xl object-cover shadow-2xl "
            alt="Hero Video"
            src={video}
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
      </div>
      <div className="relative md:mt-[250px] mb-[100px]">
        <SearchBoxBranch
          branchId={branchId}
          branchForDoctor={branchForDoctor}
        />
      </div>
      <div className="relative">
        <div className="bg-gradient-to-bl from-transparent from-80% via-[#00984a] via-30% to-[#00664a] mt-12 mx-auto lg:max-w-7xl w-full flex flex-col lg:flex-row justify-evenly rounded-3xl items-end">
          <img
            src={branchInfo.braManImg}
            alt="Md. Jahurul Islam Rony"
            className="relative mx-auto h-full w-auto border-[6px] border-[#00984a] rounded-3xl"
          />
          <div className="flex lg:item-start">
            <h1 className="text-gray-500/30 text-center absolute font-bold text-[96px] -mt-10 ml-5 lg:-mt-20 lg:-ml-48 overflow-hidden">
              Branch{" "}
              <h1 className="text-gray-500/20 ml-10 -mt-16 lg:-mt-14 text-[72px] lg:ml-48">
                Manager
              </h1>
            </h1>
            <div className="relative mt-24 p-5">
              <h1 className="text-gray-600 font-bold text-[36px]">
                {branchInfo.braManName}
              </h1>
              <h1 className="text-gray-500 font-bold text-[18px]">
                {branchInfo.braManDesignation}
              </h1>
              <p className="text-black w-full">
                {" "}
                <br />
                বাংলাদেশের স্বাস্থ্যসেবার পথপ্রদর্শক পপুলার ডায়াগনস্টিক সেন্টার
                বিশ্বের সর্বাধুনিক যন্ত্রপাতি, দক্ষ টেকনিশিয়ান এবং সুনামধন্য
                বিশেষজ্ঞ চিকিৎসকবৃন্দের সমন্বয়ে স্বাস্থ্যসেবা প্রদান করে আসছে।
                তারই ধারাবাহিকতায়, পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড এখন
                উত্তরার প্রাণকেন্দ্র উত্তরা সেক্টর-১৩ তে।
              </p>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-gray-900/50 pt-20 text-center text-[28px] font-bold font-ubuntu">
        Units in {branchInfo.heading}
      </h2>
      <div className="px-5 py-6">
        <div className="flex mx-auto flex-wrap max-w-7xl justify-center gap-4">
          {branchInfo.branchUnits.map((unit) => (
            <UnitCard key={unit.unitID} unit={unit} />
          ))}
        </div>
      </div>
      <motion.div
        className="flex justify-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <motion.a
          href="https://www.facebook.com/populargaribenewaz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <motion.svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </motion.svg>
          <span className="group-hover:tracking-wide transition-all duration-300">
            Visit Our Facebook Page
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default UttaraGaribENewaz;
