import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

const Register = () => import('./pages/Register.vue')
const Quiz = () => import('./pages/Quiz.vue');
const Notfound = () => import('./pages/404.vue')

const routes = [
    { path: '/', name: 'Register', component: Register },
    { path: '/quiz',  name: 'Quiz', component: Quiz },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Notfound },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const pinia = createPinia()
createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')


