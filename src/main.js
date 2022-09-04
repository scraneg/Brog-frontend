import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './routers/index'
import axios from 'axios'

const instance = axios.create({
    baseURL: "http://139.196.59.66:8200"
})
instance.defaults.withCredentials = true
const app = createApp(App)
//app.config.unwrapInjectedRef = true
app.use(router)
app.use(ElementPlus)
app.provide('axios', instance)
app.mount('#app')