<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { useBookStore } from '../store/bookStore'; 
import { getDBBook } from '@/services/api';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const store = useBookStore();
const route = useRoute(); 
const router = useRouter();

const isEditing = computed(() => route.params.id !== undefined);

const validationSchema = yup.object({
    publisher: yup.string()
        .required('El publisher es obligatorio')
        .min(10, 'El publisher debe tener al menos 10 caracteres'),
    
    moduleCode: yup.string()
        .required('Debes seleccionar un módulo'),
    
    stock: yup.number()
        .typeError('El stock debe ser un número')
        .required('El stock es obligatorio')
        .integer('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo'),

    price: yup.number()
        .typeError('El precio debe ser un número')
        .required('El precio es obligatorio')
        .positive('El precio debe ser mayor que 0')
        .test('is-decimal', 'El precio debe tener máximo 2 decimales', (val) => {
            if (!val) return true;
            return /^\d+(\.\d{1,2})?$/.test(val);
        }),

    pages: yup.number()
        .typeError('El número de páginas debe ser un valor numérico')
        .required('Las páginas son obligatorias')
        .integer('Debe ser un número entero')
        .positive('Debe tener más de 0 páginas'),

    status: yup.string()
        .required('El estado es obligatorio'),

    photo: yup.string()
        .nullable()
        .notRequired()
        .test('is-valid-extension', 'La imagen debe acabar en .webp, .png o .jpeg', (val) => {
            if (!val) return true; 
            return /\.(webp|png|jpeg|jpg)$/i.test(val);
        }),
    
    comments: yup.string().nullable(),

    soldDate: yup.string().nullable()
});

const { handleSubmit, defineField, errors, setValues, resetForm } = useForm({
    validationSchema,
    initialValues: {
        publisher: '',
        moduleCode: '',
        stock: 0,
        price: null,
        pages: null,
        status: 'good', 
        photo: '',
        comments: '',
        soldDate: ''
    }
});

const [publisher, publisherAttrs] = defineField('publisher');
const [moduleCode, moduleCodeAttrs] = defineField('moduleCode');
const [stock, stockAttrs] = defineField('stock');
const [price, priceAttrs] = defineField('price');
const [pages, pagesAttrs] = defineField('pages');
const [status, statusAttrs] = defineField('status');
const [photo, photoAttrs] = defineField('photo');
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
                photo: book.photo,
                comments: book.comments,
                soldDate: book.soldDate,
                stock: book.stock || 0 
            });
        } catch (e) {
            console.error('Error al cargar el libro:', e);
        }
    }
});

const onSubmit = handleSubmit(async (values) => {
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
        
        <div class="form-group">
            <label for="publisher">Publisher (Mín 10 caracteres): </label>
            <input type="text" id="publisher" v-model="publisher" v-bind="publisherAttrs" :class="{ 'error-input': errors.publisher }" />
            <span class="error-msg" v-if="errors.publisher">{{ errors.publisher }}</span>
        </div>

        <div class="form-group">
            <label for="module-code">Módulo: </label>
            <select id="module-code" v-model="moduleCode" v-bind="moduleCodeAttrs" :class="{ 'error-input': errors.moduleCode }">
                <option value="" disabled>Selecciona un módulo</option>
                <option value="M06">Client (M06)</option>
                <option value="M07">Servidor (M07)</option>
                <option value="M08">Desplegament (M08)</option>
                <option value="M09">Diseño (M09)</option>
            </select>
            <span class="error-msg" v-if="errors.moduleCode">{{ errors.moduleCode }}</span>
        </div>

        <div class="form-group">
            <label for="stock">Stock: </label>
            <input type="number" id="stock" v-model.number="stock" v-bind="stockAttrs" :class="{ 'error-input': errors.stock }" />
            <span class="error-msg" v-if="errors.stock">{{ errors.stock }}</span>
        </div>

        <div class="form-group">
            <label for="price">Precio: </label>
            <input type="number" step="0.01" id="price" v-model.number="price" v-bind="priceAttrs" :class="{ 'error-input': errors.price }" />
            <span class="error-msg" v-if="errors.price">{{ errors.price }}</span>
        </div>

        <div class="form-group">
            <label for="pages">Páginas: </label>
            <input type="number" id="pages" v-model.number="pages" v-bind="pagesAttrs" :class="{ 'error-input': errors.pages }" />
            <span class="error-msg" v-if="errors.pages">{{ errors.pages }}</span>
        </div>
        
        <div class="form-group">
            <p>Estado: </p>
            <div class="radio-group">
                <label>
                    <input type="radio" value="good" v-model="status" v-bind="statusAttrs"> Good
                </label>
                <label>
                    <input type="radio" value="bad" v-model="status" v-bind="statusAttrs"> Bad
                </label>
            </div>
            <span class="error-msg" v-if="errors.status">{{ errors.status }}</span>
        </div>

        <div class="form-group">
            <label for="photo">Foto (URL/Archivo): </label>
            <input type="text" id="photo" v-model="photo" v-bind="photoAttrs" placeholder="libro.png" :class="{ 'error-input': errors.photo }" />
            <span class="error-msg" v-if="errors.photo">{{ errors.photo }}</span>
            <small>Formatos permitidos: .webp, .png, .jpeg</small>
        </div>

        <div class="form-group">
            <label for="comments">Comentarios: </label>
            <textarea id="comments" v-model="comments" v-bind="commentsAttrs"></textarea> 
        </div>

        <div class="form-group">
            <label for="soldDate">Fecha de venta: </label>
            <input type="date" id="soldDate" v-model="soldDate" v-bind="soldDateAttrs">
        </div>

        <div class="actions">
            <button type="submit" :disabled="Object.keys(errors).length > 0">{{ isEditing ? 'Modificar' : 'Añadir' }}</button>
            <button type="reset">Reset</button>
        </div>
        <br>
    </form>
</template>

<style scoped>
.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    max-width: 400px;
}

.radio-group {
    display: flex;
    gap: 15px;
}

.error-msg {
    color: red;
    font-size: 0.85em;
    margin-top: 4px;
}

.error-input {
    border: 1px solid red;
    background-color: #fff5f5;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

input, select, textarea {
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
}

button {
    margin-right: 10px;
    padding: 10px 20px;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>