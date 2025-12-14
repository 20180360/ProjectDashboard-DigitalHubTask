// src/app/(dashboard)/page.tsx
"use client";

import PrivateRoute from "../components/privateRoute/privateRoute";
import TableProjects from "../components/ui/common/TableProject";

export default function DashboardPage() {
  return (
        <PrivateRoute roles={["Admin", "ProjectManager", "Developer"]}>

    <div>
      <TableProjects />
    </div>
    </PrivateRoute>
  );
}
