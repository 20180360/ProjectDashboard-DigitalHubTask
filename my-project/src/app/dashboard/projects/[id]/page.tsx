"use client";
import { useParams } from "next/navigation";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../../../components/hooks/useTasks";
import { useBulkUpdateTasks } from "../../../components/hooks/useBulkUpdateTasks";
import { useState, useEffect } from "react";
import { useRealTimeUpdates } from "../../../components/hooks/useRealTimeUpdates";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  PauseCircle,
  AlertCircle,
  Target,
  BarChart3,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Filter,
  User,
  CalendarDays,
  AlertTriangle,
  ListTodo,
  Grid3x3,
} from "lucide-react";
import { Task } from "../../../types/tasks";
import { useProject } from "../../../components/hooks/useProject";
import Filters from "../../../components/ui/common/Filters";
import toast from "react-hot-toast";
  
// Schema validation with Zod
const taskFormSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters"),

  description: z.string().max(500).optional(),
  status: z.enum(["todo", "doing", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});


type TaskFormData = z.infer<typeof taskFormSchema>; // هي بالفعل تضم default values

// WebSocket connection component
const WebSocketConnection = ({ projectId }: { projectId: string }) => {
  const { connect, disconnect, isConnected } = useRealTimeUpdates(projectId);

 useEffect(() => {
  connect();

  return () => {
    disconnect();
  };
}, [projectId]); 


  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
      <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      {isConnected ? (
        <span className="text-sm font-medium text-blue-700">Live Updates</span>
      ) : (
        <span className="text-sm text-gray-500">Offline</span>
      )}
    </div>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const config = {
    high: { bg: "bg-red-100", text: "text-red-800", label: "High" },
    medium: { bg: "bg-amber-100", text: "text-amber-800", label: "Medium" },
    low: { bg: "bg-blue-100", text: "text-blue-800", label: "Low" },
  }[priority];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const config = {
    todo: { bg: "bg-gray-100", text: "text-gray-800", label: "To Do" },
    doing: { bg: "bg-blue-100", text: "text-blue-800", label: "In Progress" },
    done: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Completed" },
  }[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Task Card Component
const TaskCard = ({ 
  task, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onUpdate 
}: { 
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<Task>) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-200 ${
        isSelected 
          ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Task content */}
      <div className="ml-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
            {task.description && task.description.trim() !== "" && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Task metadata */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {task.assignedTo && task.assignedTo.trim() !== "" && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <User className="h-3 w-3" />
                <span>{task.assignedTo}</span>
              </div>
            )}
            
            {task.dueDate && task.dueDate.trim() !== "" && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <CalendarDays className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick status update */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Quick update:</span>
            <select
              value={task.status}
              onChange={(e) => onUpdate({ status: e.target.value as Task["status"] })}
              className="text-xs px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="doing">In Progress</option>
              <option value="done">Completed</option>
            </select>
            <select
              value={task.priority}
              onChange={(e) => onUpdate({ priority: e.target.value as Task["priority"] })}
              className="text-xs px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Form Modal Component
const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting,
  editingTask,
  form
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Task) => void;
  isSubmitting: boolean;
  editingTask: Task | null;
  form: any;
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = form;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  {editingTask ? (
                    <Edit2 className="h-5 w-5 text-white" />
                  ) : (
                    <Plus className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingTask ? "Update task details" : "Add a new task to this project"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter task title"
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Enter task description (optional)"
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("assignedTo")}
                    type="text"
                    placeholder="Assign to team member"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingTask ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingTask ? "Save Changes" : "Create Task"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ProjectDetailsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const filters = { search, status, priority, assignedTo };
  const params = useParams();
  const projectIdParam = params.id;

  if (!projectIdParam || Array.isArray(projectIdParam)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Invalid Project ID</h1>
          <p className="text-gray-600 mt-2">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }
  
  const projectId = projectIdParam;
  
  // React Query hooks
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading, refetch } = useTasks(projectId);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask(projectId);
  const bulkUpdateMutation = useBulkUpdateTasks();

  // Form setup with react-hook-form and zod
 const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} =useForm<TaskFormData>({
  resolver: zodResolver(taskFormSchema),
  defaultValues: {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  },
});



  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<Task["status"]>("todo");
  const [bulkPriority, setBulkPriority] = useState<Task["priority"]>("medium");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Listen for real-time updates
const { tasks: realTimeTasks } = useRealTimeUpdates(projectId);

// استخدم بيانات الـ WebSocket مباشرة
 const hasActiveFilters =
  !!search || !!status || !!priority || !!assignedTo;


const filteredTasks = (tasks ?? []).filter((task) => {
  if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
    return false;

  if (status && task.status !== status)
    return false;

  if (priority && task.priority !== priority)
    return false;

  if (assignedTo && task.assignedTo !== assignedTo)
    return false;

  return true;
});
const displayedTasks: Task[] = hasActiveFilters
  ? filteredTasks
  : tasks ?? [];

 

  // Status configuration
  const statusConfig = {
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
    Active: { bg: "bg-blue-50", text: "text-blue-700", icon: TrendingUp },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
    OnHold: { bg: "bg-gray-50", text: "text-gray-700", icon: PauseCircle },
    Critical: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertCircle }
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-20 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h1>
          <p className="text-gray-600">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  // Form submission handler
const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
  const payload: Omit<Task, "id"> = {
    projectId,
    title: data.title,
    description: data.description ?? "",
    status: data.status ?? "todo",
    priority: data.priority ?? "medium",
    assignedTo: data.assignedTo ?? "",
    dueDate: data.dueDate ?? "",
  };

  try {
    if (editingTask) {
      // تحديث task موجود
      await updateTaskMutation.mutateAsync({
        id: editingTask.id,
        patch: payload,
      });
      toast.success("Task updated successfully ✅");
    } else {
      // إنشاء task جديدة
      await createTaskMutation.mutateAsync(payload);
      toast.success("Task added successfully ✅");
    }

    reset();       // إعادة تعيين الفورم
    closeModal();  // غلق المودال
  } catch (err) {
    console.error("Task submission failed", err);
    toast.error("Failed to submit task ❌");
  }
};




  const handleUpdateTask = (taskId: string, patch: Partial<Task>) => {
    updateTaskMutation.mutate({ id: taskId, patch });
  };

  const handleDeleteTask = (taskId: string) => {
  // نعرض toast مخصص للتأكيد
  const toastId = toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to delete this task?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteTaskMutation.mutate(taskId, {
                onSuccess: () => toast.success("Task deleted successfully ✅"),
                onError: () => toast.error("Failed to delete task ❌"),
              });
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, 
    }
  );
};

 
  const startEditTask = (task: Task) => {
  setEditingTask(task);
  reset(taskFormSchema.parse({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo || "",
    dueDate: task.dueDate || "",
  }));
  setShowCreateModal(true);
};


  const openCreateModal = () => {
    setEditingTask(null);
    reset({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
    });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
    reset();
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleBulkUpdate = () => {
    if (selectedTasks.size === 0) return;
    
    const updates = Array.from(selectedTasks).map(taskId => ({
      id: taskId,
      patch: {
        status: bulkStatus,
        priority: bulkPriority,
      }
    }));
    
   bulkUpdateMutation.mutate(updates, {
  onSuccess: () => toast.success("Tasks updated successfully ✅"),
  onError: () => toast.error("Failed to update tasks ❌")
});

  };

  const selectAllTasks = () => {
    if (!tasks) return;
    
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      const allTaskIds = new Set(tasks.map(task => task.id));
      setSelectedTasks(allTaskIds);
    }
  };

  // Calculate task statistics
  const taskStats = {
    total: displayedTasks?.length || 0,
    todo: displayedTasks?.filter(task => task.status === "todo").length || 0,
    doing: displayedTasks?.filter(task => task.status === "doing").length || 0,
    done: displayedTasks?.filter(task => task.status === "done").length || 0,
    highPriority: displayedTasks?.filter(task => task.priority === "high").length || 0,
    mediumPriority: displayedTasks?.filter(task => task.priority === "medium").length || 0,
    lowPriority: displayedTasks?.filter(task => task.priority === "low").length || 0,
  };

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatusIcon = statusConfig[project.status as keyof typeof statusConfig]?.icon || Clock;

  return (
    <>
      <TaskFormModal
        isOpen={showCreateModal}
        onClose={closeModal}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        editingTask={editingTask}
        form={{ register, handleSubmit, formState: { errors }, reset }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <span className="font-medium">{project.status}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-100">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Start: {formatDate(project.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-100">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">End: {formatDate(project.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-100">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Budget: {formatCurrency(project.budget)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <WebSocketConnection projectId={projectId} />
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              </div>
            </div>

            {/* Project Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Project Progress</span>
                <span className="text-sm font-bold">{project.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    project.progress < 30 ? "bg-red-400" :
                    project.progress < 70 ? "bg-amber-400" :
                    "bg-emerald-400"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
               <Filters
        search={search}
        status={status}
        priority={priority}
        assignedTo={assignedTo}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onAssignedChange={setAssignedTo}
      />
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 md:px-6 -mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-800">{taskStats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* To Do Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">To Do</p>
                  <p className="text-2xl font-bold text-amber-600">{taskStats.todo}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {taskStats.total > 0 ? `${Math.round((taskStats.todo / taskStats.total) * 100)}%` : "0%"}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{taskStats.doing}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {taskStats.total > 0 ? `${Math.round((taskStats.doing / taskStats.total) * 100)}%` : "0%"}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600">{taskStats.done}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {taskStats.total > 0 ? `${Math.round((taskStats.done / taskStats.total) * 100)}%` : "0%"}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column: Bulk Update & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bulk Update Card */}
              {selectedTasks.size > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Bulk Update ({selectedTasks.size} selected)</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value as Task["status"])}
                        className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <option value="todo">To Do</option>
                        <option value="doing">In Progress</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={bulkPriority}
                        onChange={(e) => setBulkPriority(e.target.value as Task["priority"])}
                        className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={handleBulkUpdate}
                        disabled={bulkUpdateMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                      >
                        {bulkUpdateMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Apply to Selected"
                        )}
                      </button>
                      
                      <button
                        onClick={() => setSelectedTasks(new Set())}
                        className="w-full border border-purple-300 text-purple-700 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors font-medium"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Tasks List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Project Tasks</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {tasks?.length || 0} tasks • {selectedTasks.size} selected
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* View Mode Toggle */}
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                            viewMode === "grid" 
                              ? "bg-blue-600 text-white" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Grid3x3 className="h-4 w-4" />
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                            viewMode === "list" 
                              ? "bg-blue-600 text-white" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <ListTodo className="h-4 w-4" />
                          List
                        </button>
                      </div>

                      {/* Bulk Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={selectAllTasks}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {selectedTasks.size === tasks?.length ? "Deselect All" : "Select All"}
                        </button>
                        
                        {selectedTasks.size > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              {selectedTasks.size} selected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks Content */}
                <div className="p-6">
                  {tasks && tasks.length > 0 ? (
                    viewMode === "grid" ? (
                      // Grid View
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayedTasks.map((task) => (
                          <TaskCard

                            key={task.id}
                            task={task}
                            isSelected={selectedTasks.has(task.id)}
                            onSelect={() => toggleTaskSelection(task.id)}
                            onEdit={() => startEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                            onUpdate={(patch) => handleUpdateTask(task.id, patch)}
                          />
                        ))}
                      </div>
                    ) : (
                      // List View (Table)
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                              </th>
                              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                              </th>
                              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayedTasks.map((task) => (
                              <tr key={task.id} className="hover:bg-gray-50">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedTasks.has(task.id)}
                                      onChange={() => toggleTaskSelection(task.id)}
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                      <div className="font-medium text-gray-900">{task.title}</div>
                                      {task.description && task.description.trim() !== "" && (
                                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <StatusBadge status={task.status} />
                                </td>
                                <td className="py-4">
                                  <PriorityBadge priority={task.priority} />
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => startEditTask(task)}
                                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                      <p className="text-gray-500 mb-6">Start by creating your first task</p>
                      <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
    
  );
}