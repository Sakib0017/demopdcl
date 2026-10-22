import React from "react";
import "@fontsource/ubuntu";
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

const Mirpur = () => {
  const branchInfo = branch.find((b) => b.heading === "Mirpur");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 10;
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
              {branchInfo.heading}{" "}
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
        <div className="mt-12 mx-auto lg:max-w-7xl w-full flex flex-col lg:flex-row justify-evenly rounded-3xl items-end">
          <img
            src={branchInfo.braManImg}
            alt="Mr. Abdullah Al Mahmud"
            className="relative my-auto mx-auto h-full w-auto border-[6px] border-[#00984a] rounded-3xl"
          />
          <div className="flex lg:item-start">
            <div className="relative mt-24 p-5">
              <h1 className="text-gray-600 font-bold text-[36px]">
                {branchInfo.braManName}
              </h1>
              <h1 className="text-gray-500 font-bold text-[18px]">
                {branchInfo.braManDesignation}
              </h1>
              <p className="text-gray-800 w-full">
                {" "}
                <br />"
                <span className="font-bold text-[#00984a]">
                  {" "}
                  Bismillahir Rahmanir Raheem As-Salamu Alaikum wa Rahmatullahi
                  wa Barakatuh,
                </span>
                <br /> <br />
                Welcome to{" "}
                <span className="font-bold text-[#00984a]">
                  Popular Diagnostic Centre
                </span>
                . May Allah (SWT) bless you with health and ease on your path to
                healing. It is our honor to serve you with sincerity,
                compassion, and trust. <br /> <br />
                Since 1983,{" "}
                <span className="font-bold text-[#00984a]">
                  Popular Diagnostic Centre Ltd.
                </span>{" "}
                has played a leading role in Bangladesh’s healthcare landscape.
                Continuing that legacy, the Mirpur branch was established in
                2012 to deliver modern, dependable diagnostics to this vibrant
                part of Dhaka.
                <br /> <br />
                Here, your health is our highest priority. Through world-class
                technology, expert professionals, and a commitment to accuracy,
                we ensure fast, reliable results, empowering you and your
                doctors to make confident decisions. <br />
                At Popular Mirpur, every patient is family. Behind every test is
                a human story, and we are here to support yours with care,
                clarity, and unwavering respect. <br />
                <span className="font-medium italic text-[#00984a]">
                  Let us be part of your journey, where precision meets
                  compassion, every day.
                </span>
                "
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
    </section>
  );
};

export default Mirpur;
