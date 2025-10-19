<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-vue-next'
import axios from "axios";

const route = useRoute();
const router = useRouter();

const form = ref({
  id:'',
  title: '',
  description: '',
  completed: false
});

const isLoading = ref(false);
const errors = ref({});
const notifications = ref([]);

// TODO: Remplacer par un store/API pour récupérer les todos
// Pour maintenant, utiliser les données du parent ou une store Pinia
/*
const todosList = ref([]);
*/
onMounted(() => {
  const taskId = computed(() => route.params.id);
  loadTask(taskId);
});

// Charger la tâche
const loadTask = async (taskId) => {
  try{
    const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${taskId.value}`)
    if (response.data) {
      form.value = {
        id:response.data.id,
        title: response.data.title,
        description: response.data.description,
        completed: response.data.completed
      };
    } else {
      errors.value.submit = 'Tâche non trouvée';
      console.error(errors.value.submit )
    }
  }catch(error){
    console.error(error)
  }
};

// Valider le formulaire
const validate = () => {
  errors.value = {};
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Le titre est requis';
    return false;
  }
  
  if (form.value.title.length < 3) {
    errors.value.title = 'Le titre doit contenir au moins 3 caractères';
    return false;
  }
  return true;
};

// Enregistrer la tâche
const saveTask = async () => {
  if (!validate()) return;

  isLoading.value = true;
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/tasks/:${form.value.id}`,form.value)
    showNotification('✅ Tâche mise à jour avec succès!');
    
    // Rediriger vers la liste après 1 seconde
    setTimeout(() => {
      router.push('/home');
    }, 1000);
    
  } catch (error) {
    errors.value.submit = error.message || 'Erreur lors de la mise à jour';
  } finally {
    isLoading.value = false;
  }
};

// Annuler et retour
const goBack = () => {
  router.push('/home');
};
// Afficher notification
const showNotification = (message) => {
  const id = form.value.id;
  notifications.value.push({ id, message });
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- HEADER  -->
    <div class="mb-8 flex items-center gap-4">
      <button
        @click="goBack"
        class="p-2 hover:bg-green-100 rounded-lg transition text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>
      <div>
        <h1 class="text-4xl font-bold text-gray-900">Modifier la tâche</h1>
        <p class="text-gray-600 mt-1">Mettez à jour les informations de votre tâche</p>
      </div>
    </div>

    <!--  FORM  -->
    <div class="bg-white rounded-xl shadow-sm border border-green-200 p-8 max-w-2xl">
      <!-- Error Message -->
      <div v-if="errors.submit" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ errors.submit }}
      </div>

      <!-- Form Fields -->
      <form @submit.prevent="saveTask" class="space-y-6">
        <!-- Title Field -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            Titre de la tâche <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Entrez le titre..."
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition',
              errors.title
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-green-200 focus:ring-green-500 bg-green-50'
            ]"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description Field -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            placeholder="Entrez une description..."
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition',
              errors.description
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-green-200 focus:ring-green-500 bg-green-50'
            ]"
            rows="4"
          />
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">
            {{ errors.description }}
          </p>
        </div>

        <!-- Completed Checkbox -->
        <div class="flex items-center gap-3">
          <input
          :checked="form.completed"
          @change="(e)=>{
          form.completed=e.target.checked
          }"
            type="checkbox"
            id="completed"
            class="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-500"
          />
          <label for="completed" class="text-sm font-medium text-gray-900 cursor-pointer">
            Marquer comme complétée
          </label>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 border-t border-green-100">
          <Button
            type="button"
            variant="outline"
            @click="goBack"
            :disabled="isLoading"
            class="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <Save v-if="!isLoading" class="w-4 h-4 mr-2" />
            {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </Button>
        </div>
      </form>
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
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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