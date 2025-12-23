import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type {
  TaskStatus,
  Priority,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskQueryParams,
} from '@project-board/shared';
import { ERROR_MESSAGES } from '@project-board/shared';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../services/taskService.js';
import { validateStatusTransition } from '../services/statusTransition.js';
import { AppError } from '../middleware/errorHandler.js';

export const taskRouter = Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  assignee: z.string().optional(),
  spec: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  assignee: z.string().optional(),
  spec: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['backlog', 'ready', 'in-progress', 'review', 'done']),
  force: z.boolean().optional(),
});

// Async handler wrapper
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// POST /api/tasks - Create a new task
taskRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createTaskSchema.parse(req.body) as CreateTaskRequest;
    const task = await createTask(data);

    res.status(201).json({
      success: true,
      data: task,
    });
  })
);

// GET /api/tasks - Get all tasks
taskRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const params: TaskQueryParams = {
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as Priority | undefined,
      assignee: req.query.assignee as string | undefined,
    };

    const tasks = await getTasks(params);

    res.json({
      success: true,
      data: tasks,
    });
  })
);

// GET /api/tasks/:id - Get a single task
taskRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await getTaskById(req.params.id);

    if (!task) {
      throw new AppError('NOT_FOUND', ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

// PATCH /api/tasks/:id - Update a task
taskRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await getTaskById(req.params.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const data = updateTaskSchema.parse(req.body) as UpdateTaskRequest;
    const task = await updateTask(req.params.id, data);

    res.json({
      success: true,
      data: task,
    });
  })
);

// DELETE /api/tasks/:id - Delete a task
taskRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await getTaskById(req.params.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', ERROR_MESSAGES.NOT_FOUND, 404);
    }

    await deleteTask(req.params.id);

    res.json({
      success: true,
      data: { id: req.params.id, deleted: true },
    });
  })
);

// PATCH /api/tasks/:id/status - Update task status
taskRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const existing = await getTaskById(req.params.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const data = updateStatusSchema.parse(
      req.body
    ) as UpdateTaskStatusRequest;
    const { valid, warning } = await validateStatusTransition(
      existing,
      data.status,
      data.force
    );

    const task = await updateTaskStatus(req.params.id, data.status);

    res.json({
      success: true,
      data: task,
      ...(warning && { warning }),
    });
  })
);
