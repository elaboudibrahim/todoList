import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/components/views/tasks/TasksView.vue'
import Home from '@/pages/Home.vue'
import TaskDetailView from '@/components/views/tasks/TaskDetailView.vue'
import TasksList from '@/components/views/tasks/TasksList.vue'
import Profile from '@/components/views/Profile.vue'
import Register from '@/components/views/auth/Register.vue'
import Login from '@/components/views/auth/Login.vue'
import { authStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'default', component: Home },
    { path: '/login', name: 'login', component: Login, meta:{requiresGuest: true}},
    {path: "/register", name: "register",component:Register, meta:{requiresGuest :true}},
    { path: '/home', name: 'Home', component: Home, meta:{requiresAuth:true},
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
router.beforeEach((to, from, next)=>{
  const auth=authStore();
  auth.loadUser();
  const isAuthenticated = !!auth.token;
  if(to.meta.requiresAuth && !isAuthenticated){
    next("/login")
  }
  else if(to.meta.requiresGuest && isAuthenticated){
    next("/home");
  }
  else{
    next();
  }
})

export default router
