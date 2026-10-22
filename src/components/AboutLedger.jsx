import "@fontsource/ubuntu";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { BANDS, bandOf, getInitials } from "../utils/leadership";

const ROMANS = ["I.", "II.", "III."];

const Rule = ({ double = false, reduce }) => (
  <motion.div
    initial={reduce ? false : { scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    style={{ transformOrigin: "left" }}
    className={double ? "border-t-[3px] border-double border-[#17251e]" : "h-px bg-[#c2d1c5]"}
  />
);

const LedgerPortrait = ({ image, name, designation, textClass = "text-3xl" }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="ldg-duo aspect-[4/5] w-full rounded-sm">
      {imgError || !image ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className={`ldg-serif ${textClass} tracking-wide text-[#006642]/70`}>{getInitials(name)}</span>
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

const Masthead = ({ reduce }) => (
  <header
    className="relative px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto max-w-4xl">
      <Rule double reduce={reduce} />
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-ubuntu text-[10px] uppercase tracking-[0.22em] text-[#006642] sm:text-[11px]">
        <span>Popular Diagnostic Centre Ltd.</span>
        <span>Register of Leadership · Est. 1983</span>
      </div>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="ldg-serif mt-10 max-w-[15ch] text-4xl font-medium leading-[1.05] text-[#17251e] sm:text-6xl"
      >
        Forty years, <em className="italic text-[#006642]">kept in trust.</em>
      </motion.h1>
      <p className="ldg-dropcap mt-7 max-w-[58ch] text-[15px] leading-[1.75] text-[#3c4a42] sm:text-base">
        Since a single centre opened its doors in Dhanmondi in 1983, Popular Diagnostic Centre has
        grown into a nationwide diagnostic network. This register records the people entrusted with
        that responsibility.
      </p>
    </div>
  </header>
);

const ChapterHead = ({ title, chapter, count }) => (
  <div className="mt-14 flex items-baseline justify-between gap-4 border-b-2 border-[#17251e] pb-2.5">
    <h2 className="ldg-serif text-lg font-medium text-[#17251e] sm:text-xl">{title}</h2>
    <span className="whitespace-nowrap font-ubuntu text-[9px] uppercase tracking-[0.2em] text-[#5f6a66] sm:text-[10px]">
      Chapter {String(chapter).padStart(2, "0")} · {String(count).padStart(2, "0")} members
    </span>
  </div>
);

const ExecPlate = ({ member, index, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    className="grid grid-cols-[32px_104px_1fr] items-center gap-5 border-b border-[#c2d1c5] py-8 sm:grid-cols-[64px_200px_1fr] sm:gap-7"
  >
    <span className="ldg-serif text-xl italic text-[#9fb3a5] sm:text-2xl" aria-hidden="true">
      {ROMANS[index] || `${index + 1}.`}
    </span>
    <LedgerPortrait {...member} />
    <div className="min-w-0">
      <h3 className="ldg-serif break-words text-2xl font-medium leading-tight text-[#17251e] sm:text-3xl">
        {member.name}
      </h3>
      <p className="mt-2 break-words font-ubuntu text-[10px] uppercase tracking-[0.24em] text-[#006642] sm:text-[11px]">
        {member.designation}
      </p>
    </div>
  </motion.div>
);

const ExecPlateSkeleton = () => (
  <div className="grid grid-cols-[32px_104px_1fr] items-center gap-5 border-b border-[#c2d1c5] py-8 sm:grid-cols-[64px_200px_1fr] sm:gap-7">
    <span />
    <div className="ldg-skeleton aspect-[4/5] w-full rounded-sm" />
    <div>
      <div className="ldg-skeleton h-6 w-2/3 rounded-full" />
      <div className="ldg-skeleton mt-3 h-3 w-1/3 rounded-full" />
    </div>
  </div>
);

const RegisterRow = ({ member, no, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-[#d8e2da] py-3.5 sm:grid-cols-[56px_1fr_auto] sm:gap-5"
  >
    <LedgerPortrait {...member} textClass="text-base" />
    <div className="min-w-0">
      <h3 className="ldg-serif break-words text-base font-medium text-[#17251e] sm:text-lg">{member.name}</h3>
      <p className="mt-0.5 break-words font-ubuntu text-[9px] uppercase tracking-[0.16em] text-[#5f6a66] sm:text-[10px]">
        {member.designation}
      </p>
    </div>
    <span className="font-ubuntu text-[10px] tabular-nums text-[#5f6a66] sm:text-[11px]">
      No. {String(no).padStart(2, "0")}
    </span>
  </motion.div>
);

const RegisterRowSkeleton = () => (
  <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-[#d8e2da] py-3.5 sm:grid-cols-[56px_1fr_auto] sm:gap-5">
    <div className="ldg-skeleton aspect-[4/5] w-full rounded-sm" />
    <div>
      <div className="ldg-skeleton h-4 w-1/2 rounded-full" />
      <div className="ldg-skeleton mt-2 h-2.5 w-1/3 rounded-full" />
    </div>
    <span />
  </div>
);

const AboutLedger = () => {
  const { data, loading, error } = useManagementTeam();
  const reduce = useReducedMotion();

  const bands = BANDS.map((b) => ({
    ...b,
    members: data.rest.filter((m) => bandOf(m.designation) === b.key),
  })).filter((b) => b.members.length > 0);

  let ledgerNo = data.exec.length;
  const chapters = bands.map((b, i) => {
    const start = ledgerNo + 1;
    ledgerNo += b.members.length;
    return { ...b, chapter: i + 2, start };
  });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-4">
        <div className="max-w-md border-y-[3px] border-double border-[#17251e] py-10 text-center">
          <p className="ldg-serif text-lg text-[#17251e]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="ldg-serif mt-6 border-b border-[#006642] pb-0.5 text-base italic text-[#006642] transition-opacity hover:opacity-70"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f8f5] pb-12">
      <Masthead reduce={reduce} />
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ChapterHead title="Executive Leadership" chapter={1} count={loading ? 3 : data.exec.length} />
          {loading
            ? [0, 1, 2].map((i) => <ExecPlateSkeleton key={i} />)
            : data.exec.map((m, i) => <ExecPlate key={m._id || i} member={m} index={i} reduce={reduce} />)}
        </div>
      </section>
      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {loading
            ? [4, 6].map((rows, i) => (
                <div key={i}>
                  <div className="ldg-skeleton mt-14 h-8 w-full rounded-sm" />
                  {Array.from({ length: rows }).map((_, r) => (
                    <RegisterRowSkeleton key={r} />
                  ))}
                </div>
              ))
            : chapters.map((c) => (
                <div key={c.key}>
                  <ChapterHead title={c.label} chapter={c.chapter} count={c.members.length} />
                  {c.members.map((m, i) => (
                    <RegisterRow key={m._id || i} member={m} no={c.start + i} reduce={reduce} />
                  ))}
                </div>
              ))}
        </div>
      </section>
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutLedger.displayName = "AboutLedger";

export default AboutLedger;
