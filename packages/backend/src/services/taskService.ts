import { prisma } from './prisma.js';
import type {
  Task,
  TaskStatus,
  Priority,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  PRIORITY_ORDER,
} from '@project-board/shared';

// Generate next task ID (TASK-XXX format)
async function generateTaskId(): Promise<string> {
  const metadata = await prisma.metadata.findUnique({
    where: { key: 'lastTaskId' },
  });

  let nextNum = 1;
  if (metadata) {
    nextNum = parseInt(metadata.value, 10) + 1;
  }

  await prisma.metadata.upsert({
    where: { key: 'lastTaskId' },
    update: { value: String(nextNum) },
    create: { key: 'lastTaskId', value: String(nextNum) },
  });

  return `TASK-${String(nextNum).padStart(3, '0')}`;
}

// Priority order for sorting
const priorityOrder: Record<Priority, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

// Create a new task
export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const id = await generateTaskId();

  const task = await prisma.task.create({
    data: {
      id,
      title: data.title,
      description: data.description,
      priority: data.priority || 'P2',
      assignee: data.assignee,
      spec: data.spec,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: 'backlog',
    },
  });

  return mapToTask(task);
}

// Get all tasks with optional filtering
export async function getTasks(params: TaskQueryParams = {}): Promise<Task[]> {
  const where: Record<string, unknown> = {};

  if (params.status) {
    where.status = params.status;
  }
  if (params.priority) {
    where.priority = params.priority;
  }
  if (params.assignee) {
    where.assignee = params.assignee;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ priority: 'asc' }, { created: 'desc' }],
  });

  // Sort by priority order
  return tasks
    .map(mapToTask)
    .sort(
      (a, b) =>
        priorityOrder[a.priority as Priority] -
        priorityOrder[b.priority as Priority]
    );
}

// Get a single task by ID
export async function getTaskById(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  return task ? mapToTask(task) : null;
}

// Update a task
export async function updateTask(
  id: string,
  data: UpdateTaskRequest
): Promise<Task> {
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.assignee !== undefined && { assignee: data.assignee }),
      ...(data.spec !== undefined && { spec: data.spec }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });

  return mapToTask(task);
}

// Update task status
export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<Task> {
  const task = await prisma.task.update({
    where: { id },
    data: { status },
  });

  return mapToTask(task);
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  await prisma.task.delete({
    where: { id },
  });
}

// Count tasks by status and assignee (for WIP limit check)
export async function countTasksByStatusAndAssignee(
  status: TaskStatus,
  assignee: string
): Promise<number> {
  return prisma.task.count({
    where: { status, assignee },
  });
}

// Map Prisma model to Task type
function mapToTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee: string | null;
  spec: string | null;
  dueDate: Date | null;
  created: Date;
  updated: Date;
}): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    status: task.status as TaskStatus,
    priority: task.priority as Priority,
    assignee: task.assignee || undefined,
    spec: task.spec || undefined,
    dueDate: task.dueDate?.toISOString(),
    created: task.created.toISOString(),
    updated: task.updated.toISOString(),
  };
}
