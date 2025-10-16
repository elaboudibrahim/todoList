<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Home, 
  ListTodo, 
  User, 
  LogOut,
  Settings,
  Bell,
  HelpCircle
} from 'lucide-vue-next'

// ==================== ROUTER ====================
const route = useRoute()

// ==================== COMPUTED ====================
const navItems = computed(() => [
  { 
    path: '/home', 
    label: 'Accueil', 
    icon: Home 
  },
  { 
    path: '/home', 
    label: 'Tâches', 
    icon: ListTodo 
  },
  { 
    path: '/profile', 
    label: 'Profil', 
    icon: User 
  }
])

const isActive = (path) => route.path.includes(path)

// ==================== HANDLERS ====================
const logout = () => {
  // TODO: Implémentation logout (clear JWT token, etc.)
  console.log('Logout')
}
</script>

<template>
  <aside class="h-screen bg-white border-r border-green-200 flex flex-col shadow-lg overflow-y-auto">
    <!-- ==================== LOGO/HEADER ==================== -->
    <div class="p-6 border-b border-green-100 sticky top-0 bg-white">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
          <ListTodo class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-900">TodoFlow</h1>
          <p class="text-xs text-gray-500">Pro</p>
        </div>
      </div>
    </div>

    <!-- ==================== NAVIGATION ==================== -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          isActive(item.path)
            ? 'bg-green-100 text-green-700 font-medium shadow-sm'
            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- ==================== STATS SECTION ==================== -->
    <div class="p-4 space-y-3 border-t border-green-100">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <p class="text-xs text-gray-600 font-medium mb-1">Tâches restantes</p>
        <p class="text-2xl font-bold text-green-600">12</p>
        <p class="text-xs text-gray-500 mt-2">3 tâches cette semaine</p>
      </div>
    </div>

    <!-- ==================== QUICK ACTIONS ==================== -->
    <div class="p-4 space-y-2 border-t border-green-100">
      <button class="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition text-sm">
        <Bell class="w-4 h-4" />
        <span>Notifications</span>
      </button>
      <button class="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition text-sm">
        <Settings class="w-4 h-4" />
        <span>Paramètres</span>
      </button>
      <button class="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition text-sm">
        <HelpCircle class="w-4 h-4" />
        <span>Aide</span>
      </button>
    </div>

    <!-- ==================== USER PROFILE ==================== -->
    <div class="p-4 border-t border-green-100 space-y-4 bg-gradient-to-t from-green-50 to-white">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
          JD
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">John Doe</p>
          <p class="text-xs text-gray-500 truncate">john@example.com</p>
        </div>
      </div>

      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition font-medium text-sm border border-gray-200 hover:border-red-200"
      >
        <LogOut class="w-4 h-4" />
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Smooth transitions */
a {
  transition: all 0.2s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1fae5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6ee7b7;
}
</style>