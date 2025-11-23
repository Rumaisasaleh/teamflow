"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function TaskCard({ task }) {
  const router = useRouter();
  return (
    <div
      className="p-3 bg-white rounded border cursor-pointer"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{task.title}</div>
        <div className="text-xs">{task.priority}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">Assignee: {task.assignee_id || "Unassigned"}</div>
    </div>
  );
}
