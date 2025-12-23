import type { TaskStatus, Task } from '@project-board/shared';
import { VALID_TRANSITIONS, ERROR_MESSAGES } from '@project-board/shared';
import { AppError } from '../middleware/errorHandler.js';
import { countTasksByStatusAndAssignee } from './taskService.js';

const WIP_LIMIT = 2;

// Check if a status transition is valid
export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  const validTargets = VALID_TRANSITIONS[from];
  return validTargets.includes(to);
}

// Validate status transition with business rules
export async function validateStatusTransition(
  task: Task,
  newStatus: TaskStatus,
  force: boolean = false
): Promise<{ valid: boolean; warning?: string }> {
  // Check if transition is allowed
  if (!canTransition(task.status, newStatus)) {
    throw new AppError(
      'INVALID_TRANSITION',
      ERROR_MESSAGES.INVALID_TRANSITION(task.status, newStatus),
      400
    );
  }

  // Check spec requirement for backlog -> ready
  if (task.status === 'backlog' && newStatus === 'ready') {
    if (!task.spec) {
      throw new AppError(
        'SPEC_REQUIRED',
        ERROR_MESSAGES.SPEC_REQUIRED,
        400
      );
    }
  }

  // Check WIP limit for -> in-progress
  if (newStatus === 'in-progress' && task.assignee && !force) {
    const wipCount = await countTasksByStatusAndAssignee(
      'in-progress',
      task.assignee
    );

    if (wipCount >= WIP_LIMIT) {
      return {
        valid: true,
        warning: ERROR_MESSAGES.WIP_LIMIT_WARNING(task.assignee, wipCount, WIP_LIMIT),
      };
    }
  }

  return { valid: true };
}
