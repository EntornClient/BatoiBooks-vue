<script setup>
import { store } from '@/store/store';
import { computed, onMounted } from 'vue';
defineProps(['book']);
const delBook = (id, nombre) => {
    store.deleteBook(id, nombre)
}

const addCart = (newbBook) => {
    store.addBookToCart(newbBook)
}

</script>
<template>
<div class="card">
    <h3>libro: {{ book.id }}</h3>
    <p>{{ book.publisher }}</p>
    <p>{{ book.pages }} Paginas</p>
    <p>{{ book.comments }}</p>
    <p>{{ book.price }} €</p>
    <button v-on:click="addCart(book)"> <span class="material-icons">add_shopping_cart</span> </button>
    <button class="edit"> <span class="material-icons">edit</span> </button>
    <button v-on:click="delBook(book.id, book.publisher)"> <span class="material-icons">delete</span> </button>
</div>
</template>
<style>
    .card{
        text-align: center;
        background-color: brown;
    }
</style>