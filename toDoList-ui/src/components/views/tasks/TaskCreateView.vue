<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Edit2, 
  Plus, 
  CheckCircle2, 
  Circle 
} from 'lucide-vue-next'

// ==================== ROUTER ====================
const router = useRouter();

// ==================== STATE ====================
const todos = ref([
  { id: 1, title: "Tache 2", description: "desctoin dutask desctoin dutask", completed: false, date: new Date() },
  { id: 2, title: "Tache 1", description: "desctoin dutask desctoin dutask", completed: true, date: new Date() },
  { id: 3, title: "Tache 3", description: "desctoin dutask desctoin dutask", completed: false, date: new Date() }
]);

const newTodo = ref('');
const newDescription = ref('');
const notifications = ref([]);

// ==================== COMPUTED ====================
const remaining = computed(() => todos.value.filter(t => !t.completed).length);
const completed = computed(() => todos.value.filter(t => t.completed).length);

// ==================== HANDLERS ====================
// Ajouter une tâche
const addTodo = () => {
  if (!newTodo.value.trim()) return;

  const newTask = {
    id: Date.now(),
    title: newTodo.value.trim(),
    description: newDescription.value.trim(),
    completed: false,
    date: new Date()
  };

  todos.value.push(newTask);
  showNotification(`✨ Tâche "${newTask.title}" créée avec succès!`);
  
  newTodo.value = "";
  newDescription.value = "";
};

// Supprimer une tâche
const deleteTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  todos.value = todos.value.filter(t => t.id !== id);
  showNotification(`🗑️ "${todo.title}" supprimée`);
};

// Basculer complété
const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    showNotification(todo.completed ? `✅ "${todo.title}" complétée` : `⏳ "${todo.title}" non complétée`);
  }
};

// Rediriger vers la page d'édition avec l'ID
const editTodo = (id) => {
  router.push(`/task/edit/${id}`);
};

// Afficher notification
const showNotification = (message) => {
  const id = Date.now();
  notifications.value.push({ id, message });
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- ==================== HEADER ==================== -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Ma To-Do List</h1>
      <p class="text-gray-600">Organisez vos tâches et restez productif</p>
    </div>

    <!-- ==================== ADD TODO FORM ==================== -->
    <div class="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-8">
      <div class="space-y-4">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Titre de la tâche..."
          class="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 transition"
          @keypress.enter="addTodo"
        />
        <textarea
          v-model="newDescription"
          placeholder="Description (optionnelle)..."
          class="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 resize-none transition"
          rows="2"
        />
        <div class="flex gap-3">
          <Button 
            variant="default"
            :disabled="newTodo.length === 0"
            @click="addTodo"
            class="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus class="w-4 h-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      </div>
    </div>

   
   <!-- ==================== EMPTY STATE ==================== -->
    <div v-if="todos.length === 0" class="text-center py-16">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 class="w-8 h-8 text-green-500" />
      </div>
      <p class="text-gray-600 text-lg font-medium mb-2">Aucune tâche pour le moment</p>
      <p class="text-gray-400">Créez votre première tâche ✨</p>
    </div>

    <!-- ==================== TODOS LIST ==================== -->
    <div v-else class="space-y-4">
      <transition-group name="list" tag="div" class="space-y-4">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="bg-white rounded-lg border border-green-100 hover:shadow-md hover:border-green-300 transition-all p-4"
        >
          <!-- View Mode -->
          <div class="flex items-start gap-4">
            <!-- Checkbox -->
            <button
              @click="toggleTodo(todo.id)"
              class="mt-1 text-gray-400 hover:text-green-500 transition flex-shrink-0"
            >
              <CheckCircle2 v-if="todo.completed" class="w-6 h-6 text-green-500" />
              <Circle v-else class="w-6 h-6" />
            </button>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                :class="[
                  'font-semibold text-lg transition',
                  todo.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-900'
                ]"
              >
                {{ todo.title }}
              </p>
              <p
                v-if="todo.description"
                :class="[
                  'text-sm mt-1 transition',
                  todo.completed
                    ? 'text-gray-300'
                    : 'text-gray-600'
                ]"
              >
                {{ todo.description }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                @click="editTodo(todo.id)"
                class="text-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                <Edit2 class="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="deleteTodo(todo.id)"
                class="text-red-500 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- ==================== NOTIFICATIONS ==================== -->
    <transition-group name="notification" tag="div" class="fixed bottom-6 right-6 space-y-3 pointer-events-none">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up"
      >
        {{ notif.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>