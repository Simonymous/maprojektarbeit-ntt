import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/SignUp.vue'
import Settings from '../views/Settings'
import SolveFullScreen from '../views/SolveFullScreen'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/solvefullscreen',
    name: 'SolveFullScreen',
    component: SolveFullScreen
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
