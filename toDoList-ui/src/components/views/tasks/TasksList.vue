<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Filter } from 'lucide-vue-next';
import axios from "axios";
import AlertDelet from "@/components/ui/alertDelet.vue";
import { authStore } from "@/stores/authStore";
import { taskStore } from "@/stores/taskStore";

const router = useRouter();
const auth = authStore();
const tasks = taskStore();
const todos = ref([]);
const token = ref();
const openDeleteDialog = ref(false);
const isDeleting = ref(false);
const selectedTodoId = ref(null);
const notifications = ref([]);
const filterView = ref('all'); // 'all', 'completed', 'pending'
const sortBy = ref('date'); // 'date', 'title'

onMounted(() => {
  auth.loadUser();
  token.value = auth.token;
  fetchTask();

  // WebSocket listeners
  if (auth.token && auth.user?.id) {
    window.Echo.channel(`tasks`)
      .listen('.TaskCreated', (event) => {
        todos.value.push(event.task);
        tasks.setter(todos.value);
        showNotification(`✨ "${event.task.title}" créée!`);
      })
      .listen('TaskUpdated', (event) => {
        const index = todos.value.findIndex(t => t.id === event.task.id);
        if (index !== -1) {
          todos.value[index] = event.task;
          tasks.setter(todos.value);
          showNotification(`✏️ "${event.task.title}" mise à jour!`);
        }
      })
      .listen('TaskDeleted', (event) => {
        todos.value = todos.value.filter(t => t.id !== event.taskId);
        tasks.setter(todos.value);
        showNotification('🗑️ Tâche supprimée!');
      });
  }
});

const fetchTask = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/tasks", {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    todos.value = response.data;
    tasks.setter(todos.value);
  } catch (error) {
    console.error("Erreur API:", error);
  }
};

// Computed - Tâches filtrées et triées
const filteredTasks = computed(() => {
  let filtered = todos.value;
  
  if (filterView.value === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (filterView.value === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  }

  // Tri
  if (sortBy.value === 'title') {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return filtered;
});

const completedTasks = computed(() => todos.value.filter(t => t.completed));
const pendingTasks = computed(() => todos.value.filter(t => !t.completed));
const completionRate = computed(() => {
  if (todos.value.length === 0) return 0;
  return Math.round((completedTasks.value.length / todos.value.length) * 100);
});

const updateTodoStatus = async (todo) => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/tasks/:${todo.id}`, todo, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
  } catch (error) {
    console.error(error);
  }
};

const confirmDelete = (id) => {
  selectedTodoId.value = id;
  openDeleteDialog.value = true;
  isDeleting.value = false;
};

const cancelDelete = () => {
  openDeleteDialog.value = false;
  isDeleting.value = false;
};

const deleteTodo = async () => {
  if (!selectedTodoId.value) return;
  const id = selectedTodoId.value;
  isDeleting.value = true;
  
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/api/tasks/:${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    todos.value = todos.value.filter((t) => t.id !== id);
    tasks.setter(todos.value);
    openDeleteDialog.value = false;
    showNotification(`🗑️ "${response.data.message}"`);
  } catch (error) {
    showNotification('❌ Erreur lors de la suppression');
    console.error("Impossible de supprimer");
  } finally {
    isDeleting.value = false;
    openDeleteDialog.value = false;
  }
};

const editTodo = (id) => {
  router.push(`/task/edit/:${id}`);
};

const showNotification = (message) => {
  const id = Date.now();
  notifications.value.push({ id, message });
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};
</script>

<template>
  <div class="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- Header avec statistiques -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Mes Tâches</h1>
      <p class="text-gray-600 mb-6">Organisez et suivez votre progression</p>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-green-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total</p>
              <p class="text-3xl font-bold text-gray-900">{{ todos.length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">À faire</p>
              <p class="text-3xl font-bold text-orange-600">{{ pendingTasks.length }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Circle class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Accomplies</p>
              <p class="text-3xl font-bold text-blue-600">{{ completedTasks.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="bg-white rounded-xl shadow-sm border border-green-200 p-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progression globale</span>
          <span class="text-sm font-bold text-green-600">{{ completionRate }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
            :style="{ width: `${completionRate}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Filtres et tri -->
    <div class="bg-white rounded-xl shadow-sm border border-green-200 p-4 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-2">
          <Button
            :variant="filterView === 'all' ? 'default' : 'outline'"
            size="sm"
            @click="filterView = 'all'"
            :class="filterView === 'all' ? 'bg-green-500 hover:bg-green-600' : ''"
          >
            <Filter class="w-4 h-4 mr-2" />
            Toutes ({{ todos.length }})
          </Button>
          <Button
            :variant="filterView === 'pending' ? 'default' : 'outline'"
            size="sm"
            @click="filterView = 'pending'"
            :class="filterView === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''"
          >
            <Circle class="w-4 h-4 mr-2" />
            À faire ({{ pendingTasks.length }})
          </Button>
          <Button
            :variant="filterView === 'completed' ? 'default' : 'outline'"
            size="sm"
            @click="filterView = 'completed'"
            :class="filterView === 'completed' ? 'bg-blue-500 hover:bg-blue-600' : ''"
          >
            <CheckCircle2 class="w-4 h-4 mr-2" />
            Accomplies ({{ completedTasks.length }})
          </Button>
        </div>

        <select 
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="date">Trier par date</option>
          <option value="title">Trier par titre</option>
        </select>
      </div>
    </div>

    <!-- Liste des tâches -->
    <div class="max-w-4xl mx-auto">
      <div v-if="filteredTasks.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune tâche</h3>
        <p class="text-gray-600">
          {{ filterView === 'completed' ? 'Vous n\'avez pas encore accompli de tâches.' : 'Créez votre première tâche pour commencer.' }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <transition-group name="list">
          <div
            v-for="todo in filteredTasks"
            :key="todo.id"
            :class="[
              'bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md',
              todo.completed ? 'border-blue-200 bg-blue-50/30' : 'border-green-200'
            ]"
          >
            <div class="p-5">
              <div class="flex items-start gap-4">
                <!-- Checkbox -->
                <label class="cursor-pointer flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @change="(e) => {
                      todo.completed = e.target.checked;
                      updateTodoStatus(todo);
                    }"
                    class="w-6 h-6 accent-green-600 rounded"
                  />
                </label>

                <!-- Contenu -->
                <div class="flex-1 min-w-0">
                  <h3
                    :class="[
                      'text-lg font-semibold mb-2',
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                    ]"
                  >
                    {{ todo.title }}
                  </h3>
                  <p
                    v-if="todo.description"
                    :class="[
                      'text-sm mb-3',
                      todo.completed ? 'line-through text-gray-300' : 'text-gray-600'
                    ]"
                  >
                    {{ todo.description }}
                  </p>

                  <!-- Badge statut -->
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                        todo.completed 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      ]"
                    >
                      <component :is="todo.completed ? CheckCircle2 : Circle" class="w-3 h-3" />
                      {{ todo.completed ? 'Accomplie' : 'À faire' }}
                    </span>
                  </div>
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
                    @click="confirmDelete(todo.id)"
                    class="text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <AlertDelet
      :open="openDeleteDialog"
      :is-deleting="isDeleting"
      @cancel="cancelDelete"
      @confirm="deleteTodo"
    />

    <!-- Notifications -->
    <transition-group name="notification" tag="div" class="fixed bottom-6 right-6 space-y-3 pointer-events-none">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {{ notif.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
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
</style>