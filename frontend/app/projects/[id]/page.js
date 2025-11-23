"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import KanbanBoard from "../../../components/KanbanBoard";
import { useAuth } from "../../../components/AuthProvider";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id;

  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
  });

  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "LOW",
    assignee_id: "",
  });

  async function loadProject() {
    try {
      const res = await API.get("/api/projects");
      const found = res.data.find((p) => String(p.id) === String(projectId));
      setProject(found || { id: projectId, name: "Project" });
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTasks() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filters.search) q.set("search", filters.search);
      if (filters.status) q.set("status", filters.status);
      if (filters.priority) q.set("priority", filters.priority);
      if (filters.assignee) q.set("assignee", filters.assignee);

      const url =
        `/api/projects/${projectId}/tasks` + (q.toString() ? `?${q}` : "");
      const res = await API.get(url);

      const ts = res.data || [];
      setTasks(ts);

      const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
      ts.forEach((t) => {
        grouped[t.status].push(t);
      });

      setColumns(grouped);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [filters]);


  async function createTask(e) {
    e.preventDefault();
    setCreating(true);

    try {
    const payload = {
    title: form.title,
    description: form.description,
    status: form.status,
    priority: form.priority,
    assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
    project_id: Number(projectId)   
    };

      await API.post(`/api/projects/${projectId}/tasks`, payload);


      setOpenModal(false);

      setForm({
        title: "",
        description: "",
        status: "TODO",
        priority: "LOW",
        assignee_id: "",
      });

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">
            {project ? project.name : "Project"}
          </h1>

          {user?.role === "ADMIN" &&  (
            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              + Create Task
            </button>
          )}
        </div>


        <div className="mb-4 p-4 bg-white rounded shadow">
          <div className="flex gap-3">
            <input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">All status</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">All priority</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <input
              placeholder="Assignee ID"
              value={filters.assignee}
              onChange={(e) =>
                setFilters({ ...filters, assignee: e.target.value })
              }
              className="border p-2 rounded w-32"
            />

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  priority: "",
                  assignee: "",
                })
              }
              className="px-3 rounded border"
            >
              Clear
            </button>
          </div>
        </div>

        {/* KANBAN */}
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <KanbanBoard projectId={projectId} initialColumns={columns} />
        )}
      </div>


      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create Task</h2>

            <form onSubmit={createTask} className="space-y-3">
              <input
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

              <select
                className="w-full border p-2 rounded"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              <input
                placeholder="Assignee ID (optional)"
                className="w-full border p-2 rounded"
                value={form.assignee_id}
                onChange={(e) =>
                  setForm({ ...form, assignee_id: e.target.value })
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {creating ? "Creating..." : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
