import { useQuery } from "@tanstack/react-query";
import { Task } from "../../types/tasks";
import api from "../lib/axios";


export const useAllTasks = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks", "all"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });
};
