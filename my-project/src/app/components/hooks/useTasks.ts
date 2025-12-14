import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasksByProject, createTask, updateTask, deleteTask } from "../services/taskService";
import { Task } from "../../types/tasks";

export const useTasks = (projectId: string) =>
  useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasksByProject(projectId),
  });
 
export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (_data, _variables, context) => {
qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Task> }) =>
      updateTask(id, patch),

    onMutate: async ({ id, patch }) => {
      const projectId = patch.projectId; 

      await qc.cancelQueries({ queryKey: ["tasks", projectId] });

      const previous = qc.getQueryData<Task[]>(["tasks", projectId]);

      qc.setQueryData(["tasks", projectId], (old: Task[]) => {
        if (!old) return old;
        return old.map((t: Task) => (t.id === id ? { ...t, ...patch } : t));
      });

      return { previous, projectId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        qc.setQueryData(["tasks", ctx.projectId], ctx.previous);
    },

    onSettled: (_d, _e, vars, ctx) => {
      qc.invalidateQueries({ queryKey: ["tasks", ctx?.projectId] });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTask, // تأكدي إن deleteTask ياخد taskId كوسيط
    onSuccess: (_data, taskId: string) => {
      // حذف التاسك مباشرة من الكاش الخاص بالمشروع
      qc.setQueryData<Task[]>(["tasks", projectId], (oldTasks) =>
        oldTasks?.filter(task => task.id !== taskId) || []
      );
    },
  });
};
