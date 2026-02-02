import { reactive } from 'vue'
import * as api from '../services/api'

export const store = {
    debug: true,
    state: reactive({
        books: [],
        cart: JSON.parse(localStorage.getItem('cart')) || []
    }),
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
    },

    async loadBooks(){
        try{
            const books = await api.getDBBooks();
            this.state.books = books;
        }catch(err){
            alert("error al carregar els llibres", err);
        }
        
    },
    async deleteBook(id, nombre){
        try {
            if(confirm("Seguro que quieres borrar el libro " + id + " con el nombre " + nombre)){
                await api.removeDBBook(id);
                await this.loadBooks();
            }
        } catch (error) {
            alert("Error al borrar el libro" + error);
        }
    },
    async addBook(newBook){
        try {
            await api.addDBBook(newBook); 
            await this.loadBooks();
            alert("Libro añadido correctamente");
        } catch (error) {
            alert("Error al añadir el libro: " + error);
        }
    },
    addBookToCart(newBook){
        try {
            this.state.cart.push(newBook);
            this.saveCart();
            alert("libro añadido correctamente")
        } catch (error) {
            alert(error)
        }
    },

    removeBookFromCart(id){
        const index = this.state.cart.findIndex(book => book.id === id);
        if (index !== -1) {
            this.state.cart.splice(index, 1);
            this.saveCart();
        }
    },

    vaciarCarrito(){
        this.state.cart = [];
        this.saveCart();
    },

    async checkout() {
        if (this.state.cart.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        try {
            const message = await api.processCheckout(this.state.cart);
            alert(message);
            this.state.cart = [];
            this.saveCart();
        } catch (error) {
            alert(error);
            this.vaciarCarrito();
        }
    },
    
    async editBook(updatedBook){
        try {
            await api.changeDBBook(updatedBook);
            await this.loadBooks();
            alert("Libro editado correctamente");
        } catch (error) {
            alert("Error al editar el libro: " + error);
        }
    }
}
