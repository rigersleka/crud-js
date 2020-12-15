

// add DOM selectors 
const form = document.querySelector('#form');
const titleBook = document.querySelector('#title');
const authorBook = document.querySelector('#author');
const isbnBook = document.querySelector('#isbn');
const buttonSubmit = document.querySelector('#submit');
const tableInsert = document.querySelector('#tbody');

// class build for books 
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// class build for UI
class UI {
  constructor() { }

  //add a book html insert into table body
  addBook(book) {
    const html = `
                  <tr>
                    <th>${book.title}</th>
                    <th>${book.author}</th>
                    <th>${book.isbn}</th>
                    <th class="btn delete font-weight-bold text-danger">X</th>
                  </tr>
                `;
    tableInsert.innerHTML += html;
  }
  //clear inputs after adding a book 
  clearInputs() {
    titleBook.value = '';
    authorBook.value = '';
    isbnBook.value = '';
  }
  //delete book function
  deleteBook(target) {
    target.remove();
  }
  //add alert div
  addAlert(msg, className) {
    // create alert element
    const textAlert = document.createElement('div');
    textAlert.appendChild(document.createTextNode(msg));
    textAlert.classList.add(className);

    //get where to append the div
    const container = document.querySelector('h3');
    container.insertAdjacentElement('afterend', textAlert);

    // clean the alert dic after one second
    setTimeout(() => {
      textAlert.classList.remove(className);
      textAlert.textContent = '';
    }, 1000)
  }
};

/** Class LocalStorage  */
class LocalStorage {
  constructor() { }
  static getBookLocalStore() {

    //check if there is an array books in local storage, if is not, set it empty. if it is, get it
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  //add book to local storage
  static addBookLocalStore(book) {

    //call get books from local storage function and pass hatever returns to a const books; 
    const books = LocalStorage.getBookLocalStore();

    //push into array books the new book added
    books.push(book);

    //set local storage again
    localStorage.setItem('books', JSON.stringify(books))

  }
  //call books array from local storage loop through it and call addBook function with every book from array to persist the books into UI 
  static displayBookLocalStore() {
    //Initialize ui class
    const ui = new UI();

    //declare books const and call get books from local storage to store whatever returns from that function
    const books = LocalStorage.getBookLocalStore();

    //loop trough the boks array and then call addBook o UI function
    books.forEach(book => {
      ui.addBook(book);
    });
  }

  //remove books from local storage 
  static removeBookLocalStore(target) {

    // call books array from local storage to stroe that value into a const books
    const books = LocalStorage.getBookLocalStore();

    //chech if the element to be removed from local storage is the right one
    books.forEach((book, index) => {

      if (book.isbn === target) {
        console.log(book.isbn)
        console.log(target)
        books.splice(index, 1);
      }
    });

    //set back local storage after deleting book. is not, non book will be deleted because it just persist in books variable before; 
    localStorage.setItem('books', JSON.stringify(books));
  }
};

window.addEventListener('DOMContentLoaded', LocalStorage.displayBookLocalStore);

form.addEventListener('submit', e => {
  //prevent default behivour
  e.preventDefault();

  //grab inputs values
  const title = titleBook.value;
  const author = authorBook.value;
  const isbn = isbnBook.value;


  //initialzie Book class
  const book = new Book(title, author, isbn);

  //initialize UI class
  const ui = new UI();

  //display alerts
  if (book.title !== '' && book.author !== '' && book.isbn !== '') {
    // call addBook function in UI class and pass it te book; 
    ui.addBook(book);

    //add book to Local Storage
    LocalStorage.addBookLocalStore(book);

    //clear inputs
    ui.clearInputs();

    //add alert div
    ui.addAlert('Book added', 'success')
  } else {

    // add alert error div
    ui.addAlert('Please add a book', 'error')
  }

});

tbody.addEventListener('click', e => {
  //inizialize ui class
  const ui = new UI();

  //chech if the target element contains a class delete and then delete parent element
  if (e.target.classList.contains('delete')) {

    //call delete book function with the parent element to be rempved from UI
    ui.deleteBook(e.target.parentElement);

    //call remove from local storage function and pass to it the isbn value
    LocalStorage.removeBookLocalStore(e.target.previousElementSibling.textContent)
  }

});




