import "@fontsource/ubuntu";
import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { BANDS, bandOf, getInitials } from "../utils/leadership";

const TILE_BG = "from-[#eaf5ee] to-[#d8ebe0]";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "executive", label: "Executive" },
  ...BANDS,
];

const BAND_LABELS = Object.fromEntries(FILTERS.map((f) => [f.key, f.label]));

// Number words for the lede (14 → "Fourteen"); digits past twenty.
const allWord = (n) => {
  const words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
  return words[n] || String(n);
};

const Tile = forwardRef(({ member, big = false, wide = false, onOpen, reduce }, ref) => {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.button
      ref={ref}
      layout={!reduce}
      layoutId={reduce || !onOpen ? undefined : `tile-${member._id || member.name}`}
      type="button"
      onClick={onOpen ? (e) => onOpen(member, e.currentTarget) : undefined}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br ${TILE_BG} p-2.5 text-left ${
        big ? (wide ? "col-span-3 row-span-2 sm:col-span-2" : "col-span-2 row-span-2") : ""
      } ${
        onOpen ? "cursor-pointer" : "cursor-default"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00984a] focus-visible:ring-offset-2`}
      aria-label={`${member.name}, ${member.designation}`}
      tabIndex={onOpen ? 0 : -1}
    >
      {!imgError && member.image ? (
        <img
          src={member.image}
          alt=""
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <span
          className={`absolute inset-0 flex items-center justify-center font-ubuntu font-extrabold text-[#006642]/70 ${
            big ? "text-3xl" : "text-xl"
          }`}
        >
          {getInitials(member.name)}
        </span>
      )}
      {big && (
        <>
          <span
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
            aria-hidden="true"
          />
          <b className="relative font-ubuntu text-xs font-bold leading-snug text-white sm:text-[13px]">
            {member.name} · {member.designation}
          </b>
        </>
      )}
    </motion.button>
  );
});
Tile.displayName = "Tile";

const Spotlight = ({ member, list, onClose, onStep, reduce }) => {
  const idx = list.findIndex((m) => (m._id || m.name) === (member._id || member.name));
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member]);

  // Mount-only: focus Close once. Must NOT re-run on step navigation, or
  // Prev/Next keyboard use yanks focus back to Close on every press.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "Tab") {
        const focusables = Array.from(dialogRef.current?.querySelectorAll("button") || []);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
    >
      <motion.div
        ref={dialogRef}
        layoutId={reduce ? undefined : `tile-${member._id || member.name}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}, ${member.designation}`}
        className="grid w-full max-w-lg grid-cols-[120px_1fr] items-center gap-5 rounded-3xl border border-[#dbe5dd] bg-[#f6faf7] p-5 shadow-2xl sm:max-w-xl sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-6"
      >
        <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${TILE_BG}`}>
          {!imgError && member.image ? (
            <img
              src={member.image}
              alt={`${member.name}, ${member.designation}`}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-ubuntu text-3xl font-extrabold text-[#006642]/70">
              {getInitials(member.name)}
            </span>
          )}
        </div>
        <div>
          <span className="inline-block rounded-full bg-[#e3f1e9] px-3 py-1 font-ubuntu text-[10px] font-bold uppercase tracking-[0.16em] text-[#00794e]">
            {BAND_LABELS[member.band] || member.band}
          </span>
          <h2 className="mt-2.5 font-ubuntu text-xl font-extrabold text-[#22292a] sm:text-2xl">
            {member.name}
          </h2>
          <p className="mt-1 text-sm text-[#5f6a66]">{member.designation}</p>
          <div className="mt-4 flex items-center gap-3 font-ubuntu text-xs text-[#5f6a66]">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="rounded-full border border-[#d7e0d9] px-3.5 py-1.5 font-semibold text-[#4c5a54] transition-colors hover:border-[#00984a]/60"
            >
              ← Prev
            </button>
            <span className="tabular-nums">
              {String(idx + 1).padStart(2, "0")} of {String(list.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="rounded-full border border-[#d7e0d9] px-3.5 py-1.5 font-semibold text-[#4c5a54] transition-colors hover:border-[#00984a]/60"
            >
              Next →
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto rounded-full bg-[#006642] px-3.5 py-1.5 font-semibold text-white transition-all hover:brightness-110"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const GalleryHero = ({ members, loading, reduce }) => (
  <header
    className="px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="font-ubuntu text-[11px] font-bold uppercase tracking-[0.2em] text-[#00984a] sm:text-xs">
          About us · Since 1983
        </p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-3 font-ubuntu text-4xl font-extrabold leading-[1.05] tracking-tight text-[#22292a] sm:text-6xl"
        >
          The people of{" "}
          <span className="bg-gradient-to-r from-[#00b365] to-[#006642] bg-clip-text text-transparent">
            Popular.
          </span>
        </motion.h1>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[#5f6a66]">
          {loading ? "Our" : `${allWord(members.length)}`} leaders, one promise: accurate, accessible
          diagnostics for every patient who walks through our doors — at every one of our centres.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2.5 [grid-auto-rows:64px] sm:[grid-auto-rows:74px]">
        {(loading ? [] : members.slice(0, 9)).map((m, i) => (
          <Tile key={m._id || i} member={m} big={i === 0} reduce={reduce} />
        ))}
        {loading &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`gal-skeleton rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            />
          ))}
      </div>
    </div>
  </header>
);

const AboutGallery = () => {
  const { data, loading, error } = useManagementTeam();
  const reduce = useReducedMotion();

  const allMembers = [
    ...data.exec.map((m) => ({ ...m, band: "executive" })),
    ...data.rest.map((m) => ({ ...m, band: bandOf(m.designation) })),
  ];

  const [filter, setFilter] = useState("all");

  const shown = filter === "all" ? allMembers : allMembers.filter((m) => m.band === filter);

  // Interleave big executive tiles with two small tiles each so a 2x2 exec
  // tile plus two stacked 1x1 tiles tile a full 3-col block with no gap,
  // while keeping DOM order monotonic with visual order (sparse grid
  // placement, no grid-flow-dense) for correct keyboard Tab order.
  const wallOrder = (() => {
    const bigs = shown.filter((m) => m.band === "executive");
    const smalls = shown.filter((m) => m.band !== "executive");
    const out = [];
    let si = 0;
    for (const b of bigs) {
      out.push(b);
      out.push(...smalls.slice(si, si + 2));
      si += 2;
    }
    return [...out, ...smalls.slice(si)];
  })();

  const execsOnly = wallOrder.length > 0 && wallOrder.every((m) => m.band === "executive");

  const [selected, setSelected] = useState(null);
  const lastFocusRef = useRef(null);

  const openSpotlight = useCallback((member, el) => {
    lastFocusRef.current = el;
    setSelected(member);
  }, []);

  const closeSpotlight = useCallback(() => {
    setSelected(null);
    lastFocusRef.current?.focus();
  }, []);

  const stepSpotlight = useCallback(
    (dir) => {
      setSelected((cur) => {
        if (!cur) return cur;
        const i = wallOrder.findIndex((m) => (m._id || m.name) === (cur._id || cur.name));
        return wallOrder[(i + dir + wallOrder.length) % wallOrder.length];
      });
    },
    [wallOrder]
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfdfb] px-4">
        <div className="max-w-md rounded-3xl border border-[#dbe5dd] bg-[#f6faf7] p-8 text-center shadow-lg">
          <p className="font-ubuntu text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#006642] px-6 py-2.5 font-ubuntu font-medium text-white transition-all hover:brightness-110"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fdfdfb] pb-12">
      <GalleryHero members={allMembers} loading={loading} reduce={reduce} />
      <section className="px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter leadership by group">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`rounded-full border px-4 py-2 font-ubuntu text-[13px] font-semibold transition-colors ${
                  filter === f.key
                    ? "border-[#006642] bg-[#006642] text-white"
                    : "border-[#d7e0d9] bg-white text-[#4c5a54] hover:border-[#00984a]/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <motion.div
            layout={!reduce}
            className="mt-6 grid grid-cols-3 gap-2.5 [grid-auto-rows:88px] sm:grid-cols-4 sm:gap-3 sm:[grid-auto-rows:104px] lg:grid-cols-6"
          >
            <AnimatePresence mode="popLayout">
              {(loading ? [] : wallOrder).map((m) => (
                <Tile
                  key={m._id || m.name}
                  member={m}
                  big={m.band === "executive"}
                  wide={execsOnly}
                  onOpen={openSpotlight}
                  reduce={reduce}
                />
              ))}
            </AnimatePresence>
            {loading &&
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`gal-skeleton rounded-2xl ${i % 3 === 0 && i < 9 ? "col-span-2 row-span-2" : ""}`}
                />
              ))}
          </motion.div>

          {!loading && shown.length === 0 && (
            <p className="mt-10 text-center text-sm text-[#5f6a66]">No members in this group.</p>
          )}
        </div>
      </section>
      <AnimatePresence>
        {selected && (
          <Spotlight
            member={selected}
            list={wallOrder}
            onClose={closeSpotlight}
            onStep={stepSpotlight}
            reduce={reduce}
          />
        )}
      </AnimatePresence>
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutGallery.displayName = "AboutGallery";

export default AboutGallery;
