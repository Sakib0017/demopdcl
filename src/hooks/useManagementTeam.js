import { useState, useEffect } from "react";
import { legacyApi } from "../services/api/legacyApi";

// Fetches the management team and splits it into the three executives
// (Row - 1) and the pooled remainder (Rows 2-4) — the same contract
// About.jsx uses inline.
export const useManagementTeam = () => {
  const [data, setData] = useState({ exec: [], rest: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await legacyApi.get("/api/management-team");
        const rows = response.data?.data ?? {};
        if (!active) return;
        setData({
          exec: rows["Row - 1"]?.slice(0, 3) || [],
          rest: [
            ...(rows["Row - 2"] || []),
            ...(rows["Row - 3"] || []),
            ...(rows["Row - 4"] || []),
          ],
        });
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

  return { data, loading, error };
};
