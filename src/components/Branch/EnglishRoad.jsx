import React from "react";
import "@fontsource/ubuntu";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";

const EnglishRoad = () => {
  const branchInfo = branch.find((b) => b.heading === "English Road");
  const branchName = branchInfo.heading;
 const branchId = branchInfo.branchID;
  const branchForDoctor = 2;
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
              {branchName}{" "}
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
            alt="Md. Mahbubur Rahman Chowdhury"
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
                পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড – ইংলিশ রোড শাখায় আপনাকে
                স্বাগতম! বাংলাদেশে স্বাস্থ্যসেবার অগ্রগামী প্রতিষ্ঠান হিসেবে
                আমরা আধুনিক প্রযুক্তি এবং অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের মাধ্যমে
                নির্ভুল ও আন্তর্জাতিক মানসম্মত সেবা নিশ্চিত করি। ইংলিশ রোড শাখায়
                আমরা আপনাকে আন্তরিকতা, যত্ন এবং বিশ্বমানের সেবা প্রদান করার জন্য
                প্রতিশ্রুতিবদ্ধ। আমাদের লক্ষ্য হচ্ছে সঠিক রোগ নির্ণয় ও চিকিৎসার
                মাধ্যমে আপনার স্বাস্থ্য সুরক্ষায় গুরুত্বপূর্ণ ভূমিকা রাখা।
                পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড – ইংলিশ রোড শাখা বেছে
                নেওয়ার জন্য ধন্যবাদ। আমরা আপনাকে আন্তরিক সেবা প্রদানে সর্বদা
                প্রস্তুত। আপনার সুস্বাস্থ্য, আমাদের অগ্রাধিকার।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnglishRoad;
