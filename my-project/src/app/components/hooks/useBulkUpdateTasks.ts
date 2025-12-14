import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../../types/tasks";
import { updateTask } from "../services/taskService";

interface BulkUpdateItem {
  id: string;
  patch: Partial<Task>;
}

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: BulkUpdateItem[]) => {
      // تنفيذ كل التحديثات بالتوازي
      await Promise.all(
        updates.map(({ id, patch }) => updateTask(id, patch))
      );
    },

    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistic Update
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((task) => {
          const update = updates.find((u) => u.id === task.id);
          return update ? { ...task, ...update.patch } : task;
        })
      );

      return { previousTasks };
    },

    onError: (_err, _updates, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
