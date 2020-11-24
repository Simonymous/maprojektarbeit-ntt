import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/SignUp.vue'
import Test from '../views/storetest.vue'
import Logout from '../views/Logout.vue'


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
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router