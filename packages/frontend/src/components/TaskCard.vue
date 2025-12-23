<script setup lang="ts">
import type { Task, Priority } from '@project-board/shared';
import { UI_LABELS } from '@project-board/shared';

defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'delete', id: string): void;
}>();

const priorityColors: Record<Priority, string> = {
  P0: '#dc2626',
  P1: '#ea580c',
  P2: '#2563eb',
  P3: '#6b7280',
};

function getPriorityColor(priority: Priority): string {
  return priorityColors[priority] || '#6b7280';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR');
}
</script>

<template>
  <div class="task-card" :data-priority="task.priority">
    <div class="task-header">
      <span class="task-id">{{ task.id }}</span>
      <span
        class="priority-badge"
        :style="{ backgroundColor: getPriorityColor(task.priority) }"
      >
        {{ task.priority }}
      </span>
    </div>
    <h3 class="task-title">{{ task.title }}</h3>
    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>
    <div class="task-meta">
      <span v-if="task.assignee" class="assignee">{{ task.assignee }}</span>
      <span v-if="task.dueDate" class="due-date">{{ formatDate(task.dueDate) }}</span>
    </div>
    <div class="task-actions">
      <button class="btn-edit" @click="emit('edit', task)">{{ UI_LABELS.EDIT }}</button>
      <button class="btn-delete" @click="emit('delete', task.id)">{{ UI_LABELS.DELETE }}</button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: box-shadow 0.2s, transform 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.task-card:active {
  cursor: grabbing;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-id {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.priority-badge {
  font-size: 0.7rem;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.task-title {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #1f2937;
}

.task-description {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 8px;
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.btn-edit,
.btn-delete {
  padding: 4px 8px;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-edit:hover {
  background-color: #d1d5db;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background-color: #fecaca;
}
</style>
