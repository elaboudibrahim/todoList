import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/components/views/tasks/TasksView.vue'
import { Component } from 'lucide-vue-next'
import AuthPage from '@/pages/AuthPage.vue'
import Home from '@/pages/Home.vue'
import TaskDetailView from '@/components/views/tasks/TaskDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'default', component: Home },
    { path: '/login', name: 'login', component: AuthPage },
    { path: '/home', name: 'Home', component: Home,
      children: [
        {path: "/home" , component: TasksView},
        {path: "/task/edit" , component: TaskDetailView},
        {path: "/task/edit/:id",  name: 'TaskEdit',  component: TaskDetailView}
      ]
    },
    

  ],
})

export default router
