import "@fontsource/ubuntu";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { legacyApi } from "../services/api/legacyApi";

// One card width used everywhere on the page, so every portrait is the same size.
const CARD_W = "w-[158px] xs:w-[178px] sm:w-[224px]";

// Initials for the graceful fallback when a portrait fails to load.
const getInitials = (name = "") =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => !/^(dr\.?|mr\.?|mrs\.?|ms\.?|md\.?|late)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const LeaderCard = ({ image, name, designation, apex }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative z-10 flex h-full shrink-0 ${CARD_W}`}>
      {apex && <span className="lg-exec-halo lg-exec-halo--apex" aria-hidden="true" />}
      <article className={`lg-card flex h-full w-full flex-col rounded-[1.6rem] p-3 ${apex ? "lg-exec-card lg-exec-card--apex" : ""}`}>
        <div className="lg-plate relative overflow-hidden rounded-[1.2rem]">
          <div className="aspect-[4/5] w-full">
            {imgError ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e7f7ee] to-[#cfead9]">
                <span className="font-ubuntu text-3xl font-semibold tracking-wide text-[#00795c]">
                  {getInitials(name)}
                </span>
              </div>
            ) : (
              <img
                src={image}
                alt={`${name}, ${designation}`}
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            )}
          </div>
          <span className="lg-plate-scrim" aria-hidden="true" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between px-1 pb-1 pt-3 text-center">
          <h3 className="font-ubuntu text-sm font-semibold leading-snug text-gray-900 sm:text-[15px]">{name}</h3>
          <p className="mt-1 text-[11px] leading-snug text-gray-500">{designation}</p>
        </div>

        <span className="lg-underline" aria-hidden="true" />
      </article>
    </div>
  );
};

const SkeletonCard = () => (
  <div className={`lg-card flex h-full w-full flex-col rounded-[1.6rem] p-3 ${CARD_W}`}>
    <div className="lg-skeleton aspect-[4/5] w-full rounded-[1.2rem]" />
    <div className="flex flex-1 flex-col items-center justify-between gap-2 px-1 pt-3">
      <div className="lg-skeleton h-4 w-3/4 rounded-full" />
      <div className="lg-skeleton h-3 w-1/2 rounded-full" />
    </div>
  </div>
);

const RowTier = ({ title, members = [], fill = 3, loading, reduce, showTitle = true }) => {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
      };

  if (!loading && (!members || members.length === 0)) return null;
  const count = loading ? fill : members.length;
  const cards = loading ? Array.from({ length: fill }) : members;

  return (
    <section className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {showTitle && title && (
          <div className="mb-7 flex items-center gap-4 sm:mb-9">
            {loading ? (
              <span className="lg-skeleton h-3 w-40 rounded-full" />
            ) : (
              <h2 className="whitespace-nowrap font-ubuntu text-xs font-medium uppercase tracking-[0.25em] text-[#006642] sm:text-sm">
                {title}
              </h2>
            )}
            <span className="h-px flex-1 bg-gradient-to-r from-[#00984a]/45 via-[#00984a]/15 to-transparent" />
            <span className="text-xs tabular-nums text-[#00984a]/55 sm:text-sm">
              {loading ? "" : String(count).padStart(2, "0")}
            </span>
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="flex flex-wrap justify-center items-stretch gap-5 sm:gap-6"
        >
          {cards.map((m, i) => (
            <motion.div key={m?._id || i} variants={item} className={`flex h-auto ${CARD_W} shrink-0`}>
              {loading ? <SkeletonCard /> : <LeaderCard {...m} />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Atmosphere = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <span
      className="lg-orb"
      style={{ width: 420, height: 420, top: -110, left: -90, background: "radial-gradient(circle, #86efac, transparent 70%)" }}
    />
    <span
      className="lg-orb"
      style={{ width: 320, height: 320, top: "34%", right: -80, background: "radial-gradient(circle, #6ee7b7, transparent 70%)", animationDelay: "5s" }}
    />
    <span
      className="lg-orb"
      style={{ width: 480, height: 480, bottom: -170, left: "24%", background: "radial-gradient(circle, #a7f3d0, transparent 70%)", animationDelay: "9s" }}
    />
  </div>
);

const About = () => {
  const [rowsData, setRowsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await legacyApi.get("/api/management-team");
        const rows = response.data?.data ?? {};
        if (!active) return;

        // Sort items inside each row by their serial numbers
        const processedRows = {};
        Object.keys(rows).forEach((rowKey) => {
          const list = rows[rowKey] || [];
          processedRows[rowKey] = [...list].sort((a, b) => (a.serial || 0) - (b.serial || 0));
        });

        setRowsData(processedRows);
      } catch {
        if (active) setError("We couldn't load the leadership team right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="lg-page relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white px-4">
        <Atmosphere />
        <div className="lg-rail max-w-md rounded-3xl p-8 text-center">
          <p className="font-ubuntu text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-gradient-to-r from-[#00984a] to-[#00b358] px-6 py-2.5 font-medium text-white transition-all duration-300 hover:brightness-110"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg-page relative min-h-screen overflow-x-hidden bg-gradient-to-b from-green-50 to-white pb-10">
      <Atmosphere />

      {/* Hero Section */}
      <section
        className="relative px-4 pb-6 pt-16 text-center sm:px-6 sm:pb-8 sm:pt-20 lg:px-8 lg:pt-24"
        style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto max-w-4xl"
        >
          <p className="mb-5 font-ubuntu text-[10px] font-medium uppercase tracking-[0.32em] text-[#00984a] sm:mb-6 sm:text-xs">
            Popular Diagnostic Centre · Since 1983
          </p>
          <h1 className="font-ubuntu text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Leadership built on
            <br />
            <span className="bg-gradient-to-r from-[#00b365] via-[#00984a] to-[#006642] bg-clip-text text-transparent">
              four decades of trust
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">
            From a single centre in Dhaka to a nationwide diagnostic network, these are the people guiding Popular
            Diagnostic Centre&apos;s commitment to accurate, accessible healthcare.
          </p>
        </motion.div>
      </section>

      {/* Row 1: Chairman */}
      <RowTier members={rowsData["Row - 1"]} fill={1} loading={loading} reduce={reduce} showTitle={false} apex />

      {/* Row 2: Managing Director + Board Divider Banner */}
      <div className="mx-auto my-4 max-w-5xl px-4 sm:px-6">
        <div className="rounded-xl bg-[#006642] py-2.5 text-center shadow-sm">
          <h2 className="font-ubuntu text-xs font-semibold uppercase tracking-[0.25em] text-white sm:text-sm">
            Board of Directors
          </h2>
        </div>
      </div>
      <RowTier members={rowsData["Row - 2"]} fill={1} loading={loading} reduce={reduce} showTitle={false} />

      {/* Row 3: Deputy Managing Director & Directors */}
      <RowTier members={rowsData["Row - 3"]} fill={3} loading={loading} reduce={reduce} showTitle={false} />

      {/* Row 4 & Below: Management Team Divider Banner & Rows */}
      <div className="mx-auto my-4 max-w-5xl px-4 sm:px-6">
        <div className="rounded-xl bg-[#006642] py-2.5 text-center shadow-sm">
          <h2 className="font-ubuntu text-xs font-semibold uppercase tracking-[0.25em] text-white sm:text-sm">
            Management Team
          </h2>
        </div>
      </div>

      {loading ? (
        <>
          <RowTier fill={3} loading reduce={reduce} showTitle={false} />
          <RowTier fill={3} loading reduce={reduce} showTitle={false} />
          <RowTier fill={2} loading reduce={reduce} showTitle={false} />
          <RowTier fill={4} loading reduce={reduce} showTitle={false} />
        </>
      ) : (
        Object.keys(rowsData)
          .filter((key) => {
            const num = parseInt(key.replace(/\D/g, ""), 10);
            return num >= 4;
          })
          .sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, ""), 10);
            const numB = parseInt(b.replace(/\D/g, ""), 10);
            return numA - numB;
          })
          .map((rowKey) => (
            <RowTier key={rowKey} members={rowsData[rowKey]} loading={false} reduce={reduce} showTitle={false} />
          ))
      )}

      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

About.displayName = "About";

export default About;