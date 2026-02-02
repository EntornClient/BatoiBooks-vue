<script setup>
import { store } from '@/store/store';
import { useRouter } from 'vue-router';
//const cart = computed(() => store.state.cart);

const props = defineProps(['book']);
const router = useRouter();

const delBook = (id, nombre) => {
    store.deleteBook(id, nombre)
}

const addCart = (newbBook) => {
    store.addBookToCart(newbBook)
}

const goToEdit = () => {
    router.push({ name: 'edit', params: { id: props.book.id } });
}
</script>

<template>
<div class="card">
    <h3>libro: {{ book.id }}</h3>
    <p>{{ book.publisher }}</p>
    <p>{{ book.price }}€</p>
    <p>{{ book.pages }} paginas</p>
    <p>{{ book.soldDate }}</p>
    <button v-on:click="addCart(book)"> <span class="material-icons">add_shopping_cart</span> </button>
    <button class="edit" @click="goToEdit"> <span class="material-icons">edit</span> </button>
    <button v-on:click="delBook(book.id, book.publisher)"> <span class="material-icons">delete</span> </button>
</div>
</template>
<style>
    .card{
        text-align: center;
        background-color: brown;
    }
</style>