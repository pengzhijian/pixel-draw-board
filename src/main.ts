import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "./assets/style/reset.css";
import "element-plus/dist/index.css";

import { resizeMounted, resizeUnmounted } from '@/utils/directive/canvas-resize';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount("#app");

app.directive("canvas-resize", { mounted: resizeMounted, unmounted: resizeUnmounted });