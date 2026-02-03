<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useBookStore } from '../store/bookStore';
import { useRoute, useRouter } from 'vue-router'; 
import { getDBBook } from '@/services/api';

const store = useBookStore();

const route = useRoute(); 
const router = useRouter();

const isEditing = computed(() => route.params.id !== undefined);

const bookData = reactive({
    id: '', 
    moduleCode: '',
    publisher: '',
    price: null,
    pages: null,
    status: 'good', 
    comments: '',
    soldDate: ''
});

onMounted(async () => {
    if (isEditing.value) {
        try {
            const book = await getDBBook(route.params.id);
            Object.assign(bookData, book); 
        } catch (e) {
            console.error(e);
        }
    }
});

const handleSubmit = async () => {
    if (isEditing.value) {
        await store.editBook({ ...bookData });
    } else {
        const { id, ...newBook } = bookData;
        await store.addBook(newBook);
    }
    router.push('/'); 
};

const handleReset = async () => {
    if (isEditing.value) {
        const book = await getDBBook(route.params.id);
        Object.assign(bookData, book);
    } else {
        resetFormLocal();
    }
}

const resetFormLocal = () => {
    bookData.moduleCode = '';
    bookData.publisher = '';
    bookData.price = null;
    bookData.pages = null;
    bookData.status = 'good';
    bookData.comments = '';
    bookData.soldDate = '';
}
</script>

<template>
    <form id="formulari" @submit.prevent="handleSubmit" @reset.prevent="handleReset">
        <h3 id="formTitle">{{ isEditing ? 'Editar Libro' : 'Añadir libro' }}</h3>
        
        <div>
            <label for="module-code">moduleCode: </label>
            <select name="moduleCode" id="module-code" v-model="bookData.moduleCode" required>
                <option value="" disabled>tria el modul:</option>
                <option value="M06">Client</option>
                <option value="M07">Servidor</option>
                <option value="M08">Desplegament</option>
            </select>
        </div>

        <div>
            <label for="publisher">publisher: </label>
            <input type="text" id="publisher" v-model="bookData.publisher" required>
        </div>

        <div>
            <label for="price">Precio: </label>
            <input type="number" id="price" v-model.number="bookData.price" min="0" required>
        </div>

        <div>
            <label for="pages">Paginas: </label>
            <input type="number" id="pages" v-model.number="bookData.pages" min="0" step="1" required>
        </div>
        
        <div>
            <p>Status: </p>
            <input type="radio" id="status-good" value="good" v-model="bookData.status">
            <label for="status-good">good</label>

            <input type="radio" id="status-bad" value="bad" v-model="bookData.status">
            <label for="status-bad">bad</label>
        </div>

        <div>
            <label for="comments">comentarios: </label>
            <textarea id="comments" v-model="bookData.comments"></textarea> 
        </div>

        <div>
            <label for="soldDate">Fecha de venta: </label>
            <input type="date" id="soldDate" v-model="bookData.soldDate">
        </div>

        <div id="errores-generales"></div>
        
        <div>
            <button type="submit">{{ isEditing ? 'Modificar' : 'Añadir' }}</button>
            <button type="reset">Reset</button>
        </div>
        <br>
    </form>
</template>

<style>
</style>