<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { AUTH_LABELS } from '@project-board/shared';

const router = useRouter();
const { user, isAuthenticated, logout } = useAuth();

async function handleLogout() {
  await logout();
  router.push('/');
}

function goToLogin() {
  router.push('/login');
}

function goToRegister() {
  router.push('/register');
}
</script>

<template>
  <div class="user-menu">
    <template v-if="isAuthenticated">
      <span class="user-name">{{ user?.name || user?.email }}</span>
      <button class="logout-btn" @click="handleLogout">
        {{ AUTH_LABELS.LOGOUT }}
      </button>
    </template>
    <template v-else>
      <button class="auth-btn login" @click="goToLogin">
        {{ AUTH_LABELS.LOGIN }}
      </button>
      <button class="auth-btn register" @click="goToRegister">
        {{ AUTH_LABELS.REGISTER }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  color: #666;
  font-size: 14px;
}

.logout-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #eee;
  color: #333;
}

.auth-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.auth-btn.login {
  background: #4a90d9;
  color: white;
}

.auth-btn.login:hover {
  background: #357abd;
}

.auth-btn.register {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.auth-btn.register:hover {
  background: #eee;
  color: #333;
}
</style>
