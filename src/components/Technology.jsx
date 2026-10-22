import React from "react";
import { ourTechnologies } from "../constants/homepage";
import "@fontsource/ubuntu";

const TechCard = ({ image, name }) => {
  return (
    <div className="bg-white p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
      <div className="relative mb-4 rounded-2xl">
        <img
          className="max-h-80 rounded-2xl w-full object-cover transition-transform duration-300 transform group-hover:scale-105"
          src={image}
          alt=""
        />
        <a
          className="flex justify-center items-center bg-[#00984a] bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
          href="#"
          target="_self"
          rel="noopener noreferrer">
          Precision Medical Equipments
          <svg
            className="ml-2 w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
      <h3 className="font-medium text-xl leading-8">
        <a
          href="/blog/slug"
          className="block relative text-gray-600 group-hover:text-[#00984a] transition-colors duration-200">
          State-of-the-Art{" "}
          <span className=" text-[#00984a] font-medium">{name}</span> Equipments
        </a>
      </h3>
      <div />
    </div>
  );
};
const Technology = () => {
  return (
    <div className="bg-white">
      <div className="relative pt-2 lg:pt-2 min-h-screen">
        <div
          className="bg-cover w-full flex justify-center items-center"
          style={{ backgroundImage: "url('/images/mybackground.jpeg')" }}>
          <div className="w-full bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="w-full mx-auto rounded-2xl bg-white p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center px-2 mx-auto">
                {ourTechnologies.map((tech) => (
                  <TechCard
                    key={tech.id}
                    image={tech.image}
                    name={tech.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technology;
