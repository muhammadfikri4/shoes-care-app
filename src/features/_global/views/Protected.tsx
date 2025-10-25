import { Navigate } from "react-router-dom";
import { ROLE } from "../../../core/model/profile";
import { useProfile } from "../../profile/hooks/useProfile";
import { Error } from "../components/Lottie/Error";

export const Protected = () => {
  const { data: profile } = useProfile();
  if (
    profile?.data?.role === ROLE.ADMIN ||
    profile?.data?.role === ROLE.SUPERADMIN
  ) {
    return <Navigate to={"admin/transactions"} />;
  }
  if (profile?.data?.role === ROLE.CUSTOMER) {
    return <Navigate to={"my/transactions"} />;
  }
  return <Error />;
};
