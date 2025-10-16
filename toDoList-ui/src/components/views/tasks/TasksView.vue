<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import Sidebar from "../sidebar.vue";
import NoTask from "@/components/ui/noTask.vue";

// ==================== ROUTER ====================
const router = useRouter();

const todos = ref([
  {id:1,title :"Tache 2",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : false , date:null},
  {id:2,title :"Tache 1",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : true , date:null},
  {id:3,title :"Tache 3",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : false , date:null}
]);

const newTodo = ref('');
const newDescription = ref('');
const notifications = ref([]);

// Computed - Compter les tâches restantes
const remaining = computed(() => todos.value.filter(t => !t.completed).length);

// Ajouter une tâche
const addTodo = () => {
  if (!newTodo.value.trim()) return; 

  const newTask = {
    id: Date.now(),
    title: newTodo.value.trim(),
    description: newDescription.value.trim(),
    completed: false,
    date: Date.now(),
  };

  todos.value.push(newTask);
  showNotification(`✨ Tâche "${newTask.title}" créée avec succès!`);
  newTodo.value = "";
  newDescription.value = "";
};

// Supprimer une tâche
const deleteTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  todos.value = todos.value.filter((t) => t.id !== id);
  showNotification(`🗑️ "${todo.title}" supprimée`);
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
   
    <div class="container mx-auto py-8 text-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
     <!-- la partie header de lapp-->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Ma To-Do List</h1>
        <p class="text-gray-600">Organisez vos tâches et restez productif</p>
      </div>  

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
          rows="2"/>
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
    
     <NoTask v-if="todos.length === 0" />
      <div v-else  class="space-y-4">
        <div class="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">
          Vous avez {{ remaining }} tâche{{ remaining > 1 ? 's' : '' }} à faire.
        </div>
        
      <ul class="space-y-2">
        <li v-for="todo in todos" :key="todo.id"
          class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="todo.completed" class="accent-blue-600" />
            <span
              :class="{
                'line-through text-gray-400': todo.completed,
                'text-gray-900 dark:text-gray-100': !todo.completed,
              }"
            >
              {{ todo.title }}
            </span>
          </label>
          <div>{{ todo.description }}</div>
          <div>
            <Button 
              variant="secondary" 
              size="sm"
              @click="editTodo(todo.id)"
              class="px-2"
            >
              ✏️
            </Button>
            <Button variant="destructive" size="sm" @click="deleteTodo(todo.id)">🗑️</Button>
          </div>
        </li>
      </ul>
      </div>

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
.completed {
  opacity : .5;
  text-decoration : line-through;
}

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