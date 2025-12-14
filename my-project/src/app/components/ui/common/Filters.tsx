// // src/components/ui/common/Filters.tsx
// "use client";
// import { ChangeEvent } from "react";

// interface FiltersProps {
//   search: string;
//   status: string;
//   priority: string;
//   assignedTo: string;
//   onSearchChange: (value: string) => void;
//   onStatusChange: (value: string) => void;
//   onPriorityChange: (value: string) => void;
//   onAssignedChange: (value: string) => void;
// }

// export default function Filters(
//     {
//   search,
//   status,
//   priority,
//   assignedTo,
//   onSearchChange,
//   onStatusChange,
//   onPriorityChange,
//   onAssignedChange,
// }: FiltersProps) {
//   return (
//     <div className="flex flex-wrap gap-4 mb-4 items-center">
//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={search}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="border rounded px-3 py-2 flex-1 min-w-[200px]"
//       />

//       <select
//         value={status}
//         onChange={(e) => onStatusChange(e.target.value)}
//         className="border rounded px-3 py-2"
//       >
//         <option value="">All Status</option>
//         <option value="Active">Active</option>
//         <option value="Completed">Completed</option>
//         <option value="Pending">Pending</option>
//       </select>

//       <select
//         value={priority}
//         onChange={(e) => onPriorityChange(e.target.value)}
//         className="border rounded px-3 py-2"
//       >
//         <option value="">All Priority</option>
//         <option value="low">Low</option>
//         <option value="medium">Medium</option>
//         <option value="high">High</option>
//       </select>

//       <select
//         value={assignedTo}
//         onChange={(e) => onAssignedChange(e.target.value)}
//         className="border rounded px-3 py-2"
//       >
//         <option value="">All Users</option>
//         <option value="1">Admin</option>
//         <option value="2">Project Manager</option>
//         <option value="3">Developer</option>
//       </select>
//     </div>
//   );
// }




// src/components/ui/common/Filters.tsx
"use client";
import { Search, Filter as FilterIcon, User, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

interface FiltersProps {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAssignedChange: (value: string) => void;
}

export default function Filters({
  search,
  status,
  priority,
  assignedTo,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssignedChange,
}: FiltersProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4 p-4">
  {/* Main Search Bar */}
  <div className="relative w-1/2">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search projects by name"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-1/2 text-black pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
    />
  </div>

  {/* Filters Buttons */}
  <div className="flex items-center gap-2">
    <button
      onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-blue-100 rounded-lg transition-colors"
    >
      <FilterIcon className="h-4 w-4" />
      {isFiltersExpanded ? "Hide Filters" : "Show Filters"}
    </button>

    {(status || priority || assignedTo) && (
      <button
        onClick={() => {
          onStatusChange("");
          onPriorityChange("");
          onAssignedChange("");
        }}
        className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
      >
        Clear All
      </button>
    )}
  </div>
</div>

  

      {/* Advanced Filters - Collapsible */}
      {isFiltersExpanded && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <p className="text-xs text-gray-500">Filter by project status</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStatusChange(status === "Active" ? "" : "Active")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    status === "Active"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${status === "Active" ? "bg-blue-500" : "bg-blue-200"}`} />
                  Active
                </button>
                
                <button
                  onClick={() => onStatusChange(status === "Completed" ? "" : "Completed")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    status === "Completed"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${status === "Completed" ? "bg-emerald-500" : "bg-emerald-200"}`} />
                  Completed
                </button>
                
                <button
                  onClick={() => onStatusChange(status === "Pending" ? "" : "Pending")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    status === "Pending"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${status === "Pending" ? "bg-amber-500" : "bg-amber-200"}`} />
                  Pending
                </button>
                
                <button
                  onClick={() => onStatusChange("")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    !status
                      ? "bg-gray-100 text-gray-700 border border-gray-300"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  All Status
                </button>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <p className="text-xs text-gray-500">Filter by task priority</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onPriorityChange(priority === "high" ? "" : "high")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    priority === "high"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${priority === "high" ? "bg-red-500" : "bg-red-200"}`} />
                  High
                </button>
                
                <button
                  onClick={() => onPriorityChange(priority === "medium" ? "" : "medium")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    priority === "medium"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${priority === "medium" ? "bg-amber-500" : "bg-amber-200"}`} />
                  Medium
                </button>
                
                <button
                  onClick={() => onPriorityChange(priority === "low" ? "" : "low")}
                  className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 justify-center transition-all ${
                    priority === "low"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${priority === "low" ? "bg-blue-500" : "bg-blue-200"}`} />
                  Low
                </button>
              </div>
              
              <button
                onClick={() => onPriorityChange("")}
                className={`w-full px-3 py-2 text-sm rounded-lg transition-all ${
                  !priority
                    ? "bg-gray-100 text-gray-700 border border-gray-300"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                All Priorities
              </button>
            </div>

            {/* Assigned To Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <p className="text-xs text-gray-500">Filter by assigned team</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="all-users"
                    checked={!assignedTo}
                    onChange={() => onAssignedChange("")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="all-users" className="text-sm text-gray-700 cursor-pointer">
                    All Team Members
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="user-1"
                    checked={assignedTo === "1"}
                    onChange={() => onAssignedChange("1")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="user-1" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">A</span>
                    </div>
                    <span>Admin</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="user-2"
                    checked={assignedTo === "2"}
                    onChange={() => onAssignedChange("2")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="user-2" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-emerald-600">PM</span>
                    </div>
                    <span>Project Manager</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="user-3"
                    checked={assignedTo === "3"}
                    onChange={() => onAssignedChange("3")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="user-3" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-amber-600">D</span>
                    </div>
                    <span>Developer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(status || priority || assignedTo) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Active Filters</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {status && (
                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
                    <span>Status:</span>
                    <span className="font-medium">{status}</span>
                    <button
                      onClick={() => onStatusChange("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {priority && (
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm">
                    <span>Priority:</span>
                    <span className="font-medium capitalize">{priority}</span>
                    <button
                      onClick={() => onPriorityChange("")}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {assignedTo && (
                  <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm">
                    <span>Assigned:</span>
                    <span className="font-medium">
                      {assignedTo === "1" ? "Admin" : 
                       assignedTo === "2" ? "Project Manager" : "Developer"}
                    </span>
                    <button
                      onClick={() => onAssignedChange("")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}