export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  tags: string[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate?: string;
  projectId?: string;
  tags: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string;
  projectId?: string;
  tags?: string[];
}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  projectId?: string;
  search?: string;
}
