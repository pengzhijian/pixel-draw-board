import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/application',
      name: 'application',
      component: () => import('@/views/application/mainApplication.vue')
    },
    {
      path: '/pixelDrawBoard',
      name: 'pixelDrawBoard',
      component: () => import('@/views/demo/pixelDrawBoard/pixelDrawBoard.vue')
    },
    {
      path: '/drawBoardBase',
      name: 'drawBoardBase',
      component: () => import('@/views/demo/drawBoardBase/drawBoardBase.vue')
    },
  ]
})

export default router
