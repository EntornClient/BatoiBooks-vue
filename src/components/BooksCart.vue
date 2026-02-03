<script setup>
import { computed } from 'vue';
import { useBookStore } from '@/store/bookStore';
import BookItem from './BookItem.vue';

const store = useBookStore();

const cart = computed(() => store.cart);

const totalPrice = computed(() => store.totalPrice);

const vaciarCarrito = () => {
    store.cart = [];
    store.saveCart(); 
}

const handleCheckout = () => {
    store.checkout();
}
</script>

<template>
    <div>
        <h2>Carrito de Compra</h2>
        
        <div v-if="cart.length === 0">
            <p>El carrito está vacío</p>
        </div>
        
        <div v-else>
            <div style="margin: 20px 0; font-size: 1.2em; font-weight: bold;">
                Total a pagar: {{ totalPrice }}€
            </div>

            <button @click="handleCheckout" style="padding: 10px 20px; font-size: 1.1em; background-color: green; color: white;">
                Realizar Compra
            </button>
            <br><br>

            <ul>
                <BookItem 
                    v-for="book in cart" 
                    :key="book.id" 
                    :book="book" 
                    :isInCart="true"
                ></BookItem>
            </ul>
            
            <br>
            <button @click="vaciarCarrito" style="background-color: #cc0000; color: white;">
                Vaciar Carrito
            </button>
        </div>

        <br>
        <router-link to="/">Volver a la tienda</router-link>
    </div>
</template>