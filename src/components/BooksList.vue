<script setup>
    import { useBookStore } from '../store/bookStore';
    import { computed, onMounted } from 'vue';
    import BookItem from './BookItem.vue';

    const store = useBookStore();

    const books = computed(() => store.books);

    const totalBooks = computed(() => {
        return store.state.books.length;
    });

    const totalPrice = computed(() => {
        return store.state.books.reduce((suma, book) => {
            return suma + Number(book.price);
        }, 0);
    });

    onMounted( () => {
        store.fetchBooks();
    })
</script>
<template>
    <div>
        <BookItem v-for="book in books" :key="book.id" :book="book"></BookItem>
    </div>
    <div>
        <p><strong>Total de libros:</strong> {{ totalBooks }}</p>
        <p><strong>Precio Total:</strong> {{ totalPrice.toFixed(2) }} €</p>
    </div>
</template>