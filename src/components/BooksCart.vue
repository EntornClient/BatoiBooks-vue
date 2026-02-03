<script setup>
import { useBookStore } from '../store/bookStore';
import { computed } from 'vue';
import BookItem from './BookItem.vue';

const store = useBookStore();

const cart = computed(() => store.cart);
const total = computed(() => store.totalPrice);

const vaciarCarrito = () => {
    store.vaciarCarrito()
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
                Total a pagar: {{ total }}€
            </div>

            <button @click="handleCheckout" style="padding: 10px 20px; font-size: 1.1em; background-color: green; color: white; border: none; cursor: pointer;">
                Realizar Compra
            </button>
            <br><br>

            <ul>
                <BookItem 
                    v-for="book in cart" 
                    :key="book.id" 
                    :book="book" 
                    :is-in-cart="true"
                ></BookItem>
            </ul>
        </div>
        <button @click="vaciarCarrito">Vaciar Carrito</button>
        <router-link to="/">Volver a la tienda</router-link>
    </div>
</template>