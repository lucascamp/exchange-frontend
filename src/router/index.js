import { createRouter, createWebHistory } from 'vue-router'
import CoinsView from '../views/Exchange/CoinsView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import ListView from '../views/Exchange/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/coins',
      name: 'coins',
      component: CoinsView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/listTransactions',
      name: 'listTransactions',
      component: ListView,
    },
  ],
})

export default router
