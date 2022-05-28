// class Book: for maintaining the book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
} 

// class UI: for the ui of the table
class UI{
    static displayBooks(){

    var books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));

    }

    static addBookToList(book){
        var table = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        table.appendChild(row);
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        // Vanish in 3 secs
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);

        div.style.transition = 'ease 1s';
    }

    static removeBook(ele){
        if (ele.classList.contains('delete')){
            ele.parentElement.parentElement.remove();
        }
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// class storage: Handles Stroage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn){
        const books = Store.getBooks();

        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// class Event: Displays Books
document.addEventListener('DOMContentLoaded', UI.displayBooks());

// class Event: Add a book
document.querySelector('#book-form').addEventListener('submit', function (e){
    // Prevent The default page on loaded
    console.log(e);
    e.preventDefault();

    // Recieving the input values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please Fill in the fields', 'danger');
    }else{
        // Creating thr Book Object
        const book = new Book(title, author, isbn);

        console.log(book);

        // Adding book to the UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBooks(book);

        // Clear Fields
        UI.clearFields();

        // Show Success Message
        UI.showAlert('Data Updated Successfully', 'success');
    }
})

// class Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    UI.removeBook(e.target);

    // Remove book from Store
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');
})
