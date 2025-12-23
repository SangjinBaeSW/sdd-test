<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { AUTH_LABELS } from '@project-board/shared';

const router = useRouter();
const { login, loading, error, clearError } = useAuth();

const email = ref('');
const password = ref('');

async function handleSubmit() {
  clearError();
  const success = await login({ email: email.value, password: password.value });
  if (success) {
    router.push('/');
  }
}

function goToRegister() {
  router.push('/register');
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>{{ AUTH_LABELS.LOGIN_TITLE }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">{{ AUTH_LABELS.EMAIL }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="AUTH_LABELS.PLACEHOLDER_EMAIL"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">{{ AUTH_LABELS.PASSWORD }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="AUTH_LABELS.PLACEHOLDER_PASSWORD"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '...' : AUTH_LABELS.LOGIN }}
        </button>
      </form>

      <div class="auth-footer">
        <span>{{ AUTH_LABELS.NO_ACCOUNT }}</span>
        <button type="button" class="link-btn" @click="goToRegister">
          {{ AUTH_LABELS.REGISTER }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 8px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-card h1 {
  margin: 0 0 24px;
  font-size: 24px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90d9;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #357abd;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.link-btn:hover {
  color: #357abd;
}
</style>
