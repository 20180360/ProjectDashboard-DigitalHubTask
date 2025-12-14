import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const isAdmin = user?.role === "Admin";
  const isProjectManager = user?.role === "ProjectManager";
  const isDeveloper = user?.role === "Developer";

  return { user, isAdmin, isProjectManager, isDeveloper };
};
