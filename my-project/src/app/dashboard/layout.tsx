"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../components/store/store";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
