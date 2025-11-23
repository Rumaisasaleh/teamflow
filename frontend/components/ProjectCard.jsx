"use client";
import Link from "next/link";

export default function ProjectCard({ project, isAdmin, onEdit, onDelete }) {
  return (
    <div className="bg-white border p-4 rounded shadow">
      <Link href={`/projects/${project.id}`}>
        <h2 className="font-semibold text-lg">{project.name}</h2>
      </Link>

      <p className="text-sm text-gray-600">{project.description}</p>
      <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>

      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={onEdit}>
            Edit
          </button>
          <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
