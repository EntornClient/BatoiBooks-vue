<script setup>
import { store } from '@/store/store';
import { computed } from 'vue';
import BookItem from './BookItem.vue';

const cart = computed(() => store.state.cart);
</script>

<template>
    <div>
        <h2>Carrito de Compra</h2>
        <div v-if="cart.length === 0">
            <p>El carrito está vacío</p>
        </div>
        <ul v-else>
            <div>
                <BookItem v-for="book in cart" :key="book.id" :book="book"></BookItem>
            </div>
        </ul>
        <router-link to="/">Volver a la tienda</router-link>
    </div>
</template>