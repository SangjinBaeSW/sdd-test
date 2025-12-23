// Task Status
export type TaskStatus = 'backlog' | 'ready' | 'in-progress' | 'review' | 'done';

// Priority
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

// User Interface
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// User without password (for API responses)
export type SafeUser = Omit<User, 'password'>;

// Task Interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  spec?: string;
  dueDate?: string;
  created: string;
  updated: string;
  createdById?: string;
  createdBy?: SafeUser;
  assigneeId?: string;
  assigneeUser?: SafeUser;
}

// API Request Types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  assignee?: string;
  spec?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  assignee?: string;
  spec?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
  force?: boolean; // WIP 제한 무시 옵션
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Query Parameters
export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: Priority;
  assignee?: string;
}

// Status Transition
export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  backlog: ['ready'],
  ready: ['backlog', 'in-progress'],
  'in-progress': ['review'],
  review: ['in-progress', 'done'],
  done: ['in-progress'],
};

// Priority Order (for sorting)
export const PRIORITY_ORDER: Record<Priority, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

// Auth Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface AuthResponse {
  user: SafeUser;
}
