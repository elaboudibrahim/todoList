<script setup>
import { ref } from "vue";
import { Button } from '@/components/ui/button'
import Sidebar from "../sidebar.vue";
import { description } from "../auth/Register.vue";

const todos = ref([
  {id:1,title :"Tache 2",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : false , date:null},
  {id:2,title :"Tache 1",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : true , date:null},
  {id:3,title :"Tache 3",description:"desctoin dutask desctoin dutask desctoin dutask desctoin dutask ", completed : false , date:null}
]);

const newTodo = ref('');


const deleteTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  todos.value = todos.value.filter((t) => t.id !== id);
  showNotification(` "${todo.title}" supprimée`);
};

// Compter les tâches restantes
const remaining = computed(() => todos.value.filter(t => !t.completed).length);
// Ajouter une tâche
const addTodo = () => {
  if (!newTodo.value.trim()) return; 

  const newTask = {
    id: Date.now(),
    title: newTodo.value.trim(),
    description: "",
    completed: false,
    date: Date.now(),
  };

  todos.value.push(newTask);
  showNotification(` Tâche "${newTask.title}" créée avec succès!`);
  newTodo.value = "";
};




// Afficher notification
const notifications = ref([]);
const showNotification = (message) => {
  const id = Date.now();
  notifications.value.push({ id, message });
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};
</script>
<template>
   
    <div class="container mx-auto py-8 text-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
         Ma To-Do List
        </h1>

      <form action="Post" @Submit.prevent="saveTodo"  class="flex gap-2">
         <input
          v-model="newTodo"
          type="text"
          placeholder="Nouvelle tâche..."
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
          />
          <Button  variant="default" :disabled="newTodo.length === 0"
                   @click="addTodo">Ajouter</Button> 

      </form>
      <div v-if="todos.length === 0" class="text-center text-gray-500">
      Vous n'avez aucune tâche à faire !
      </div>
      <div v-else>
        <div class="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">
          Vous avez {{ remaining }} tâche{{ remaining > 1 ? 's' : '' }} à faire.
        </div>
        
      <ul class="space-y-2">
        <li v-for="todo in todos":key="todo.date"
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
            <RouterLink to="/task/edit" class="px-2">
            <Button variant="secondary" size="sm">✏️</Button>
            </RouterLink>  
            <Button variant="destructive" size="sm" @click="deleteTodo(todo.id)">🗑️</Button>
          </div>
        </li>
      </ul>

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
