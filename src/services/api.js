const SERVER = "http://localhost:3000";

async function getDBUsers(){
    const response = await fetch(SERVER + "/users");
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const users = await response.json();
    return users;

}

async function getDBModules(){
    try{
    const response = await fetch(SERVER + "/modules");
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const modules = await response.json();
    return modules;
    }catch(err){
        console.log(err);
    }
}

async function getDBBooks(){
    try{
    const response = await fetch(SERVER + "/books");
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const books = await response.json();
    return books;
    }catch(err){
        console.log(err);
    }
}

async function getDBUser(id) {
    try{
        const response = await fetch(SERVER + "/users/" + id);
        if (!response.ok) {
            throw `Error ${response.status} de la BBDD: ${response.statusText}`}
        const user = await response.json();
        return user;
    }catch(err){
        console.log(err);
    }
}

async function getDBBook(id) {
    try{
        const response = await fetch(SERVER + "/books/" + id);
        if (!response.ok) {
            throw `Error ${response.status} de la BBDD: ${response.statusText}`}
        const book = await response.json();
        return book;
    }catch(err){
        console.log(err);
    }
}


async function addDBUser(user){
    try{
    const response = await fetch(SERVER + "/users", {
        method: 'POST',
        body: JSON.stringify(user),
        headers:{
            'Contennt-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const newUser = await response.json();
    return newUser;
    }catch(err){
        console.log(err);
    }
}

async function addDBBook(book){
    try{
    const response = await fetch(SERVER + "/books", {
        method: 'POST',
        body: JSON.stringify(book),
        headers:{
            'Contennt-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const newBook = await response.json();
    return newBook;
    }catch(err){
        console.log(err);
    }
}

async function removeDBBook(id){
        try{
    const response = await fetch(SERVER + "/books/" + id,{
        method: 'DELETE',
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const deleteBook = await response.json();
    return deleteBook;
    }catch(err){
        console.log(err);
    }
}

async function removeDBUser(id){
        try{
    const response = await fetch(SERVER + "/users/" + id,{
        method: 'DELETE',
        body: JSON.stringify(id),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const deleteUser = await response.json();
    return deleteUser;
    }catch(err){
        console.log(err);
    }
}

async function changeDBBook(book) {
    try{
    const response = await fetch(SERVER + "/books/" + book.id, {
        method: 'PUT',
        body: JSON.stringify(book),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const changedBook = await response.json();
    return changedBook;
    }catch(err){
        console.log(err);
    }
}

async function changeDBUser(user) {
    try{
    const response = await fetch(SERVER + "/users/" + user.id, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const changedUser = await response.json();
    return changedUser;
    }catch(err){
        console.log(err);
    }
}

async function changeDBUserPassword(id, newPassword) {
    try{
    const response = await fetch(SERVER + "/users/" + id, {
        method: 'PATCH',
        body: JSON.stringify({password: newPassword}),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw `Error ${response.status} de la BBDD: ${response.statusText}`
    }
    const changedUser = await response.json();
    return changedUser;
    }catch(err){
        console.log(err);
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const processCheckout = async (cart) => {
    
    const total = cart.reduce((suma, book) => suma + Number(book.price), 0);

    const firstDigit = Number(String(total).charAt(0));

    await sleep(1000); 

    if (firstDigit < 5) {
        throw new Error(`La transacción ha fallado. El total es ${total}€ (El primer dígito ${firstDigit} es menor que 5)`);
    } else {
        return `Compra realizada con éxito. Total: ${total}€`;
    }
};

export{
    getDBUsers,
    getDBModules,
    getDBBooks,
    getDBBook,
    getDBUser,
    addDBUser,
    addDBBook,
    removeDBBook,
    removeDBUser,
    changeDBBook,
    changeDBUser,
    changeDBUserPassword,
    processCheckout
}