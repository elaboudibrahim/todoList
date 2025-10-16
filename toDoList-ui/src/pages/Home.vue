<script setup lang="ts">
import Sidebar from '@/components/views/sidebar.vue';
import TasksView from '@/components/views/tasks/TasksView.vue';

</script>


<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
      <Sidebar />
    </aside>

    <main class="flex-1 p-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>
