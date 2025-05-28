'use client';

import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import { Calendar, Edit, Trash2, Tag } from 'lucide-react';
import { useTaskStore } from '@/lib/store';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { setSelectedTask } = useTaskStore();

  const handleStatusChange = (newStatus: Task['status']) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 flex-1"
          onClick={() => setSelectedTask(task)}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Badge className={getStatusColor(task.status)}>
          {task.status.replace('-', ' ')}
        </Badge>
        <Badge className={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
      </div>

      {task.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <Tag className="h-3 w-3 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {task.dueDate && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className="flex gap-2">
        {task.status !== 'todo' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('todo')}
            className="text-xs"
          >
            Move to Todo
          </Button>
        )}
        {task.status !== 'in-progress' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('in-progress')}
            className="text-xs"
          >
            In Progress
          </Button>
        )}
        {task.status !== 'done' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('done')}
            className="text-xs"
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
