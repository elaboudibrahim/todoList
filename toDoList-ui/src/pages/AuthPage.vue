<script setup lang="ts">
import LoginForm from '@/components/views/auth/LoginForm.vue';
import Register from '@/components/views/auth/Register.vue';

</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      <h1 class="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
        Connexion / Inscription
      </h1>

      <LoginForm />
      <Register />

    </div>
  </div>
</template>