import { createApp } from 'vue'
import './assets/main.css'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import "./lib/interceptor"

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
