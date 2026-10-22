import React from "react";
import "@fontsource/ubuntu";
import { Helmet } from "react-helmet-async";
import { healthPackages } from "../constants/health";

const calculateTotalCost = (tests) =>
  tests.reduce((acc, test) => acc + test.testPrice, 0);

const calculateSavings = (totalCost, discountedPrice) =>
  totalCost - discountedPrice;

const PackageCard = ({ packageData }) => {
  const totalCost = calculateTotalCost(packageData.packageIncludes);
  const savings = calculateSavings(totalCost, packageData.discountedPrice);
  return (
    <div className="relative bg-[#f0fff0]/50 z-10 max-w-7xl rounded-2xl overflow-hidden shadow-2xl p-4 m-4">
      <div className="absolute top-8 left-[18%] transform -rotate-45 -translate-x-1/2 translate-y-1/2 bg-[#1b7ced] shadow-xl px-[25%] py-3">
        <p className="text-[#ffffff] text-xl font-bold whitespace-nowrap">
          Save!{" "}
          {savings.toLocaleString("en-IN",)}
        </p>
      </div>
      <div className="pb-6 pt-12 font-bold text-[#36454F] text-2xl text-center mb-2">
        {packageData.packageHeading}
      </div>
      <div className="py-4 font-bold text-[#36454F] text-2xl text-center mb-2">
        {packageData.packageName}
      </div>
      <div className="divide-y divide-gray-200">
        {packageData.packageIncludes.map((test, index) => (
          <div key={index} className="flex justify-between gap-2 py-1 px-3">
            <span className="text-[#36454F]">{test.testName}</span>
            <span className="text-gray-700">
              {test.testPrice.toLocaleString("en-BD", {
                style: "currency",
                currency: "BDT",
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="font-bold border-t-2 border-gray-400 my-3"></div>
      <div className="divide-y divide-gray-200">
        <div className=" flex justify-between gap-2 divide-y divide-gray-200">
          <p className="text-gray-700">Total Cost:</p>
          <p className="text-gray-700">
            {totalCost.toLocaleString("en-BD", {
              style: "currency",
              currency: "BDT",
            })}
          </p>
        </div>
        <div className=" flex justify-between gap-2">
          <p className="text-gray-700">Discounted Price:</p>
          <p className="text-gray-700 text-[20px] font-bold ">
            {" "}
            {packageData.discountedPrice.toLocaleString("en-BD", {
              style: "currency",
              currency: "BDT",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const Health = () => {
  return (
    <div className="bg-[#ffffff]">
      <Helmet>
        {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
        <title>Popular Diagnostic Centre Ltd. | Health Packages & Discounts</title>
        <meta
          name="description"
          content="Save on comprehensive health packages at Popular Diagnostic Centre Ltd. Book affordable preventive health checkups with diagnostic tests, ECG, chest X-ray and ultrasound."
        />
        */}
      </Helmet>
      <div className="flex flex-col pt-[80px] mx-auto max-w-7xl">
        <h2 className="text-gray-900/50 pb-5 text-center pl-2 text-[28px] font-bold font-ubuntu">
          HEALTH PACKAGES AND DISCOUNTS
        </h2>
      </div>
      <div className="flex mx-auto pb-10 z-10 max-w-7xl justify-center flex-wrap gap-7">
        {healthPackages.map((packageData) => (
          <PackageCard key={packageData.packageID} packageData={packageData} />
        ))}
      </div>
    </div>
  );
};

export default Health;
