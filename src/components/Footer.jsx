import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fontsource/ubuntu";
import img from "../assets/link.webp";
import { API_TOKEN, BASE_URL } from "../secrets";

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/social-links`, {
          params: {
            token: `${API_TOKEN}`,
          },
        });
        setSocialLinks(response.data.data);
      } catch (err) {
        console.error("Error fetching social links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <footer className="w-full   bg-[#00984a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <div>
                <p className="font-semibold">Head Office (Dhanmondi):</p>
                <p className="py-2">
                  House #16, Road # 2, Dhanmondi R/A,
                  <br />
                  Dhaka-1205, Bangladesh
                </p>
                <p className="mt-4">
                  Phone:{" "}
                  <a href="tel:09666787801" className="hover:underline">
                    09666 787801
                  </a>
                  ,{" "}
                  <a href="tel:10636" className="hover:underline">
                    10636
                  </a>
                </p>
                <Link
                  to="/hotlines"
                  className="inline-block transition-colors text-sm">
                  View All Branch Hotlines →
                </Link>
              </div>

              <div className="pt-2">
                <p>
                  E-mail:{" "}
                  <a
                    href="mailto:info@populardiagnostic.com"
                    className="hover:underline">
                    info@populardiagnostic.com
                  </a>
                </p>
              </div>

              {!loading && (
                <div className="flex space-x-4 pt-4">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="hover:text-gray-200 transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="hover:text-gray-200 transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="hover:text-gray-200 transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="hover:text-gray-200 transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </address>
          </div>

          {/* Important Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Our Concerns
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.popular-hospital.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline">
                  Popular Medical College Hospital
                </a>
              </li>
              <li>
                <a
                  href="https://www.popular-pharma.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline">
                  Popular Pharmaceuticals
                </a>
              </li>
              <li>
                <a
                  href="https://www.pmch-bd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline">
                  Popular Medical College
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {/* <li>
                <Link to="/services" className="hover:underline">
                  Our Services
                </Link>
              </li> */}
              <li>
                <Link to="/our-branches" className="hover:underline">
                  Our Branches
                </Link>
              </li>
              <li>
                <a
                  href="http://appointment.populardiagnostic.com/appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline">
                  Call for Appointments
                </a>
              </li>
              <li>
                <Link to="/our-doctors" className="hover:underline">
                  Find Doctors
                </Link>
              </li>
              <li>
                <a href="https://complain.populardiagnostic.com/" className="hover:underline">
                  Complain & Advise
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <img
            src={img}
            alt="Payment Partners"
            className="max-w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>

      <div className="bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © Copyright {new Date().getFullYear()}. Popular CodeCure - Popular
              Diagnostic Centre Ltd.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/terms&conditions" className="text-sm hover:underline">
                Terms and Conditions
              </Link>
              <Link to="/privacy&policy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link to="/refund" className="text-sm hover:underline">
                Refund & Return Policy
              </Link>
            </div>

            <p className="text-sm text-center md:text-right">
              24298000 <span>Total Views</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
