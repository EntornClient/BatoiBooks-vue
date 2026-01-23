import { createRouter, createWebHistory } from 'vue-router'
import BookForm from '@/components/BookForm.vue'
import BooksList from '@/components/BooksList.vue'

const routes = [
    { path: '/form', name: 'form', component: BookForm },
    { path: '/books', name: 'books', component: BooksList }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router