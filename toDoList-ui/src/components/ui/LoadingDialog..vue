<script setup>
import { Loader2 } from 'lucide-vue-next';


const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  message: {
    type: String,
    default: 'Chargement en cours...',
  },
  size: {
    type: String,
    default: 'medium', 
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
});

// classes CSS selon la taille
const spinnerSizeClasses = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
};
</script>

<template>
  <!-- Overlay qui bloque toute l'application -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="() => {}"
      >
        <!-- Boîte de dialogue centrée -->
        <div
          class="relative flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-title"
        >
          <!-- Spinner animé -->
          <Loader2 
            :class="[
              spinnerSizeClasses[size],
              'animate-spin text-green-500'
            ]"/>
          
          <p id="loading-title"
            class="text-center text-lg font-medium text-gray-700">
            {{ message }}
          </p>

          <div class="flex gap-1">
            <span class="animate-bounce animation-delay-0 h-2 w-2 rounded-full bg-green-500"></span>
            <span class="animate-bounce animation-delay-200 h-2 w-2 rounded-full bg-green-500"></span>
            <span class="animate-bounce animation-delay-400 h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animation-delay-0 {
  animation-delay: 0ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

/* Empêcher le scroll quand le dialogue est ouvert */
body:has([role="dialog"]) {
  overflow: hidden;
}
</style>