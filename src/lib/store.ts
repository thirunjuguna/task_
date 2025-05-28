import { create } from 'zustand';
import { Task, TaskFilters } from '@/lib/types';

interface TaskStore {
  selectedTask: Task | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  filters: TaskFilters;
  tasks: Task[];
  
  setSelectedTask: (task: Task | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  filters: {},
  tasks: [],
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setEditModalOpen: (open) => set({ isEditModalOpen: open }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  setTasks: (tasks) => set({ tasks }),
}));
