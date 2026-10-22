import React from "react";
import { Link } from "react-router-dom";
import { FaUserSlash, FaCalendarAlt } from "react-icons/fa";
import { buildDoctorPath } from "../utils/doctorUrl";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const handleImageError = (e) => {
  e.target.style.display = "none";
  e.target.nextElementSibling.style.display = "flex";
};

const DoctorCard = ({ doctor }) => {
  const cardBackgroundColor =
    "bg-gradient-to-b from-transparent via-transparent to-[#f0fff0]/80";
  const backgroundColor = "group-hover:bg-[#d7ffd7]";
  const textColor = "text-[#00984a]";
  const secondaryTextColor = "text-gray-600";

  const specialistNames =
    doctor.specialists
      ?.map((spec) => spec.specialist?.name)
      ?.filter(Boolean)
      ?.join(", ") || "Not specified";

  const branchName = doctor.branches?.[0]?.branch?.name || "Not specified";

  const isAbsent = doctor.on_leave === 1;
  const isFutureAbsent = doctor.on_future_leave === 1;
  const showAbsentPeriod =
    doctor.absent_to && new Date(doctor.absent_to) >= new Date();

  return (
    <Link
      to={buildDoctorPath(doctor)}
      className="doctor-card-link group relative">
      <div
        className={`relative flex w-72 flex-col rounded-xl ${cardBackgroundColor} bg-clip-border text-gray-700 shadow-md h-full transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-lg ${
          isAbsent ? "border-2 border-red-200 shadow-lg shadow-red-200" : ""
        }`}>
        <div className="relative mx-4 mt-4 h-60 overflow-hidden rounded-xl bg-clip-border text-gray-700 shadow-lg">
          {doctor.image ? (
            <>
              <img
                src={doctor.image}
                alt={`${doctor.name}'s picture`}
                className={`w-full h-full object-cover object-top shadow-xl ${backgroundColor} rounded-xl transition-all duration-300 group-hover:scale-105 ${
                  isAbsent ? "opacity-75" : ""
                }`}
                style={{ aspectRatio: "1/1" }}
                onError={handleImageError}
              />
              <div className="no-image absolute inset-0 font-ubuntu flex-col justify-center items-center p-2 h-full bg-gray-100 rounded-xl hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="256"
                  height="256"
                  viewBox="0 0 256 256"
                  className="h-32 w-32 text-gray-400">
                  <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <circle cx="58.145" cy="74.615" r="13.145" fill="#ffffff" />
                    <path
                      d="M45 40.375c-9.415 0-17.118-7.703-17.118-17.118v-6.139C27.882 7.703 35.585 0 45 0s17.118 7.703 17.118 17.118v6.139C62.118 32.672 54.415 40.375 45 40.375z"
                      fill="#d7ffd7"
                    />
                    <path
                      d="M55.078 42.803L45 54.44 34.922 42.803c-12.728 2.118-22.513 13.239-22.513 26.544v17.707c0 1.621 1.326 2.946 2.946 2.946h59.29c1.621 0 2.946-1.326 2.946-2.946V69.346c0-13.305-9.786-24.426-22.513-26.544zM67.204 76.875c0 .667-.541 1.208-1.208 1.208h-3.877v3.877c0 .667-.541 1.208-1.208 1.208H56.73c-.667 0-1.208-.541-1.208-1.208v-3.877h-3.877c-.667 0-1.208-.541-1.208-1.208v-4.179c0-.667.541-1.208 1.208-1.208h3.877V67.61c0-.667.541-1.208 1.208-1.208h4.179c.667 0 1.208.541 1.208 1.208v3.877h3.877c.667 0 1.208.541 1.208 1.208v4.179z"
                      fill="#d7ffd7"
                    />
                  </g>
                </svg>
                <p className="text-gray-500 mt-2">No Image Available</p>
              </div>
            </>
          ) : (
            <div className="no-image font-ubuntu flex flex-col justify-center items-center p-2 h-full bg-gray-100 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="256"
                height="256"
                viewBox="0 0 256 256"
                className="h-32 w-32 text-gray-400">
                <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                  <circle cx="58.145" cy="74.615" r="13.145" fill="#ffffff" />
                  <path
                    d="M45 40.375c-9.415 0-17.118-7.703-17.118-17.118v-6.139C27.882 7.703 35.585 0 45 0s17.118 7.703 17.118 17.118v6.139C62.118 32.672 54.415 40.375 45 40.375z"
                    fill="#d7ffd7"
                  />
                  <path
                    d="M55.078 42.803L45 54.44 34.922 42.803c-12.728 2.118-22.513 13.239-22.513 26.544v17.707c0 1.621 1.326 2.946 2.946 2.946h59.29c1.621 0 2.946-1.326 2.946-2.946V69.346c0-13.305-9.786-24.426-22.513-26.544zM67.204 76.875c0 .667-.541 1.208-1.208 1.208h-3.877v3.877c0 .667-.541 1.208-1.208 1.208H56.73c-.667 0-1.208-.541-1.208-1.208v-3.877h-3.877c-.667 0-1.208-.541-1.208-1.208v-4.179c0-.667.541-1.208 1.208-1.208h3.877V67.61c0-.667.541-1.208 1.208-1.208h4.179c.667 0 1.208.541 1.208 1.208v3.877h3.877c.667 0 1.208.541 1.208 1.208v4.179z"
                    fill="#d7ffd7"
                  />
                </g>
              </svg>
              <p className="text-gray-500 mt-2">No Image Available</p>
            </div>
          )}

          {isAbsent && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between pointer-events-none">
              <div className="bg-red-500 text-white text-xs font-bold py-1 px-3 flex items-center justify-center transform -rotate-45 origin-left w-36 absolute -left-4 top-20 shadow-md">
                <FaUserSlash className="mr-1" />
                <span>ON LEAVE</span>
              </div>

              <div className="absolute inset-0 bg-red-100 bg-opacity-20"></div>
            </div>
          )}
        </div>

        <div className="p-6 text-center">
          <h4
            className={`mb-2 block font-sans ${textColor} text-xl font-semibold leading-snug tracking-normal antialiased`}>
            {doctor.name}
          </h4>

          {doctor.degree && (
            <p className="block bg-gradient-to-tr from-gray-400 to-gray-600 bg-clip-text font-sans text-sm font-medium leading-relaxed text-transparent antialiased mb-1">
              <strong>Degrees:</strong> {doctor.degree}
            </p>
          )}

          <p className={`text-sm ${secondaryTextColor} mb-1`}>
            <strong>Specialty:</strong> {specialistNames}
          </p>

          <p className={`text-sm ${secondaryTextColor} mb-1`}>
            <strong>Branch:</strong> {branchName}
          </p>

          {isAbsent && (
            <div className="mt-3 bg-red-50 text-red-800 text-xs font-medium px-3 py-2 rounded-md flex items-center justify-center gap-2 border border-red-200">
              <FaUserSlash size={14} className="text-red-600" />
              <span className="font-bold">Currently On Leave</span>
            </div>
          )}

          {showAbsentPeriod && (
            <div className="mt-2 bg-yellow-50 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md flex flex-col items-center justify-center gap-1 border border-yellow-200">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-yellow-600" />
                <span className="font-semibold">
                  {isAbsent
                    ? "On Leave Until"
                    : isFutureAbsent
                    ? "Upcoming Leave"
                    : "Leave Period"}
                </span>
              </div>
              <div>
                {isAbsent
                  ? `Until ${formatDate(doctor.absent_to)}`
                  : `${formatDate(doctor.absent_from)} - ${formatDate(
                      doctor.absent_to
                    )}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default React.memo(DoctorCard);
