import React, { useState, useEffect, useCallback } from "react";
import { branch } from "../constants/branches";

const HotlineCard = React.memo(({ heading, Hotline, branchID }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(Hotline).then(
      () => {
        setShowTooltip(true);
        const timer = setTimeout(() => setShowTooltip(false), 2000);
        return () => clearTimeout(timer);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, [Hotline]);

  return (
    <div className="my-3 p-3 bg-white/50 hover:bg-gray-400/50 shadow-lg w-96 border-2 border-[#00984a] rounded-lg flex items-center justify-between">
      <div className="flex-1 flex justify-between items-center">
        <div className="w-44 p-1 mr-2 text-center bg-gray-500 rounded text-gray-50 font-medium text-[20px]">
          {heading}
        </div>
        <div className="flex relative">
          <a
            href={`tel:${Hotline}`}
            className="w-34 p-1 rounded-l-lg bg-[#1b7ced] text-center text-gray-100 font-medium text-[18px]">
            {Hotline}
          </a>
          <button
            onClick={copyToClipboard}
            className="flex items-center py-2 px-3 text-[#00984a] hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200"
            type="button">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </button>
          {showTooltip && (
            <div className="absolute -top-8 right-0 px-2 py-1 bg-gray-800 text-white text-xs rounded">
              Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const Hotlines = () => {
  const [dhakaBranches, setDhakaBranches] = useState([]);
  const [otherBranches, setOtherBranches] = useState([]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const dhaka = branch.filter(
        (b) => b.branchPage?.braCity === "Dhaka" || b.braCity === "Dhaka"
      );
      const others = branch.filter(
        (b) => b.branchPage?.braCity !== "Dhaka" && b.braCity !== "Dhaka"
      );

      setDhakaBranches(dhaka);
      setOtherBranches(others);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex justify-center px-12 pb-10">
        <div className="relative w-full max-w-7xl">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-[#82bcff] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-48 -right-4 w-72 h-72 bg-[#82bcff] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative flex flex-col items-center">
            <h1 className="py-8 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Inside <span className="text-[#00984a]">Dhaka</span>
            </h1>
            <div className="rounded-lg flex justify-center items-center flex-wrap">
              {dhakaBranches.map((props) => (
                <div
                  key={props.branchID}
                  className="flex justify-center w-full lg:w-1/2 2xl:w-1/3 hover:scale-105 transition duration-300 ">
                  <HotlineCard {...props} />
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col items-center mt-10">
            <h1 className="py-8 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Outside <span className="text-[#00984a]">Dhaka</span>
            </h1>
            <div className="rounded-lg flex justify-center items-center flex-wrap">
              {otherBranches.map((props) => (
                <div
                  key={props.branchID}
                  className="flex justify-center w-full lg:w-1/2 2xl:w-1/3 hover:scale-105 transition duration-300 ">
                  <HotlineCard {...props} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Hotlines);
