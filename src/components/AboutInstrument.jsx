import "@fontsource/ubuntu";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { BANDS, bandOf, getInitials } from "../utils/leadership";

const ECG_POINTS = "0,20 240,20 260,20 272,6 284,34 296,12 308,20 560,20 572,26 584,20 800,20";

const EcgDivider = () => (
  <svg viewBox="0 0 800 40" className="mt-9 block h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
    <polyline points={ECG_POINTS} fill="none" stroke="#00984a" strokeWidth="1.5" opacity="0.25" />
    <polyline points={ECG_POINTS} fill="none" stroke="#00984a" strokeWidth="1.5" className="dgx-ecg-path" />
  </svg>
);

const DgxPortrait = ({ image, name, designation, small = false }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="dgx-scan aspect-[4/5] w-full rounded-md">
      {imgError || !image ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className={`dgx-mono font-semibold text-[#00795c] ${small ? "text-lg" : "text-2xl"}`}>
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
        />
      )}
    </div>
  );
};

const InstrumentHero = ({ reduce }) => (
  <header
    className="px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto max-w-5xl">
      <div className="dgx-mono flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[10px] tracking-[0.2em] text-[#006642] sm:text-[11px]">
        <span>PDCL // LEADERSHIP INDEX</span>
      </div>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="mt-8 max-w-[18ch] font-ubuntu text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl"
      >
        Precision has a{" "}
        <span className="bg-gradient-to-r from-[#00b365] to-[#006642] bg-clip-text text-transparent">
          chain of command.
        </span>
      </motion.h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-gray-600 sm:text-[15px]">
        Every report we deliver is signed off by a structure built over four decades. This is that
        structure — mapped, connected, accountable.
      </p>
    </div>
    <EcgDivider />
  </header>
);

const NodeConnector = ({ reduce }) => (
  <div className="relative flex justify-center">
    <motion.span
      initial={reduce ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="block h-9 w-0.5 origin-top bg-gradient-to-b from-[#00984a]/70 to-[#00984a]/20"
      aria-hidden="true"
    />
    <span className="dgx-dot absolute -bottom-1 h-2 w-2 rounded-full bg-[#00984a]" aria-hidden="true" />
  </div>
);

const ExecNode = ({ member, index, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    className="dgx-card mx-auto grid w-full max-w-[430px] grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[92px_1fr] sm:gap-5"
  >
    <DgxPortrait {...member} />
    <div>
      <p className="dgx-mono text-[9px] tracking-[0.18em] text-[#006642] sm:text-[10px]">
        EXEC-{String(index + 1).padStart(2, "0")} / {(member.designation || "").toUpperCase()}
      </p>
      <h3 className="mt-1.5 font-ubuntu text-base font-bold text-gray-900 sm:text-lg">{member.name}</h3>
      <p className="dgx-mono mt-2.5 flex items-center gap-2 text-[9px] tracking-[0.14em] text-[#006642] sm:text-[10px]">
        <i className="dgx-dot h-1.5 w-1.5 rounded-full bg-[#00984a]" aria-hidden="true" />
        ACTIVE
      </p>
    </div>
  </motion.div>
);

const ExecNodeSkeleton = () => (
  <div className="dgx-card mx-auto grid w-full max-w-[430px] grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[92px_1fr] sm:gap-5">
    <div className="dgx-skeleton aspect-[4/5] w-full rounded-md" />
    <div>
      <div className="dgx-skeleton h-3 w-1/2 rounded-full" />
      <div className="dgx-skeleton mt-3 h-5 w-2/3 rounded-full" />
    </div>
  </div>
);

const PanelBand = ({ band, index, reduce }) => {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
      };
  return (
    <section className="px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="dgx-mono flex items-baseline justify-between border-b border-[#00984a]/30 pb-2.5 text-[9px] tracking-[0.18em] text-[#006642] sm:text-[11px]">
          <span>
            PANEL {String(index + 2).padStart(2, "0")} · {band.label.toUpperCase()}
          </span>
          <span>n = {String(band.members.length).padStart(2, "0")}</span>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {band.members.map((m, i) => (
            <motion.div key={m._id || i} variants={item} className="dgx-panel-card p-3">
              <DgxPortrait {...m} small />
              <h3 className="mt-2.5 font-ubuntu text-[13px] font-semibold text-gray-900">{m.name}</h3>
              <p className="mt-1 text-[10.5px] leading-relaxed text-gray-500">{m.designation}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const PanelBandSkeleton = ({ fill }) => (
  <section className="px-4 py-7 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="dgx-skeleton h-4 w-full rounded-full" />
      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: fill }).map((_, i) => (
          <div key={i} className="dgx-panel-card p-3">
            <div className="dgx-skeleton aspect-[4/5] w-full rounded-md" />
            <div className="dgx-skeleton mt-3 h-3.5 w-2/3 rounded-full" />
            <div className="dgx-skeleton mt-2 h-2.5 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutInstrument = () => {
  const { data, loading, error } = useManagementTeam();
  const reduce = useReducedMotion();
  const bands = BANDS.map((b) => ({
    ...b,
    members: data.rest.filter((m) => bandOf(m.designation) === b.key),
  })).filter((b) => b.members.length > 0);

  if (error) {
    return (
      <div className="dgx-page flex min-h-screen items-center justify-center px-4">
        <div className="dgx-card max-w-md p-8 text-center">
          <p className="dgx-mono text-[10px] tracking-[0.18em] text-[#006642]">SIGNAL LOST</p>
          <p className="mt-3 font-ubuntu text-base text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="dgx-mono mt-6 rounded-md border border-[#00984a]/50 px-5 py-2 text-[11px] tracking-[0.14em] text-[#006642] transition-colors hover:bg-[#00984a]/10"
          >
            RE-RUN QUERY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dgx-page relative min-h-screen overflow-x-hidden pb-12">
      <InstrumentHero reduce={reduce} />
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {(loading ? [null, null, null] : data.exec).map((m, i) => (
            <div key={m?._id || i}>
              {i > 0 && <NodeConnector reduce={reduce} />}
              {loading || !m ? <ExecNodeSkeleton /> : <ExecNode member={m} index={i} reduce={reduce} />}
            </div>
          ))}
        </div>
      </section>
      {loading
        ? [3, 4].map((fill, i) => <PanelBandSkeleton key={i} fill={fill} />)
        : bands.map((b, i) => <PanelBand key={b.key} band={b} index={i} reduce={reduce} />)}
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutInstrument.displayName = "AboutInstrument";

export default AboutInstrument;
