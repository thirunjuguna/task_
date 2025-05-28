import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters } from '@/lib/types';

const API_BASE = '/api';

export class TasksAPI {
  static async getTasks(filters?: TaskFilters): Promise<{ tasks: Task[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.search) params.append('search', filters.search);
    
    const url = `${API_BASE}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Constructed API URL:', url);
    
    const response = await fetch(url);
    console.log('API Response:', response);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    return response.json();
  }

  static async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }
    
    return response.json();
  }

  static async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task');
    }
    
    return response.json();
  }

  static async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete task');
    }
  }
}
