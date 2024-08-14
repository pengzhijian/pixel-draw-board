import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App).use(store).use(router)

app.use(ElementPlus)
app.mount('#app')