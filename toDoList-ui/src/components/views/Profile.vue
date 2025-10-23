<script setup>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2, Shield } from 'lucide-vue-next';
import { authStore } from '@/stores/authStore';
import axios from 'axios';
import { computed } from 'vue';
const auth = authStore();
const isEditing = ref(false);
const notifications = ref([]);
const imagePreview = ref(null);


const form = ref({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  image: null
});

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const showPasswordSection = ref(false);
const isUpdatingPassword = ref(false);

const isSaving = computed(() => auth.isSaving);
onMounted(() => {
  auth.loadUser();
  loadUserData();

});

const loadUserData = () => {
  if (auth.user) {
    form.value = {
      full_name: auth.user.full_name || '',
      email: auth.user.email || '',
      phone_number: auth.user.phone_number || '',
      address: auth.user.address || '',
      image: auth.user.image || null,
    };
    imagePreview.value = storedImageUrl.value || null;
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) { 
  form.value.image = file;
    
  //Cree un aperçu local pour l'image uploadée
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
const storedImageUrl = computed(() => {
  if (auth.user?.image) {
    return `http://127.0.0.1:8000/storage/${auth.user.image}`;
  }
  return null;
});
const toggleEdit = () => {
  if (isEditing.value) {
    loadUserData();
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
    const formData = new FormData();
    formData.append('full_name', form.value.full_name);
    formData.append('email', form.value.email);
    formData.append('phone_number', form.value.phone_number);
    formData.append('address', form.value.address);
    
    if (form.value.image instanceof File) {
      formData.append('image', form.value.image);
    }
    const result= await auth.updateProfile(formData,auth.token);
    if (result.success) {
    loadUserData();
    isEditing.value = false;
    showNotification(result.message, 'success');
  } else {
    showNotification(result.message, 'error');
  }
    
};

const updatePassword = async () => {
  if (!passwordForm.value.current_password || !passwordForm.value.new_password || !passwordForm.value.new_password_confirmation) {
    showNotification(' Veuillez remplir tous les champs', 'error');
    return;
  }

  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    showNotification(' Les mots de passe ne correspondent pas', 'error');
    return;
  }

  if (passwordForm.value.new_password.length < 8) {
    showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
    return;
  }

  isUpdatingPassword.value = true;
  const response = await auth.updatePassword(passwordForm,auth.token);
  if(response.success){
    passwordForm.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    };
    showPasswordSection.value = false;
    showNotification(response.message, 'success');
  }else {
    showNotification(response.message, 'error');
  }
  isUpdatingPassword.value = false;
};

const showNotification = (message, type = 'success') => {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};
</script>

<template>
  <div class="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
      <p class="text-gray-600">Gérez vos informations personnelles</p>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Carte principale du profil -->
      <div class="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
        <!-- Header avec photo -->
        <div class="bg-gradient-to-r from-green-400 to-green-600 h-32"></div>
        
        <div class="px-8 pb-8">
          <!-- Photo de profil -->
          <div class="relative -mt-16 mb-6">
            <div class="relative inline-block">
              <div class="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Photo de profil"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {{ auth.user?.full_name?.charAt(0).toUpperCase() || 'U' }}
                </div>
              </div>
              
              <!-- Bouton upload photo -->
              <label
                v-if="isEditing"
                class="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition shadow-lg"
              >
                <Camera class="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </label>
            </div>
          </div>

          <!-- Bouton Edit/Cancel -->
          <div class="flex justify-end mb-6">
            <Button
              v-if="!isEditing"
              variant="outline"
              @click="toggleEdit"
              class="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Edit2 class="w-4 h-4 mr-2" />
              Modifier le profil
            </Button>
            <Button
              v-else
              variant="outline"
              @click="toggleEdit"
              class="border-red-500 text-red-600 hover:bg-red-50"
            >
              <X class="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>

          <!-- Formulaire -->
          <div class="space-y-6">
            <!-- Nom complet -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User class="w-4 h-4" />
                Nom complet
              </label>
              <input
                v-model="form.full_name"
                type="text"
                :disabled="!isEditing"
                :class="[
                  'w-full px-4 py-3 border rounded-lg transition',
                  isEditing
                    ? 'border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                ]"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail class="w-4 h-4" />
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                :disabled="!isEditing"
                :class="[
                  'w-full px-4 py-3 border rounded-lg transition',
                  isEditing
                    ? 'border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                ]"
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone class="w-4 h-4" />
                Téléphone
              </label>
              <input
                v-model="form.phone_number"
                type="tel"
                :disabled="!isEditing"
                :class="[
                  'w-full px-4 py-3 border rounded-lg transition',
                  isEditing
                    ? 'border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                ]"
              />
            </div>

            <!-- Adresse -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin class="w-4 h-4" />
                Adresse
              </label>
              <textarea
                v-model="form.address"
                :disabled="!isEditing"
                rows="3"
                :class="[
                  'w-full px-4 py-3 border rounded-lg transition resize-none',
                  isEditing
                    ? 'border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                ]"
              ></textarea>
            </div>

            <!-- Bouton Sauvegarder -->
            <div v-if="isEditing" class="flex gap-3 pt-4">
              <Button
                @click="saveProfile"
                :disabled="isSaving"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Sécurité -->
      <div class="bg-white rounded-xl shadow-sm border border-green-200 p-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield class="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Sécurité</h2>
              <p class="text-sm text-gray-600">Modifier votre mot de passe</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            @click="showPasswordSection = !showPasswordSection"
            :class="showPasswordSection ? 'border-red-500 text-red-600' : ''"
          >
            {{ showPasswordSection ? 'Masquer' : 'Modifier le mot de passe' }}
          </Button>
        </div>

        <!-- Formulaire mot de passe -->
        <transition name="slide">
          <div v-if="showPasswordSection" class="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              @click="updatePassword"
              :disabled="isUpdatingPassword"
              class="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Shield class="w-4 h-4 mr-2" />
              {{ isUpdatingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
            </Button>
          </div>
        </transition>
      </div>

      <!-- Informations du compte -->
      <div class="bg-white rounded-xl shadow-sm border border-green-200 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Informations du compte</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Membre depuis</span>
            <span class="font-medium text-gray-900">
              {{ new Date(auth.user?.created_at).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) }}
            </span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Statut du compte</span>
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Actif
            </span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-600">ID utilisateur</span>
            <span class="font-mono text-xs text-gray-500">{{ auth.user?.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <transition-group name="notification" tag="div" class="fixed bottom-6 right-6 space-y-3 pointer-events-none z-50">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="[
          'px-6 py-3 rounded-lg shadow-lg text-white',
          notif.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ notif.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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