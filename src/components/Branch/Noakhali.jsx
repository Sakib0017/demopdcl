import React from "react";
import "@fontsource/ubuntu";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";

const Noakhali = () => {
  const branchInfo = branch.find((b) => b.heading === "Noakhali");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 31;

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
              <br></br>
              <p className="mb-4 text-center font-bold">
                ”বিসমিল্লাহির রাহমানির রাহিম”
              </p>
              <p className="mb-4 ">আসসালামু আলাইকুম,</p>
              <p className="mb-4">
                পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড, নোয়াখালী শাখায় আপনাদেরকে
                সু-স্বাগতম। পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড, নোয়াখালী শাখা
                বাংলাদেশের স্বাস্থ্যখাতের স্বনামধন্য প্রতিষ্ঠান ”পপুলার গ্রুপ”
                এর শীর্ষস্থানীয় একটি সহযোগী প্রতিষ্ঠান। পপুলার ডায়াগনস্টিক
                সেন্টার লিমিটেড, নোয়াখালী শাখা ২০১৯ সালে যাত্রা শুরু করার পর
                থেকে অদ্যবধি পর্যন্ত অত্যন্ত সুনামের সহিত নোয়াখালীর সর্বস্তরের
                মানুষকে উন্নত স্বাস্থ্য সেবা প্রদান করে আসছে। পারিপার্শ্বিক
                বিভিন্ন কারণে গ্রাম ও শহরের মানুষের স্বাস্থ্য সংক্রান্ত সমস্যা
                ক্রমাগত বৃদ্ধি পাচ্ছে। প্রাথমিক পর্যায়ে স্বাস্থ্য সমস্যা শনাক্ত
                করা খুবই গুরুত্বপূর্ণ। আপনাদের স্বাস্থ্যের উপর নজর রাখার
                সর্বোত্তম পন্থা গুলির মধ্যে একটি হল নিয়মিত ডায়াগনস্টিক সেন্টারে
                যাওয়া এবং স্ক্রীনিং পরীক্ষা করা। যা আপনাদের সুস্বাস্থ্য নিশ্চিত
                করতে গুরুত্বপূর্ণ ভূমিকা পালন করে। আপনাদের সঠিক রোগ নির্ণয়ের
                জন্য পপুলার ডায়াগনস্টিক সেন্টার লিমিটেড, নোয়াখালী শাখায় রয়েছে
                বিশ্বের সর্বাধুনিক প্রযুক্তির মেশিন সমৃদ্ধ আন্তর্জাতিক মানের
                ল্যাবরেটরি, সিটি স্ক্যান, এমআরআই,আলট্রাসনোগ্রাফি, ইসিজি, ইকো,
                এন্ডোসকপি, কোলোনোস্কোপি, মেমোগ্রাফি ও বিএমডি সেবা সহ সকল ধরনের
                পরীক্ষা-নিরীক্ষার ব্যবস্থা। সকল বিষয়ে বিষেশজ্ঞ ডাক্তারের মাধ্যমে
                পরামর্শ সেবা প্রদান এবং সঠিক রোগ নির্ণয়ের মাধ্যমে আপনাদের
                সুস্বাস্থ্য নিশ্চিত করাই আমাদের মূল লক্ষ্য।
              </p>
              <p className="mb-4">
                আপনাদের সুস্বাস্থ্যের প্রত্যাশায় ...............
              </p>

              <p className="text-right mt-8">
                ধন্যবাদান্তে <br></br>
                <strong>কাজী মোঃ রিয়াজ হোসাইন</strong>
                <br></br>
                শাখা ব্যবস্থাপক<br></br>
                পপুলার ডায়াগনস্টিক সেন্টার লিঃ, নোয়াখালী শাখা।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Noakhali;
