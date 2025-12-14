import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectById,
  updateProject,
  fetchProjects,
} from "../../components/services/projectService"
import { Project } from "../../types/projects";

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}
// Get all projects
export const useProjects = (params : QueryParams) => {
  return useQuery({
    queryKey: ["projects",params],
    queryFn:()=> fetchProjects(params),
  });
};

// Get one project
export const useProject = (id: string) => {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });
};

// Update project
export const useUpdateProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Project> }) =>
      updateProject(id, patch),

    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["project", id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
