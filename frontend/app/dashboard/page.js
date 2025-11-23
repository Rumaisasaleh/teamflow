"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const projRes = await API.get("/api/projects");
        const projectsData = projRes.data || [];
        setProjects(projectsData);

        let allTasks = [];
        let status = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };

        for (const p of projectsData) {
          const taskRes = await API.get(`/api/projects/${p.id}/tasks`);
          const tasks = taskRes.data || [];
          allTasks = [...allTasks, ...tasks];

          tasks.forEach((t) => {
            if (status[t.status] !== undefined) status[t.status]++;
          });
        }

        setTotalTasks(allTasks.length);
        setStatusCounts(status);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl font-medium">
        Loading...
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-[#f5f6fa] min-h-screen font-sans">


      <h1 className="text-3xl md:text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Projects</p>
          <p className="text-4xl font-semibold mt-2 text-blue-600">{projects.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <p className="text-4xl font-semibold mt-2 text-purple-600">{totalTasks}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
          <p className="text-gray-500 text-sm mb-2">Tasks by Status</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
              TODO: <b>{statusCounts.TODO}</b>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-orange-400 rounded-full"></span>
              IN PROGRESS: <b>{statusCounts.IN_PROGRESS}</b>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
              DONE: <b>{statusCounts.DONE}</b>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>

        {projects.length === 0 && (
          <p className="text-gray-500">No projects available.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
            >
              <p className="text-lg font-medium">{p.name}</p>
              <p className="text-sm text-gray-500 mt-1">{p.description || "No description"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
