import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import App from '../App.vue'
// import Pixel from '../views/Pixel/index.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/pixel'
    },
    {
      path: '/pixel',
      name: 'pixel',
      component: () => import('../views/Pixel/index.vue')
    }
  ]
})

export default router
