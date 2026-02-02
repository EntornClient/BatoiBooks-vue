<script setup>
import { store } from '@/store/store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
    book:Object,
    isInCart: {
        type: Boolean,
        default: false
    }
});
const router = useRouter();

const delBook = (id, nombre) => {
    store.deleteBook(id, nombre)
}

const isAlreadyInCart = computed(() => {
    return store.state.cart.some(item => item.id === props.book.id);
});

const addCart = (newbBook) => {
    store.addBookToCart(newbBook)
}

const removeFromCart = (id) => {
    store.removeBookFromCart(id);
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

    <div v-if="isInCart">
        <button @click="removeFromCart(book.id)">
            <span class="material-icons">remove_shopping_cart</span>
        </button>
    </div>

    <div v-else>
        <button 
            @click="addCart(book)" 
            :disabled="isAlreadyInCart"
            :title="isAlreadyInCart ? 'Ya está en el carrito' : 'Añadir al carrito'"
        > 
            <span class="material-icons">add_shopping_cart</span> 
        </button>
        
        <button class="edit" @click="goToEdit"> 
            <span class="material-icons">edit</span> 
        </button>
        <button v-on:click="delBook(book.id, book.publisher)"> 
            <span class="material-icons">delete</span> 
        </button>
    </div>
</div>
</template>
<style>
    .card{
        text-align: center;
        background-color: brown;
    }
</style>