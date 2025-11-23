"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="cursor-pointer p-4 bg-white rounded shadow-sm hover:shadow-md transition"
    >
      <h3 className="font-semibold">{project.name}</h3>
      <p className="text-sm text-gray-500">{project.description}</p>
      <div className="mt-2 text-xs text-gray-600">Status: {project.status}</div>
    </div>
  );
}
