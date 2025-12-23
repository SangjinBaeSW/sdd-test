import axios from 'axios';
import type {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskQueryParams,
  ApiResponse,
} from '@project-board/shared';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all tasks
export async function fetchTasks(params?: TaskQueryParams): Promise<Task[]> {
  const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
  return response.data.data || [];
}

// Get a single task
export async function fetchTask(id: string): Promise<Task> {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data!;
}

// Create a new task
export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await api.post<ApiResponse<Task>>('/tasks', data);
  return response.data.data!;
}

// Update a task
export async function updateTask(
  id: string,
  data: UpdateTaskRequest
): Promise<Task> {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
  return response.data.data!;
}

// Update task status
export async function updateTaskStatus(
  id: string,
  data: UpdateTaskStatusRequest
): Promise<Task> {
  const response = await api.patch<ApiResponse<Task>>(
    `/tasks/${id}/status`,
    data
  );
  return response.data.data!;
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
