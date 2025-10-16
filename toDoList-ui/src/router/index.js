import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/components/views/tasks/TasksView.vue'
import Home from '@/pages/Home.vue'
import TaskDetailView from '@/components/views/tasks/TaskDetailView.vue'
import TasksList from '@/components/views/tasks/TasksList.vue'
import Profile from '@/components/views/Profile.vue'
import Register from '@/components/views/auth/Register.vue'
import Login from '@/components/views/auth/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'default', component: Home },
    { path: '/login', name: 'login', component: Login},
    {path: "/register", name: "register",component:Register},
    { path: '/home', name: 'Home', component: Home,
      children: [
        {path: "/home" , component: TasksView},
        {path: "/task/edit" , component: TaskDetailView},
        {path: "/task/edit/:id",  name: 'TaskEdit',  component: TaskDetailView},
        {path: "/tasks", name : "tasks", component: TasksList},
        {path: "/profile", name: "profile", component: Profile}
      ]
    },

  ],
})

export default router
