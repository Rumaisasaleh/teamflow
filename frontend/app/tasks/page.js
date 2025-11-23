"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { user } = useAuth();


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [assignee, setAssignee] = useState("ALL");

  
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "LOW",
    assignee_id: "",
  });

  async function loadTasks() {
    try {
      const res = await API.get("/api/tasks");
      let data = res.data || [];

      if (user.role === "MEMBER") {
        data = data.filter((t) => t.assignee_id === user.id);
      }

      setTasks(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [user]);


  useEffect(() => {
    let result = [...tasks];

    if (search.trim() !== "") {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "ALL") result = result.filter((t) => t.status === status);
    if (priority !== "ALL")
      result = result.filter((t) => t.priority === priority);
    if (assignee !== "ALL")
      result = result.filter((t) => String(t.assignee_id) === assignee);

    setFiltered(result);
  }, [search, status, priority, assignee, tasks]);

  // Create Task
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
      };

      await API.post("/api/tasks", payload);

      alert("Task created!");
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

  if (loading)
    return (
      <ProtectedRoute>
        <div className="p-6">Loading...</div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
      
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Tasks</h1>

          {/* {user.role === "ADMIN" && (
            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              + Create Task
            </button>
          )} */}
        </div>

        <div className="bg-white rounded-xl shadow p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-600">🔍 Search</label>
              <input
                className="w-full border rounded p-2 mt-1"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Priority</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Assignee ID</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="ALL">All</option>
                {[...new Set(tasks.map((t) => t.assignee_id))].map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="mt-3 text-sm text-blue-600 underline"
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setPriority("ALL");
              setAssignee("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* TASK LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <p className="text-gray-600">No tasks match your filters.</p>
          )}

          {filtered.map((t) => (
            <Link
              key={t.id}
              href={`/tasks/${t.id}`}
              className="block p-4 bg-white border rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Status: <b>{t.status}</b> • Priority: <b>{t.priority}</b>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Assignee: {t.assignee_id ? `User ${t.assignee_id}` : "Unassigned"}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/*TaSK MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create Task</h2>

            <form onSubmit={createTask} className="space-y-3">
              <input
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

              <select
                className="w-full border p-2 rounded"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
