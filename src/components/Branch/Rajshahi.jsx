import React from "react";
import "@fontsource/ubuntu";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";

const Rajshahi = () => {
  const branchInfo = branch.find((b) => b.heading === "Rajshahi");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 14;
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
      <div className="relative z-10 m-4">
        <div className="bg-gradient-to-bl from-white from-10% via-white via-30% to-[#00984a]/20 mt-12 mx-auto lg:max-w-7xl w-full flex flex-col lg:flex-row justify-evenly rounded-3xl items-start border border-[#00664a]/10 shadow-xl backdrop-blur-sm">
          <img
            src={branchInfo.braManImg}
            alt="Mr. Farid Mohammad Shamim"
            className="relative mx-auto h-full w-auto border-[6px] border-[#00984a] rounded-3xl"
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
            <div className="relative mt-24 p-5">
              <h1 className="text-gray-600 font-bold text-[36px]">
                {branchInfo.braManName}
              </h1>
              <h1 className="text-gray-500 font-bold text-[18px]">
                {branchInfo.braManDesignation}
              </h1>
              <p className="mb-4">আসসালামু আলাইকুম,</p>

              <p className="mb-4">
                ১৯৮৩ ইং সালের স্বল্প পরিসরে ঢাকায় প্রতিষ্ঠিত হয় পপুলার
                ডায়াগনস্টিক সেন্টার লিঃ। প্রতিষ্ঠার পর খুব অল্প সময়ের মধ্যে
                প্রতিষ্ঠানটি বাংলাদেশের স্বাস্থ্য খাতে গুরুত্বপূর্ণ ভুমিকায়
                অবতীর্ণ হয়। সেবার মানের উত্তোরোত্তর বৃদ্ধিতে স্বাস্থ্য সেবার
                লক্ষ্যে সারাদেশে একের পর এক শাখা গড়ে উঠে। বর্তমানে যার সংখ্যা
                ২২টি।
              </p>

              <p className="mb-4">
                ২০০৯ ইং সালের অক্টোবর মাসে উত্তরবঙ্গের শিক্ষা ও স্বাস্থ্য নগরী
                খ্যাত রাজশাহী জেলায় শুরু হয় পপুলার ডায়াগনস্টিক সেন্টার লিঃ-এর
                রাজশাহী শাখার কার্যক্রম। প্রতিষ্ঠার পর থেকে রাজশাহী,
                চাঁপাইনবাবগঞ্জ, সিরাজগঞ্জ, জয়পুরহাট, নওগাঁ, কুষ্টিয়া, আলমডাঙ্গা,
                চুয়াডাঙ্গা, ঝিনাইদহসহ সুদূর খুলনা থেকেও সেবা নিতে আসা রোগীদের
                প্রধান আস্থার স্থান হয়ে ওঠে এই শাখাটি।
              </p>

              <p className="mb-4">
                রাজশাহী শাখায় বর্তমানে বাংলাদেশের সবচেয়ে বড় ও অত্যাধুনিক
                আমেরিকান রোবোটিক ল্যাবরেটরী সিস্টেম (টিএলএ) দিয়ে সকল প্যাথলজী
                পরীক্ষা হাতের স্পর্শ ছাড়াই করে শতভাগ নির্ভুল রিপোর্টের নিশ্চয়তা
                প্রদান করা হয়। এই প্রযুক্তি সঠিক রোগ নির্ণয়ে এক বিপ্লব ঘটিয়েছে।
              </p>

              <p className="mb-4">
                ইমেজিংসহ প্রতিটি বিভাগে রয়েছে আধুনিকতা ও সর্বোৎকৃষ্ট প্রযুক্তির
                ব্যবহার। এছাড়া রাজশাহী মেডিকেল কলেজসহ রাজশাহীর স্বনামধন্য
                চিকিৎসকদের সমন্বয়ে গঠিত কনসালটেশন সার্ভিস রয়েছে, যেখানে
                চিকিৎসকরা আন্তরিকতা, সহানুভূতি ও দক্ষতার সাথে সেবা দিয়ে যাচ্ছেন।
              </p>

              <p className="mb-4">
                কর্মীরা নিষ্ঠা ও সততার সাথে নিরলসভাবে কাজ করে যাচ্ছেন, যার ফলে
                এই শাখাটি রোগীদের কাছে একটি বিশ্বস্ততার কেন্দ্রস্থল হিসেবে গড়ে
                উঠেছে।
              </p>

              <blockquote className="italic text-green-600 border-l-4 border-green-500 pl-4 my-6">
                “থাকবো সাধারণ, কাজ করবো অসাধারণ”
              </blockquote>

              <p className="text-right mt-8">
                <strong>ফরিদ মোহাম্মদ শামীম</strong>
                <br></br>
                এজিএম এন্ড হেড অব ব্রাঞ্চ<br></br>
                পপুলার ডায়াগনস্টিক সেন্টার লিঃ, রাজশাহী শাখা
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Rajshahi;
