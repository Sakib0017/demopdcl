// Branch names carry their units in the name itself: "Dhanmondi (U1, U2, U3)"
// is three units, "Savar" is one. Shared by the branches page and the homepage
// stat card so the two can't count the same list differently.
export const countBranchUnits = (branchName) => {
  const unitGroups = String(branchName ?? "").match(/\(U\d+(?:,\s*U\d+)*\)/g);
  if (!unitGroups) return 1;

  return unitGroups.reduce(
    (count, group) => count + (group.match(/U\d+/g) || []).length,
    0
  );
};
