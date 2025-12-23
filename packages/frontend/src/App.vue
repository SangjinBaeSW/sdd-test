<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import UserMenu from './components/UserMenu.vue';
import { UI_LABELS } from '@project-board/shared';

const route = useRoute();

// Hide header on auth pages
const showHeader = computed(() => {
  return !['login', 'register'].includes(route.name as string);
});
</script>

<template>
  <div class="app">
    <header v-if="showHeader" class="header">
      <h1>{{ UI_LABELS.APP_TITLE }}</h1>
      <UserMenu />
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main {
  flex: 1;
  overflow-x: auto;
}
</style>
