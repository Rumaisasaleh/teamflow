"use client";
import React, { useEffect, useState } from "react";
import API from "../../lib/api";
import ProjectCard from "../../components/ProjectCard";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", status: "PLANNED" });


  const [editModal, setEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete 
  const [deleteId, setDeleteId] = useState(null);

  // all Projects
  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Create project
  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await API.post("/api/projects", form);
      setProjects([res.data, ...projects]);
      setForm({ name: "", description: "", status: "PLANNED" });
    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }
// MODal
  function openEditModal(project) {
    setEditProject(project);
    setEditModal(true);
  }

  // Save 
  async function saveEdit(e) {
    e.preventDefault();
    setSavingEdit(true);

    try {
      const res = await API.put(`/api/projects/${editProject.id}`, editProject);
      setProjects(projects.map((p) => (p.id === editProject.id ? res.data : p)));
      setEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    } finally {
      setSavingEdit(false);
    }
  }

  // Delete
  async function deleteProject() {
    if (!deleteId) return;

    try {
      await API.delete(`/api/projects/${deleteId}`);
      setProjects(projects.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Projects</h1>

        {/* CREATE PROJECT */}
        {user?.role === "ADMIN" && (
          <form
            onSubmit={handleCreate}
            className="mb-6 bg-white p-4 rounded shadow space-y-3"
          >
            <h3 className="font-medium">Create Project</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option>PLANNED</option>
              <option>ACTIVE</option>
              <option>COMPLETED</option>
            </select>

            <button
              disabled={creating}
              className="px-4 py-2 ms-5 bg-blue-600 text-white rounded"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        {/* PROJECT */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="relative">
                <ProjectCard project={p} />

                {user.role === "ADMIN" && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Edit Project</h2>

            <form onSubmit={saveEdit} className="space-y-3">
              <input
                value={editProject.name}
                onChange={(e) =>
                  setEditProject({ ...editProject, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <textarea
                value={editProject.description}
                onChange={(e) =>
                  setEditProject({
                    ...editProject,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <select
                value={editProject.status}
                onChange={(e) =>
                  setEditProject({ ...editProject, status: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option>PLANNED</option>
                <option>ACTIVE</option>
                <option>COMPLETED</option>
              </select>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-semibold">Delete Project?</h3>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={deleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
