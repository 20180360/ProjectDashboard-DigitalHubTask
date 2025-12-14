"use client";

import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import { User } from "../hooks/useUsers";

interface PrivateRouteProps {
  children: ReactNode;
  roles: string[]; // الأدوار المسموح لها
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const router = useRouter();
  const user: User | null = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // لو مش متسجل دخول
    } else if (!roles.includes(user.role)) {
      router.push("/dashboard"); // لو الدور مش مسموح
    }
  }, [user, roles, router]);

  if (!user || !roles.includes(user.role)) return null;

  return <>{children}</>;
}
