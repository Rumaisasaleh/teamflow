"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../components/AuthProvider";

export default function TaskDetail() {
  const params = useParams();
  const taskId = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/api/tasks/${taskId}`);
        setTask(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load task");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [taskId]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: task.title, description: task.description, status: task.status, priority: task.priority, assignee_id: task.assignee_id };
      await API.put(`/api/tasks/${task.id}`, payload);
      alert("Saved");
      router.back();
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ProtectedRoute><div>Loading...</div></ProtectedRoute>;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Task Detail</h2>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input value={task.title} onChange={(e)=>setTask({...task,title:e.target.value})} className="w-full border p-2 rounded" disabled={user.role === "MEMBER" && task.assignee_id !== user.id} />
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea value={task.description} onChange={(e)=>setTask({...task,description:e.target.value})} className="w-full border p-2 rounded" disabled={user.role === "MEMBER" && task.assignee_id !== user.id} />
          </div>

          <div className="flex gap-3">
            <div>
              <label className="block text-sm">Status</label>
              <select value={task.status} onChange={(e)=>setTask({...task,status:e.target.value})} className="border p-2 rounded">
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Priority</label>
              <select value={task.priority} onChange={(e)=>setTask({...task,priority:e.target.value})} className="border p-2 rounded" >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Assignee (ID)</label>
              <input value={task.assignee_id || ""} onChange={(e)=>setTask({...task,assignee_id: e.target.value ? Number(e.target.value) : null})} className="border p-2 rounded w-28" />
            </div>
          </div>

          <div className="flex gap-3">
            <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
