import { ref, computed } from 'vue';
import type { SafeUser, RegisterRequest, LoginRequest } from '@project-board/shared';

const API_BASE = 'http://localhost:3000/api/auth';

// Global state
const user = ref<SafeUser | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  /**
   * Register a new user
   */
  async function register(data: RegisterRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        error.value = result.error?.message || '회원가입에 실패했습니다';
        return false;
      }

      user.value = result.data.user;
      return true;
    } catch (e) {
      error.value = '서버에 연결할 수 없습니다';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Login a user
   */
  async function login(data: LoginRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        error.value = result.error?.message || '로그인에 실패했습니다';
        return false;
      }

      user.value = result.data.user;
      return true;
    } catch (e) {
      error.value = '서버에 연결할 수 없습니다';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout the current user
   */
  async function logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore errors on logout
    } finally {
      user.value = null;
    }
  }

  /**
   * Check authentication status on app load
   */
  async function checkAuth(): Promise<void> {
    loading.value = true;

    try {
      const response = await fetch(`${API_BASE}/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        user.value = result.data.user;
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clear error message
   */
  function clearError(): void {
    error.value = null;
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
    clearError,
  };
}
