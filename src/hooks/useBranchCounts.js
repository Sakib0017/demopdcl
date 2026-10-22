import { useEffect, useState } from "react";
import { legacyApi } from "../services/api/legacyApi";
import { countBranchUnits } from "../utils/branchUnits";

// The counts as verified against /api/branches. Every caller renders these
// until the request lands, and keeps them if it never does: a number that is
// one behind reads better than a 0 or a blank slot in a sentence.
const SEEDED_COUNTS = { totalBranches: 24, totalUnits: 42 };

// Nav, Navbar and the homepage stats all mount together, and the branch list is
// the same for all of them, so the first caller's request is the only one.
let pendingCounts = null;

const loadBranchCounts = () => {
  if (!pendingCounts) {
    pendingCounts = legacyApi
      .get("/api/branches")
      .then(({ data }) => {
        const branches = data?.data?.data;
        if (!Array.isArray(branches) || branches.length === 0) {
          return SEEDED_COUNTS;
        }

        return {
          totalBranches: branches.length,
          totalUnits: branches.reduce(
            (sum, item) => sum + countBranchUnits(item.name),
            0
          ),
        };
      })
      .catch(() => SEEDED_COUNTS);
  }

  return pendingCounts;
};

/**
 * Live branch and diagnostic unit totals, for any copy that states them.
 * @returns {{totalBranches: number, totalUnits: number}}
 */
export const useBranchCounts = () => {
  const [counts, setCounts] = useState(SEEDED_COUNTS);

  useEffect(() => {
    let cancelled = false;

    loadBranchCounts().then((next) => {
      if (!cancelled) setCounts(next);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
};
