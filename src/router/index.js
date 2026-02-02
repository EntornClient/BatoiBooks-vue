import { createRouter, createWebHistory } from 'vue-router'
import BooksList from '@/components/BooksList.vue'
import BookForm from '@/components/BookForm.vue'
import AppAbout from '@/components/AppAbout.vue'
import BooksCart from '@/components/BooksCart.vue'
const routes = [
    { 
        path: '/', 
        name: 'home', 
        component: BooksList 
    },
    { 
        path: '/create', 
        name: 'create', 
        component: BookForm 
    },
    { 
        path: '/edit/:id', 
        name: 'edit', 
        component: BookForm,
        props: true 
    },
    { 
        path: '/cart', 
        name: 'cart', 
        component: BooksCart 
    },
    { 
        path: '/about', 
        name: 'about', 
        component: AppAbout 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router