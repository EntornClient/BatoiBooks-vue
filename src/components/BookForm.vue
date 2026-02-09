<script setup>
import { onMounted, computed } from 'vue';
import { useBookStore } from '../store/bookStore';
import { useRoute, useRouter } from 'vue-router'; 
import { getDBBook } from '@/services/api';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const store = useBookStore();
const route = useRoute(); 
const router = useRouter();

const isEditing = computed(() => route.params.id !== undefined);

const validationSchema = yup.object({
    moduleCode: yup.string()
        .required("El módulo es obligatorio"), 

    publisher: yup.string()
        .required("El publisher es obligatorio"),

    price: yup.number()
        .typeError("Debe ser un número")
        .required("El precio es obligatorio")
        .min(0, "El precio debe ser mayor o igual a 0") 
        .test('is-decimal', 'El precio debe tener máximo 2 decimales', (val) => {
            if (!val && val !== 0) return true;
            return /^\d+(\.\d{1,2})?$/.test(val);
        }),

    pages: yup.number()
        .typeError("Debe ser un número")
        .required("Las páginas son obligatorias")
        .integer('Debe ser un número entero')
        .min(0, "Debe tener 0 o más páginas"),

    status: yup.string()
        .required("El estado es obligatorio"),
    
    comments: yup.string().nullable(),
    soldDate: yup.string().nullable()
});

const { handleSubmit, defineField, errors, setValues, resetForm } = useForm({
    validationSchema,
    initialValues: {
        publisher: '',
        moduleCode: '',
        price: null,
        pages: null,
        status: 'good', 
        comments: '',
        soldDate: ''
    }
});

const [publisher, publisherAttrs] = defineField('publisher');
const [moduleCode, moduleCodeAttrs] = defineField('moduleCode');
const [price, priceAttrs] = defineField('price');
const [pages, pagesAttrs] = defineField('pages');
const [status, statusAttrs] = defineField('status');
const [comments, commentsAttrs] = defineField('comments');
const [soldDate, soldDateAttrs] = defineField('soldDate');

onMounted(async () => {
    if (isEditing.value) {
        try {
            const book = await getDBBook(route.params.id);
            setValues({
                publisher: book.publisher,
                moduleCode: book.moduleCode,
                price: book.price,
                pages: book.pages,
                status: book.status,
                comments: book.comments,
                soldDate: book.soldDate
            });
        } catch (e) {
            console.error('Error cargando libro:', e);
        }
    }
});

const onSubmit = handleSubmit(async (values) => {
    
    if (!isEditing.value) {
        const exists = store.books.some(b => 
            b.publisher.toLowerCase() === values.publisher.toLowerCase() && 
            b.moduleCode === values.moduleCode
        );

        if (exists) {
            alert("Error: No puedes dar de alta el mismo libro dos veces.");
            return; 
        }
    }

    const bookPayload = {
        ...values,
        id: isEditing.value ? route.params.id : undefined,
    };

    try {
        if (isEditing.value) {
            await store.editBook(bookPayload);
        } else {
            await store.addBook(bookPayload);
        }
        router.push('/'); 
    } catch (error) {
        console.error('Error al guardar:', error);
    }
});

const handleReset = () => {
    if (!isEditing.value) {
        resetForm();
    } else {
        window.location.reload();
    }
};
</script>

<template>
    <form id="formulari" @submit="onSubmit" @reset.prevent="handleReset">
        <h3 id="formTitle">{{ isEditing ? 'Editar Libro' : 'Añadir libro' }}</h3>
        
        <div>
            <label for="module-code">Módulo (idModule): </label>
            <select id="module-code" v-model="moduleCode" v-bind="moduleCodeAttrs" :class="{ 'error-input': errors.moduleCode }">
                <option value="" disabled>Tria el mòdul:</option>
                <option value="M06">Client</option>
                <option value="M07">Servidor</option>
                <option value="M08">Desplegament</option>
            </select>
            <span class="error-msg" v-if="errors.moduleCode">{{ errors.moduleCode }}</span>
        </div>

        <div>
            <label for="publisher">Publisher: </label>
            <input type="text" id="publisher" v-model="publisher" v-bind="publisherAttrs" :class="{ 'error-input': errors.publisher }" />
            <span class="error-msg" v-if="errors.publisher">{{ errors.publisher }}</span>
        </div>

        <div>
            <label for="price">Precio: </label>
            <input type="number" step="0.01" id="price" v-model.number="price" v-bind="priceAttrs" :class="{ 'error-input': errors.price }">
            <span class="error-msg" v-if="errors.price">{{ errors.price }}</span>
        </div>

        <div>
            <label for="pages">Páginas: </label>
            <input type="number" id="pages" v-model.number="pages" v-bind="pagesAttrs" :class="{ 'error-input': errors.pages }">
            <span class="error-msg" v-if="errors.pages">{{ errors.pages }}</span>
        </div>
        
        <div>
            <p>Status: </p>
            <div>   
                <input type="radio" id="status-good" value="good" v-model="status" v-bind="statusAttrs">
                <label for="status-good">Good</label>

                <input type="radio" id="status-bad" value="bad" v-model="status" v-bind="statusAttrs">
                <label for="status-bad">Bad</label>
            </div>
            <span class="error-msg" v-if="errors.status">{{ errors.status }}</span>
        </div>

        <div>
            <label for="comments">Comentarios: </label>
            <textarea id="comments" v-model="comments" v-bind="commentsAttrs"></textarea> 
        </div>

        <div>
            <label for="soldDate">Fecha de venta: </label>
            <input type="date" id="soldDate" v-model="soldDate" v-bind="soldDateAttrs">
        </div>

        <div id="errores-generales"></div>
        
        <div>
            <button type="submit" :disabled="Object.keys(errors).length > 0">{{ isEditing ? 'Modificar' : 'Añadir' }}</button>
            <button type="reset">Reset</button>
        </div>
        <br>
    </form>
</template>

<style scoped>
.error-msg { color: red; font-size: 0.8em; display: block; }
.error-input { border-color: red; }
</style>