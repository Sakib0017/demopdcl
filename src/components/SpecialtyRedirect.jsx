import { Navigate, useParams } from "react-router-dom";

// /doctors            -> /our-doctors
// /doctors/cardiology -> /our-doctors?specialty=cardiology
const SpecialtyRedirect = () => {
  const { specialty } = useParams();
  const to = specialty
    ? `/our-doctors?specialty=${encodeURIComponent(specialty)}`
    : "/our-doctors";
  return <Navigate to={to} replace />;
};

export default SpecialtyRedirect;
