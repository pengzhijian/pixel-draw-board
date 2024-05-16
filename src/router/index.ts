import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/drawBoard',
      name: 'home',
      component: () => import('@/views/demo/drawBoard/drawBoard.vue')
    }
  ]
})

export default router
