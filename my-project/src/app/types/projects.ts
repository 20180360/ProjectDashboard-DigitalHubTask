// src/types/project.ts
export type ProjectStatus = "Active" | "Completed" | "Pending";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
};
