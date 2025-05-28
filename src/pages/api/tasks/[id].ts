import type { NextApiRequest, NextApiResponse } from 'next';
import { UpdateTaskDto } from '@/lib/types';
import { useTaskStore } from '@/lib/store';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { setTasks, tasks } = useTaskStore.getState();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid task ID' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const task = tasks.find(t => t.id === id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const body: UpdateTaskDto = req.body;
      const taskIndex = tasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      tasks[taskIndex] = updatedTask;

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const taskIndex = tasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      tasks.splice(taskIndex, 1);
      setTasks(tasks);

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
