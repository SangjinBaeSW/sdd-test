<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task, Priority, CreateTaskRequest } from '@project-board/shared';
import { UI_LABELS, PRIORITY_LABELS } from '@project-board/shared';

const props = defineProps<{
  task?: Task | null;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: CreateTaskRequest): void;
  (e: 'close'): void;
}>();

const title = ref('');
const description = ref('');
const priority = ref<Priority>('P2');
const assignee = ref('');
const spec = ref('');
const dueDate = ref('');

const priorities: Priority[] = ['P0', 'P1', 'P2', 'P3'];

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title;
      description.value = newTask.description || '';
      priority.value = newTask.priority;
      assignee.value = newTask.assignee || '';
      spec.value = newTask.spec || '';
      dueDate.value = newTask.dueDate?.split('T')[0] || '';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  title.value = '';
  description.value = '';
  priority.value = 'P2';
  assignee.value = '';
  spec.value = '';
  dueDate.value = '';
}

function handleSubmit() {
  if (!title.value.trim()) return;

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    priority: priority.value,
    assignee: assignee.value.trim() || undefined,
    spec: spec.value.trim() || undefined,
    dueDate: dueDate.value || undefined,
  });

  resetForm();
}

function handleClose() {
  resetForm();
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ task ? UI_LABELS.FORM_EDIT_TASK : UI_LABELS.FORM_NEW_TASK }}</h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>
      <form class="modal-body" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">{{ UI_LABELS.FORM_TITLE }} *</label>
          <input
            id="title"
            v-model="title"
            type="text"
            :placeholder="UI_LABELS.PLACEHOLDER_TITLE"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">{{ UI_LABELS.FORM_DESCRIPTION }}</label>
          <textarea
            id="description"
            v-model="description"
            :placeholder="UI_LABELS.PLACEHOLDER_DESCRIPTION"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">{{ UI_LABELS.FORM_PRIORITY }}</label>
            <select id="priority" v-model="priority">
              <option v-for="p in priorities" :key="p" :value="p">
                {{ p }} - {{ PRIORITY_LABELS[p] }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="assignee">{{ UI_LABELS.FORM_ASSIGNEE }}</label>
            <input
              id="assignee"
              v-model="assignee"
              type="text"
              :placeholder="UI_LABELS.PLACEHOLDER_ASSIGNEE"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="spec">{{ UI_LABELS.FORM_SPEC }}</label>
            <input
              id="spec"
              v-model="spec"
              type="text"
              :placeholder="UI_LABELS.PLACEHOLDER_SPEC"
            />
          </div>

          <div class="form-group">
            <label for="dueDate">{{ UI_LABELS.FORM_DUE_DATE }}</label>
            <input id="dueDate" v-model="dueDate" type="date" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="handleClose">
            {{ UI_LABELS.CANCEL }}
          </button>
          <button type="submit" class="btn-submit">
            {{ task ? UI_LABELS.UPDATE : UI_LABELS.CREATE }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.close-btn:hover {
  color: #1f2937;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #d1d5db;
}

.btn-submit {
  background-color: #2563eb;
  color: white;
}

.btn-submit:hover {
  background-color: #1d4ed8;
}
</style>
