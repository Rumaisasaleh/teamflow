"use client";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import API from "../lib/api";
import TaskCard from "./TaskCard";

function SortableItem({ id, task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <TaskCard task={task} />
    </div>
  );
}

export default function KanbanBoard({ projectId, initialColumns }) {

    const [columns, setColumns] = useState(initialColumns || { TODO: [], IN_PROGRESS: [], DONE: [] });
    const [saving, setSaving] = useState(false);

  useEffect(() => setColumns(initialColumns || { TODO: [], IN_PROGRESS: [], DONE: [] }), [initialColumns]);

  const sensors = useSensors(useSensor(PointerSensor));

  function findContainer(id) {
    for (const col of ["TODO", "IN_PROGRESS", "DONE"]) {
      if (columns[col].some((t) => `task-${t.id}` === id)) return col;
    }
    return null;
  }

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const fromCol = findContainer(activeId);
    const toCol = findContainer(overId);

    if (!fromCol || !toCol) return;

    if (fromCol !== toCol) {
      const order = ["TODO", "IN_PROGRESS", "DONE"];
      const fromIdx = order.indexOf(fromCol);
      const toIdx = order.indexOf(toCol);
      if (toIdx < fromIdx) {
        alert("Backward movement not allowed (DONE -> IN_PROGRESS/TODO is invalid).");
        return;
      }
    }

    const activeTask = columns[fromCol].find((t) => `task-${t.id}` === activeId);
    if (!activeTask) return;

    const newFrom = columns[fromCol].filter((t) => `task-${t.id}` !== activeId);

    const newTo = [ { ...activeTask, status: toCol }, ...columns[toCol].filter((t) => `task-${t.id}` !== activeId ) ];

    const newCols = { ...columns, [fromCol]: newFrom, [toCol]: newTo };
    setColumns(newCols);

    try {
      setSaving(true);
      await API.put(`/api/tasks/${activeTask.id}`, {
        ...activeTask,
        status: toCol
      });

      const patchPromises = [];
      for (const col of [toCol, fromCol]) {
        for (let i = 0; i < newCols[col].length; i++) {
          const t = newCols[col][i];
          patchPromises.push(API.patch(`/api/tasks/${t.id}/position`, { position: i }));

        }
      }
      await Promise.all(patchPromises);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {saving && <div className="p-2 text-sm text-gray-600">Saving...</div>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {["TODO", "IN_PROGRESS", "DONE"].map((col) => (
            <div key={col} className="bg-gray-50 p-3 rounded">
              <h4 className="font-semibold mb-2">{col.replace("_", " ")}</h4>
              <SortableContext items={columns[col].map((t) => `task-${t.id}`)} strategy={verticalListSortingStrategy}>
                {columns[col].map((task) => (
                  <SortableItem key={task.id} id={`task-${task.id}`} task={task} />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
