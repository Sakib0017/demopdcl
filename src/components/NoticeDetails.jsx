import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "@fontsource/ubuntu";
import { API_TOKEN, BASE_URL } from "../secrets";

const LoadingState = () => (
  <div className="bg-white min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ErrorState = ({ error, onBack }) => (
  <div className="bg-white min-h-screen flex items-center justify-center px-4">
    <div className="text-center p-6 max-w-md w-full bg-white rounded-xl shadow-md border border-gray-100">
      <div className="text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onBack}
        className="px-6 py-2 bg-gradient-to-r from-[#007a3d] to-[#006633] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md">
        Back to Notices
      </button>
    </div>
  </div>
);

const NotFoundState = ({ onBack }) => (
  <div className="bg-white min-h-screen flex items-center justify-center px-4">
    <div className="text-center p-6 max-w-md w-full bg-white rounded-xl shadow-md border border-gray-100">
      <div className="text-gray-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Notice not found
      </h3>
      <p className="text-gray-600 mb-6">
        The notice you're looking for doesn't exist or couldn't be loaded.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-2 bg-gradient-to-r from-[#007a3d] to-[#006633] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md">
        Back to Notices
      </button>
    </div>
  </div>
);

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchNoticeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/news/${id}`, {
        params: {
          token: `${API_TOKEN}`,
        },
      });

      if (response.data.success) {
        setNotice(response.data.data);
      } else {
        setError("Failed to fetch notice details");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch notice details");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNoticeDetails();
  }, [fetchNoticeDetails]);

  const handleDownloadImage = useCallback(() => {
    if (!notice?.image) return;

    const link = document.createElement("a");
    link.href = notice.image;
    link.setAttribute("download", `${notice.title.replace(/\s+/g, "_")}.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [notice]);

  const handleBack = useCallback(() => {
    navigate("/notice");
  }, [navigate]);

  const isValidImage =
    notice?.image?.trim() &&
    notice.image !== "https://populardiagnostic.com/public/news/";

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onBack={handleBack} />;
  if (!notice) return <NotFoundState onBack={handleBack} />;

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-[#007a3d] hover:text-[#006633] transition-colors font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Notices
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          {isValidImage && (
            <div className="relative w-full aspect-video max-h-[500px] bg-gray-100 overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse h-full w-full bg-gray-200"></div>
                </div>
              )}
              <img
                src={notice.image}
                alt={notice.title}
                className={`w-full h-full object-contain ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold font-ubuntu text-gray-900 mb-2 md:mb-0">
                {notice.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-2">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(notice.post_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {notice.postedby && (
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {notice.postedby.name}
                </span>
              )}
            </div>

            {notice.details && (
              <div
                className="prose max-w-none text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: notice.details }}
              />
            )}

            {notice.remarks && notice.remarks !== "<p>.</p>" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Remarks
                </h3>
                <div
                  className="prose max-w-none text-gray-600 italic"
                  dangerouslySetInnerHTML={{ __html: notice.remarks }}
                />
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              {isValidImage && (
                <button
                  onClick={handleDownloadImage}
                  className="px-6 py-2 bg-gradient-to-r from-[#007a3d] to-[#006633] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center w-full sm:w-auto justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Image
                </button>
              )}

              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center w-full sm:w-auto justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Notices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
