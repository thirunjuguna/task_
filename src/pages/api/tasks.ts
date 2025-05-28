import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateTaskDto, Task } from '@/lib/types';
import { useTaskStore } from '@/lib/store';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tasks, setTasks } = useTaskStore.getState();

  if (req.method === 'GET') {
    console.log('GET /api/tasks called');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Current tasks:', tasks);

    try {
      const { status, priority, projectId, search } = req.query;

      console.log('Filters received:', { status, priority, projectId, search });

      let filteredTasks = [...tasks];

      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
      }
      if (projectId) {
        filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
      }
      if (search) {
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(search.toString().toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toString().toLowerCase())
        );
      }

      console.log('Filtered tasks:', filteredTasks);

      res.status(200).json({
        tasks: filteredTasks,
        total: filteredTasks.length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    console.log('POST /api/tasks called');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);

    try {
      const body: CreateTaskDto = req.body;
      console.log('Request body received:', body);

      if (!body.title?.trim()) {
        console.warn('Validation failed: Title is required');
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const newTask: Task = {
        id: Date.now().toString(),
        title: body.title,
        description: body.description,
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        dueDate: body.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId: body.projectId,
        tags: body.tags || [],
      };

      console.log('New task created:', newTask);

      tasks.push(newTask);
      console.log('Tasks after push:', tasks);

      setTasks(tasks);
      console.log('Tasks in store after setTasks:', useTaskStore.getState().tasks);

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
