import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import all images individually
// import Image1 from "../assets/HeroImages/1.webp";
import Image2 from "../assets/HeroImages/2.webp";
import Image3 from "../assets/HeroImages/3.webp";
import Image4 from "../assets/HeroImages/4.webp";
import Image5 from "../assets/HeroImages/5.webp";
import Image6 from "../assets/HeroImages/6.webp";
import Image7 from "../assets/HeroImages/7.webp";
import Image8 from "../assets/HeroImages/8.webp";
import Image9 from "../assets/HeroImages/9.webp";
import Image10 from "../assets/HeroImages/10.webp";
import Image11 from "../assets/HeroImages/11.webp";
import Image12 from "../assets/HeroImages/12.webp";
import Image13 from "../assets/HeroImages/13.webp";
import Image14 from "../assets/HeroImages/14.webp";

// Alt text supplied verbatim by the SEO team (Home page image alt text.pdf) —
// do not paraphrase. Mapped file-by-file per their explicit 1.webp-14.webp
// list, not by the PDF's own item numbering (the two don't match). 1.webp's
// text ("State-of-the-art pathology laboratory equipment...") has no active
// slide to attach to — it stays commented out above with Image1.
const images = [
  // { id: 1, src: Image1 },
  {
    id: 2,
    src: Image2,
    alt: "Blood collection tube ready for clinical laboratory testing at Popular Diagnostic Centre.",
  },
  {
    id: 3,
    src: Image3,
    alt: "Blood sample prepared for laboratory analysis and accurate pathology diagnosis at Popular Diagnostic Centre.",
  },
  {
    id: 4,
    src: Image4,
    alt: "Experienced pathology laboratory team at Popular Diagnostic Centre ensuring accurate diagnostic services.",
  },
  {
    id: 5,
    src: Image5,
    alt: "Medical laboratory professionals processing patient samples with advanced diagnostic technology.",
  },
  {
    id: 6,
    src: Image6,
    alt: "Abbott automated diagnostic analyzer used for advanced pathology testing at Popular Diagnostic Centre.",
  },
  {
    id: 7,
    src: Image7,
    alt: "Automated laboratory testing equipment delivering fast and accurate diagnostic results at Popular Diagnostic Centre.",
  },
  {
    id: 8,
    src: Image8,
    alt: "Patient undergoing MRI scan with Siemens Healthineers technology at Popular Diagnostic Centre.",
  },
  {
    id: 9,
    src: Image9,
    alt: "Advanced automated pathology testing using Vitros XT 7600 at Popular Diagnostic Centre laboratory.",
  },
  {
    id: 10,
    src: Image10,
    alt: "Vitros XT 7600 analyzer performing high-accuracy laboratory diagnostics at Popular Diagnostic Centre.",
  },
  {
    id: 11,
    src: Image11,
    alt: "Laboratory expert preparing blood samples for precise pathology testing at Popular Diagnostic Centre.",
  },
  {
    id: 12,
    src: Image12,
    alt: "Medical technologist operating the Alegria 2 analyzer at Popular Diagnostic Centre's advanced laboratory.",
  },
  {
    id: 13,
    src: Image13,
    alt: "Professional blood collection service at Popular Diagnostic Centre for accurate diagnostic and pathology testing.",
  },
  {
    id: 14,
    src: Image14,
    alt: "Patient giving a blood sample for laboratory testing at Popular Diagnostic Centre's modern and advanced pathology laboratory.",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === images.length - 1 ? 0 : current + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[clamp(260px,50vh,360px)] sm:h-[clamp(320px,52vh,420px)] md:h-[clamp(360px,55vh,500px)] lg:h-[clamp(400px,60vh,560px)] xl:h-[clamp(440px,62vh,600px)] 2xl:h-[clamp(480px,65vh,640px)]">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeIndex === index ? 1 : 0,
              transition: {
                duration: 2,
              },
            }}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </motion.div>
        ))}

        {/* Gradient overlay (optional - can remove if not needed) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-white" />

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
