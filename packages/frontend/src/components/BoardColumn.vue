<script setup lang="ts">
import type { Task, TaskStatus } from '@project-board/shared';
import TaskCard from './TaskCard.vue';
import draggable from 'vuedraggable';

defineProps<{
  title: string;
  status: TaskStatus;
  tasks: Task[];
}>();

const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'delete', id: string): void;
  (e: 'move', taskId: string, newStatus: TaskStatus): void;
  (e: 'update:tasks', tasks: Task[]): void;
}>();

const statusColors: Record<TaskStatus, string> = {
  backlog: '#6b7280',
  ready: '#2563eb',
  'in-progress': '#ea580c',
  review: '#7c3aed',
  done: '#16a34a',
};
</script>

<template>
  <div class="board-column">
    <div class="column-header" :style="{ borderTopColor: statusColors[status] }">
      <h2>{{ title }}</h2>
      <span class="task-count">{{ tasks.length }}</span>
    </div>
    <draggable
      class="column-content"
      :list="tasks"
      group="tasks"
      item-key="id"
      :animation="200"
      ghost-class="ghost"
      @change="(evt: any) => {
        if (evt.added) {
          emit('move', evt.added.element.id, status);
        }
      }"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.board-column {
  flex: 0 0 280px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 140px);
}

.column-header {
  padding: 12px 16px;
  border-top: 3px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-header h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.task-count {
  background-color: #e5e7eb;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.column-content {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  min-height: 100px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
