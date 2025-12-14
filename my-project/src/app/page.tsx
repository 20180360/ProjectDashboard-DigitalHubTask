"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login
    router.push("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse text-center text-gray-500">
        Redirecting to Login...
      </div>
    </div>
  );
}
