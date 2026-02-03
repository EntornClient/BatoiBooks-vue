import { defineStore } from 'pinia'
import * as api from '../services/api'

export const useBookStore = defineStore('books', {
    state: () => ({
        books: [],
        cart: JSON.parse(localStorage.getItem('cart')) || []
    }),

    actions: {
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        async fetchBooks() {
            try {
                this.books = await api.getDBBooks();
            } catch (error) {
                console.error("Error cargando libros:", error);
            }
        },

        async addBook(newBook) {
            try {
                await api.addDBBook(newBook);
                await this.fetchBooks();
                alert("Libro añadido correctamente");
            } catch (error) {
                alert("Error al añadir: " + error);
            }
        },

        async deleteBook(id, nombre) {
            if (confirm(`¿Seguro que quieres borrar ${nombre}?`)) {
                try {
                    await api.removeDBBook(id);
                    await this.fetchBooks();
                } catch (error) {
                    alert("Error al borrar: " + error);
                }
            }
        },

        async editBook(updatedBook) {
            try {
                await api.changeDBBook(updatedBook);
                await this.fetchBooks();
                alert("Libro editado correctamente");
            } catch (error) {
                alert("Error al editar: " + error);
            }
        },

        addToCart(book) {
            if (this.cart.some(item => item.id === book.id)) {
                alert("El libro ya está en el carrito");
                return;
            }
            this.cart.push(book);
            this.saveCart();
            alert("Libro añadido al carrito");
        },

        removeFromCart(id) {
            const index = this.cart.findIndex(item => item.id === id);
            if (index !== -1) {
                this.cart.splice(index, 1);
                this.saveCart();
            }
        },

        vaciarCarrito(){
            this.cart = [];
            this.saveCart();
        },

        async checkout() {
            try {
                const message = await api.processCheckout(this.cart);
                alert(message);
                this.vaciarCarrito();
                this.saveCart();
            } catch (error) {
                alert(error);
            }
        }
    },

    getters: {
        isBookInCart: (state) => (id) => {
            return state.cart.some(item => item.id === id);
        },
        totalPrice: (state) => {
            return state.cart.reduce((sum, book) => sum + Number(book.price), 0);
        }
    }
})