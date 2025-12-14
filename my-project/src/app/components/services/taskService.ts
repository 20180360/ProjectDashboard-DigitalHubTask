import { Task } from "../../types/tasks";
import api from "../lib/axios";

export const fetchTasksByProject = async (projectId: string) => {
  const res = await api.get(`/tasks?projectId=${projectId}`);
  return res.data as Task[];
};

export const createTask = async (task: Omit<Task, "id">) => {
  const res = await api.post("/tasks", task);
  return res.data as Task; 
};

export const updateTask = async (id: string, patch: Partial<Task>) => {
  const res = await api.patch(`/tasks/${id}`, patch);
  return res.data as Task;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
