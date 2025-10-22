<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Bell, CheckCircle2, Trash2, AlertCircle, Clock } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { authStore } from '@/stores/authStore';

const auth = authStore();
const notifications = ref([]);
const filter = ref('all');

onMounted(() => {
  auth.loadUser();
  
  if (auth.token && auth.user?.id) {
    window.Echo.channel(`tasks`)
      .listen('.TaskCreated', (event) => {
        addNotification({
          type: 'success',
          title: 'Tâche créée',
          message: `La tâche "${event.task.title}" a été créée avec succès`,
          timestamp: new Date(),
          read: false,
          taskId: event.task.id
        });
      })
      .listen('TaskUpdated', (event) => {
        addNotification({
          type: 'info',
          title: 'Tâche mise à jour',
          message: `La tâche "${event.task.title}" a été modifiée`,
          timestamp: new Date(),
          read: false,
          taskId: event.task.id
        });
      })
      .listen('TaskDeleted', (event) => {
        addNotification({
          type: 'warning',
          title: 'Tâche supprimée',
          message: 'Une tâche a été supprimée de votre liste',
          timestamp: new Date(),
          read: false,
          taskId: event.taskId
        });
      });
  }

  loadNotifications();
});

onBeforeUnmount(() => {
  saveNotifications();
});

const addNotification = (notification) => {
  notifications.value.unshift({
    id: Date.now(),
    ...notification
  });
  saveNotifications();
};

const loadNotifications = () => {
  const saved = localStorage.getItem(`notifications_${auth.user?.id}`);
  if (saved) {
    notifications.value = JSON.parse(saved).map(n => ({
      ...n,
      timestamp: new Date(n.timestamp)
    }));
  }
};

const saveNotifications = () => {
  if (auth.user?.id) {
    localStorage.setItem(
      `notifications_${auth.user.id}`,
      JSON.stringify(notifications.value)
    );
  }
};

const filteredNotifications = computed(() => {
  if (filter.value === 'unread') {
    return notifications.value.filter(n => !n.read);
  } else if (filter.value === 'read') {
    return notifications.value.filter(n => n.read);
  }
  return notifications.value;
});

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const markAsRead = (id) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveNotifications();
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
  saveNotifications();
};

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
  saveNotifications();
};

const clearAll = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
    notifications.value = [];
    saveNotifications();
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle2;
    case 'warning': return AlertCircle;
    case 'info': return Bell;
    default: return Bell;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-orange-600 bg-orange-100';
    case 'info': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); 

  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};
</script>

<template>
  <div class="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p class="text-gray-600">Suivez toutes vos activités en temps réel</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
            {{ unreadCount }} non lue{{ unreadCount > 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Filtres et Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-green-200 p-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filtres -->
          <div class="flex gap-2">
            <Button
              :variant="filter === 'all' ? 'default' : 'outline'"
              size="sm"
              @click="filter = 'all'"
              :class="filter === 'all' ? 'bg-green-500 hover:bg-green-600' : ''"
            >
              Toutes ({{ notifications.length }})
            </Button>
            <Button
              :variant="filter === 'unread' ? 'default' : 'outline'"
              size="sm"
              @click="filter = 'unread'"
              :class="filter === 'unread' ? 'bg-green-500 hover:bg-green-600' : ''"
            >
              Non lues ({{ unreadCount }})
            </Button>
            <Button
              :variant="filter === 'read' ? 'default' : 'outline'"
              size="sm"
              @click="filter = 'read'"
              :class="filter === 'read' ? 'bg-green-500 hover:bg-green-600' : ''"
            >
              Lues
            </Button>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="markAllAsRead"
              :disabled="unreadCount === 0"
            >
              <CheckCircle2 class="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="clearAll"
              :disabled="notifications.length === 0"
              class="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Tout supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des notifications -->
    <div class="max-w-4xl mx-auto">
      <!-- Vide -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
        <p class="text-gray-600">
          {{ filter === 'unread' ? 'Vous êtes à jour ! Aucune nouvelle notification.' : 'Vous n\'avez aucune notification pour le moment.' }}
        </p>
      </div>

      <!-- Liste -->
      <div v-else class="space-y-3">
        <transition-group name="list">
          <div
            v-for="notif in filteredNotifications"
            :key="notif.id"
            :class="[
              'bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md',
              notif.read ? 'border-gray-200' : 'border-green-300 bg-green-50/30'
            ]"
          >
            <div class="p-4">
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', getNotificationColor(notif.type)]">
                  <component :is="getNotificationIcon(notif.type)" class="w-5 h-5" />
                </div>

                <!-- Contenu -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900">{{ notif.title }}</h3>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        {{ formatTime(notif.timestamp) }}
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">{{ notif.message }}</p>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <Button
                      v-if="!notif.read"
                      variant="ghost"
                      size="sm"
                      @click="markAsRead(notif.id)"
                      class="text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <CheckCircle2 class="w-4 h-4 mr-1" />
                      Marquer comme lu
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="deleteNotification(notif.id)"
                      class="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 class="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>