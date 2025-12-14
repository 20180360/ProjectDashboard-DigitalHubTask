// src/services/projectService.ts
import axios from "axios";
import api from "../lib/axios";
import { Task } from "../../types/tasks";

export type Project = {
  id: string;
  name: string;
  status: "Active" | "Completed" | "Pending";
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
};

type QueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  assignedTo?: string;
};

export const fetchProjects = async (params: QueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("_page", String(params.page));
  if (params.limit) searchParams.set("_limit", String(params.limit));
  if (params.sortBy) {
    searchParams.set("_sort", params.sortBy);
    searchParams.set("_order", params.order ?? "asc");
  }
  if (params.search) searchParams.set("q", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.assignedTo) searchParams.set("assignedTo", params.assignedTo);

  const res = await api.get(`/projects?${searchParams.toString()}`);
  // json-server returns X-Total-Count header for pagination
  return {
    data: res.data as Project[],
    total: Number(res.headers["x-total-count"] ?? res.data.length),
  };
};

export const fetchProjectsBySearch = async (params: QueryParams) => {
  const { search, status, assignedTo } = params;

  // 1️⃣ هات كل المشاريع
  const projectsRes = await api.get("/projects");
  let projects = projectsRes.data as Project[];

  // 2️⃣ فلترة بالاسم
  if (search) {
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 3️⃣ فلترة بالحالة
  if (status) {
    projects = projects.filter(p => p.status === status);
  }

  // 4️⃣ فلترة حسب assigned user (عن طريق tasks)
  if (assignedTo) {
    const resTasks = await api.get("/tasks", {
      params: { assignedTo },
    });

    const projectIds = new Set(
      (resTasks.data as Task[]).map(t => t.projectId)
    );

    projects = projects.filter(p => projectIds.has(p.id));
  }

  return {
    data: projects,
    total: projects.length,
  };
};

export const updateProject = async (id: string, patch: Partial<Project>) => {
  const res = await api.patch(`/projects/${id}`, patch);
  return res.data as Project;
};




export const fetchProjectById = async (id: string) => {
  const res = await api.get<Project>(`/projects/${id}`);
  return res.data;
};

