import { useState } from "react";
import {
  useTasks,
  useDeleteTask,
  useUpdateTask,
  useCreateTask,
} from "@/lib/hooks/use-task";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFiltersComponent } from "@/components/tasks/task-filters";
import { useTaskStore } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/tasks/task-form";
import { UpdateTaskDto, Task, CreateTaskDto } from "@/lib/types";

export default function Home() {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const { data: tasksData, isLoading } = useTasks(filters);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const createTask = useCreateTask();

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    console.log("Delete task", id);
    deleteTask.mutate(id);
  };

  const handleUpdateTask = (id: string, data: UpdateTaskDto) => {
    updateTask.mutate({ id, data });
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleAddNewTask()}
        >
          Add New Task
        </button>
      </header>

      <TaskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <main className="grid gap-4">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : tasksData?.tasks.length ? (
          tasksData.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
              onStatusChange={(id, status) => handleUpdateTask(id, { status })}
            />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <TaskForm
            task={selectedTask || undefined}
            onSubmit={(taskData) => {
              if (selectedTask) {
                handleUpdateTask(selectedTask.id, taskData);
              } else {
                const createTaskData: CreateTaskDto = {
                  title: taskData.title || "",
                  description: taskData.description || "",
                  status: taskData.status || "todo",
                  priority: taskData.priority || "medium",
                  dueDate: taskData.dueDate || "",
                  tags: taskData.tags || [],
                };
                createTask.mutate(createTaskData);
              }
              setModalOpen(false);
            }}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
