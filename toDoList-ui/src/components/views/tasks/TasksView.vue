<script setup>
import { ref, computed, onMounted,onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-vue-next'
import NoTask from "@/components/ui/noTask.vue";
import axios from "axios";
import AlertDelet from "@/components/ui/alertDelet.vue";
import { authStore } from "@/stores/authStore";
import { taskStore } from "@/stores/taskStore";

const router = useRouter();
const todos = ref([]);
const newTodo = ref('');
const newDescription = ref('');
const notifications = ref([]);
const openDeleteDialog = ref(false);
const isDeleting = ref(false);
const selectedTodoId = ref(null); 
const auth=authStore();
const tasks= taskStore();
onMounted(async ()=>{
  auth.loadUser();

  const response =await tasks.fetchTask(auth.token);
  todos.value=response.data;


   if (auth.token && auth.user?.id) {
        window.Echo.channel(`tasks`)
      .listen('.TaskCreated', (event) => {
      //  todos.value.push(event.task);
        tasks.setter(todos.value);
        showNotification(`${event.user} a créé une nouvelle tache!`);
      })
      .listen('.TaskUpdated', (event) => {
        const index = todos.value.findIndex(t => t.id === event.task.id);
        if (index !== -1) {
          todos.value[index] = event.task;
          tasks.setter(todos.value);
          showNotification(`${event.user} a modifie la tache ${event.taask.id} `);
        }
      }) 
      .listen('TaskDeleted', (event) => {
        console.log('WebSocket - Tâche supprimée:', event.taskId);
        todos.value = todos.value.filter(t => t.id !== event.taskId);
        tasks.setter(todos.value);
        showNotification(`${event.task.id} a supprime la tache ${event.task.id}`); 
      });
    }
});


// onBeforeUnmount(() => {
//   if (auth.user?.id) {
//     window.Echo.leave(`tasks`);
//   }
// });


// Computed - Compter les tâches restantes
const remaining = computed(()=>tasks.countRemains)

const addTodo = async () => {
  if (!newTodo.value.trim()) return; 
  const newTask = {
    user_id:auth.user.id,
    title: newTodo.value.trim(),
    description:newDescription.value.trim(),
    completed: false,
  };
  const response = await tasks.addTodo(newTask, auth.token);
  showNotification(`${response.message}`);
  newTodo.value = "";
  newDescription.value = "";
  };

//ouvrir la boite de dialog delete
const confirmDelete = (id) => {
  selectedTodoId.value = id;  
  openDeleteDialog.value=true;
  isDeleting.value = false;

};
// annuler la suppression
const cancelDelete = () => {
  openDeleteDialog.value=false;
  isDeleting.value = false;

};

const deleteTodo = async () => {
    if (!selectedTodoId.value) return;  
    const id = selectedTodoId.value;
    isDeleting.value = true;
    const response = await tasks.deleteTask(id, auth.token);
    showNotification(response.message)
  
    todos.value = todos.value.filter((t) => t.id !== id);
    openDeleteDialog.value=false
  
    isDeleting.value = false;
    openDeleteDialog.value = false;
    selectedTodoId.value = null;
};

// Rediriger vers la page d'édition avec l'ID
const editTodo = (id) => {
  router.push(`/task/edit/:${id}`);
};

const updateTodoStatus=async (todo)=>{
  const response = await tasks.updateTodo(todo.id, todo, auth.token);
  showNotification(`${response.message}`);
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
    
    <!-- ajouter un todo  -->
    <!--Reste à faire : ajouter un accordiantion-->
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
      <!--Affichage du task-->
    </div>
    <div class="w-full max-w-2xl mx-auto">

    <!-- Message si pas de tâches -->
    <NoTask v-if="todos.length === 0" />

    <!-- Affichage si tâches existent -->
    <div v-else  class="space-y-4">
      <div class="text-gray-600 dark:text-gray-300 text-sm text-center mb-4 font-medium">
        Vous avez <span class="font-bold text-blue-600">{{ remaining }}</span> 
        tâche{{ remaining > 1 ? 's' : '' }} à faire.
    </div>

    <!-- Liste des tâches -->
    <ul class="space-y-3 bg-white rounded-lg border border-green-100 shadow-sm p-4">
    <li v-for="todo in todos" :key="todo.id"
        class="group flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <label class="flex items-start gap-3 flex-1 cursor-pointer min-w-0">
        <input type="checkbox"
              :checked="todo.completed"
              @change="(e) => {
                todo.completed = e.target.checked;
                updateTodoStatus(todo);
              }"
              class="accent-blue-600 mt-1 flex-shrink-0 w-5 h-5"/>
           
           <div class="flex-1 min-w-0">
              <div
                :class="{'line-through text-gray-400': todo.completed, 'text-gray-900 dark:text-gray-100 font-medium': !todo.completed, }"
                class="text-sm mb-1" >
                {{ todo.title }}
              </div>
              <div v-if="todo.description"
                :class="{
                  'line-through text-gray-300': todo.completed,
                  'text-gray-600 dark:text-gray-400': !todo.completed,
                }"
                class="text-xs truncate"
              >
                {{ todo.description }}
              </div>
            </div>
          </label>
          
            <div class="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                @click="editTodo(todo.id)"
                class="text-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                <Edit2 class="w-4 h-4" />
              </Button>
             
              <!-- @click="deleteTodo(todo.id)"-->
              <Button
                variant="ghost"
                size="sm"
               @click="confirmDelete(todo.id)"
                class="text-red-500 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
        </li>
      </ul>
      </div></div>
      <AlertDelet 
              :open="openDeleteDialog"
              :is-deleting="isDeleting"
              v-on:cancel="cancelDelete"
              v-on:confirm="deleteTodo()"

              />
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