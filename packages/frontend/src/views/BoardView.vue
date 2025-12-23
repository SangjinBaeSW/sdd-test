<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Task, TaskStatus, CreateTaskRequest } from '@project-board/shared';
import { STATUS_LABELS, UI_LABELS } from '@project-board/shared';
import BoardColumn from '../components/BoardColumn.vue';
import TaskForm from '../components/TaskForm.vue';
import {
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../api/taskApi';

const tasks = ref<Task[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showForm = ref(false);
const editingTask = ref<Task | null>(null);

const columns: { title: string; status: TaskStatus }[] = [
  { title: STATUS_LABELS.backlog, status: 'backlog' },
  { title: STATUS_LABELS.ready, status: 'ready' },
  { title: STATUS_LABELS['in-progress'], status: 'in-progress' },
  { title: STATUS_LABELS.review, status: 'review' },
  { title: STATUS_LABELS.done, status: 'done' },
];

const tasksByStatus = computed(() => {
  const result: Record<TaskStatus, Task[]> = {
    backlog: [],
    ready: [],
    'in-progress': [],
    review: [],
    done: [],
  };

  for (const task of tasks.value) {
    result[task.status].push(task);
  }

  return result;
});

async function loadTasks() {
  try {
    loading.value = true;
    error.value = null;
    tasks.value = await fetchTasks();
  } catch (e) {
    error.value = UI_LABELS.ERROR_LOAD;
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function handleCreateOrUpdate(data: CreateTaskRequest) {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, data);
    } else {
      await createTask(data);
    }
    await loadTasks();
    showForm.value = false;
    editingTask.value = null;
  } catch (e) {
    console.error('Failed to save task:', e);
    alert(UI_LABELS.ERROR_SAVE);
  }
}

async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
  try {
    await updateTaskStatus(taskId, { status: newStatus });
    await loadTasks();
  } catch (e: any) {
    console.error('Failed to update status:', e);
    const message = e.response?.data?.error?.message || UI_LABELS.ERROR_STATUS;
    alert(message);
    await loadTasks();
  }
}

async function handleDelete(taskId: string) {
  if (!confirm(UI_LABELS.CONFIRM_DELETE)) return;

  try {
    await deleteTask(taskId);
    await loadTasks();
  } catch (e) {
    console.error('Failed to delete task:', e);
    alert(UI_LABELS.ERROR_DELETE);
  }
}

function handleEdit(task: Task) {
  editingTask.value = task;
  showForm.value = true;
}

function openNewTaskForm() {
  editingTask.value = null;
  showForm.value = true;
}

onMounted(loadTasks);
</script>

<template>
  <div class="board-view">
    <div class="board-toolbar">
      <button class="btn-new-task" @click="openNewTaskForm">
        {{ UI_LABELS.NEW_TASK }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ UI_LABELS.LOADING }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="board">
      <BoardColumn
        v-for="col in columns"
        :key="col.status"
        :title="col.title"
        :status="col.status"
        :tasks="tasksByStatus[col.status]"
        @edit="handleEdit"
        @delete="handleDelete"
        @move="handleStatusChange"
      />
    </div>

    <TaskForm
      :show="showForm"
      :task="editingTask"
      @submit="handleCreateOrUpdate"
      @close="showForm = false; editingTask = null"
    />
  </div>
</template>

<style scoped>
.board-view {
  height: 100%;
}

.board-toolbar {
  margin-bottom: 16px;
}

.btn-new-task {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-new-task:hover {
  background-color: #1d4ed8;
}

.board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.error {
  color: #dc2626;
}
</style>
