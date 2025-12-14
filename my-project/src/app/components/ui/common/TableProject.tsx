"use client";

import { useState } from "react";
import { useProjects, useUpdateProject } from "../../../components/hooks/useProject";
import { useRouter } from "next/navigation";
import { Project, ProjectStatus } from "../../../types/projects";
import { 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  PauseCircle, 
  AlertCircle 
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface TableProjectsProps {
  filters?: {
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
  };
}

// Colors and configurations for statuses
const statusConfig = {
  Completed: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-700", 
    icon: CheckCircle 
  },
  Active: { 
    bg: "bg-blue-50", 
    text: "text-blue-700", 
    icon: TrendingUp 
  },
  Pending: { 
    bg: "bg-amber-50", 
    text: "text-amber-700", 
    icon: Clock 
  },
  OnHold: { 
    bg: "bg-gray-50", 
    text: "text-gray-700", 
    icon: PauseCircle 
  },
  Critical: { 
    bg: "bg-rose-50", 
    text: "text-rose-700", 
    icon: AlertCircle 
  }
};

export default function TableProjects({ filters }: TableProjectsProps) {
  // Component states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<null | string>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  
  const router = useRouter();
  const { search, status, priority, assignedTo } = filters || {};
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Edit permissions
  const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

  // Fetch projects data
  const { data, isLoading, isFetching } = useProjects({
    page,
    limit,
    sortBy: sortBy ?? undefined,
    order,
    search,
    status,
    priority,
    assignedTo,
  });

  const projects: Project[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Project update mutation
  const updateMutation = useUpdateProject();

  // Sorting function
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  // Row click handler
  const handleRowClick = (e: React.MouseEvent, id: string) => {
    if (!canEdit) return;
    if (!(e.target as HTMLElement).closest('input') && 
        !(e.target as HTMLElement).closest('select')) {
      router.push(`/dashboard/projects/${id}`);
    }
  };

  // Update project field
const handleUpdateField = <K extends keyof Project>(
  id: string,
  field: K,
  value: Project[K]  
) => {
  updateMutation.mutate({
    id,
    patch: { [field]: value },
  });
};


  // Date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "Active").length,
    completed: projects.filter(p => p.status === "Completed").length,
    pending: projects.filter(p => p.status === "Pending").length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    avgProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) 
      : 0
  };

  // Loading display
  if (isLoading) {
    return (
      <div className="p-6 text-gray-600 animate-pulse">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user?.role === "Developer" ? (
  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-xl shadow-lg">
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    Developer Dashboard
  </div>
) : (
  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-lg">
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-3-3v6m8 3H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 3h6l2-3h4a2 2 0 012 2v10a2 2 0 01-2 2z"
      />
    </svg>
    Project Task Management
  </div>
)}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {/* Total Projects */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-1">All projects</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                <span className="font-semibold text-blue-600">P</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.total > 0 
                  ? `${Math.round((stats.active / stats.total) * 100)}% of total`
                  : "0%"
                }
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.total > 0 
                  ? `${Math.round((stats.completed / stats.total) * 100)}% of total`
                  : "0%"
                }
              </p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Total Budget */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalBudget)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Average: {formatCurrency(stats.total > 0 ? stats.totalBudget / stats.total : 0)}
              </p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional cards if there's enough data */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Average Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <p className="text-sm text-gray-500">Average Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.avgProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Projects */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.total > 0 
                    ? `${Math.round((stats.pending / stats.total) * 100)}% of total`
                    : "0%"
                  }
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main title */}
      <div className="px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Projects List</h2>
          {isFetching && (
            <div className="text-sm text-blue-600 animate-pulse">
              Updating...
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Showing {stats.total} projects • Click any row to view details
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th 
                label="Project" 
                sortKey="name" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("name")} 
              />
              <Th 
                label="Status" 
                sortKey="status" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("status")} 
              />
              <Th 
                label="Start Date" 
                sortKey="startDate" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("startDate")} 
              />
              <Th 
                label="End Date" 
                sortKey="endDate" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("endDate")} 
              />
              <Th 
                label="Progress" 
                sortKey="progress" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("progress")} 
              />
              <Th 
                label="Budget" 
                sortKey="budget" 
                sortBy={sortBy} 
                order={order} 
                onClick={() => handleSort("budget")} 
              />
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => {
              const StatusIcon = statusConfig[project.status as keyof typeof statusConfig]?.icon || Clock;
              
              return (
                <tr 
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={(e) => handleRowClick(e, project.id)}
                >
                  {/* Project Name */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <span className="font-semibold text-blue-600 text-sm">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={project.name}
                          disabled={!canEdit}
                          className={`w-full bg-transparent border border-transparent text-sm ${
                            canEdit 
                              ? "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                              : "cursor-not-allowed opacity-50"
                          } rounded px-2 py-1 transition-colors`}
                          onChange={(e) => handleUpdateField(project.id, "name", e.target.value)}
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={project.status}
                        disabled={!canEdit}
                        className={`w-full text-sm px-2 py-1 rounded transition-colors ${
                          canEdit 
                            ? `${statusConfig[project.status as keyof typeof statusConfig]?.bg} ${statusConfig[project.status as keyof typeof statusConfig]?.text} hover:brightness-95`
                            : "opacity-50 cursor-not-allowed"
                        }`}
onChange={(e) => 
  handleUpdateField(
    project.id,
    "status",
    e.target.value as ProjectStatus // نوع مؤكد
  )
}
                      >
                        {Object.keys(statusConfig).map((status) => {
                          const Icon = statusConfig[status as keyof typeof statusConfig]?.icon;
                          return (
                            <option key={status} value={status} className="flex items-center gap-2">
                              {Icon && <Icon className="h-4 w-4" />}
                              {status}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="date"
                        value={project.startDate}
                        disabled={!canEdit}
                        className={`w-full text-sm px-2 py-1 rounded transition-colors ${
                          canEdit 
                            ? "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onChange={(e) => handleUpdateField(project.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4">
                      {formatDate(project.startDate)}
                    </div>
                  </td>

                  {/* End Date */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="date"
                        value={project.endDate}
                        disabled={!canEdit}
                        className={`w-full text-sm px-2 py-1 rounded transition-colors ${
                          canEdit 
                            ? "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onChange={(e) => handleUpdateField(project.id, "endDate", e.target.value)}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4">
                      {formatDate(project.endDate)}
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="px-3 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={project.progress}
                          disabled={!canEdit}
                          className={`w-16 text-sm px-2 py-1 rounded transition-colors ${
                            canEdit 
                              ? "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onChange={(e) => handleUpdateField(project.id, "progress", Number(e.target.value))}
                          onFocus={(e) => e.target.select()}
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            project.progress < 30 ? "bg-red-500" :
                            project.progress < 70 ? "bg-amber-500" :
                            "bg-emerald-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="number"
                        value={project.budget}
                        disabled={!canEdit}
                        className={`w-full text-sm px-2 py-1 rounded transition-colors ${
                          canEdit 
                            ? "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onChange={(e) => handleUpdateField(project.id, "budget", Number(e.target.value))}
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4">
                      {formatCurrency(project.budget)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700">Show</div>
              <select
                className="border border-gray-300 rounded px-2 py-1.5 text-sm hover:border-gray-400 transition-colors"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <div className="text-sm text-gray-700">entries</div>
            </div>
            
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{((page - 1) * limit) + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(page * limit, total)}</span> of{" "}
              <span className="font-semibold">{total}</span> projects
            </div>
            
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm transition-colors"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNum = page - 2 + i;
                  }
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm transition-colors"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table Header Component
interface ThProps {
  label: string;
  sortKey: string;
  sortBy: string | null;
  order: "asc" | "desc";
  onClick: () => void;
}

function Th({ label, sortKey, sortBy, order, onClick }: ThProps) {
  return (
    <th 
      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortBy === sortKey && (
          order === "asc" 
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );
}