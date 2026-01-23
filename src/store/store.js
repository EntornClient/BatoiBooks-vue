import { reactive } from 'vue'
import * as api from '../services/api'

export const store = {
    debug: true,
    state: reactive({
        books: [],
        cart: []
    }),
    
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
            alert("libro añadido correctamente")
        } catch (error) {
            alert(error)
        }
    }
}
