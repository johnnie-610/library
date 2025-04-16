

const Library = [];



document.addEventListener('DOMContentLoaded', function() {
    const addBookButton = document.getElementById('add-book');
    const modal = document.getElementById('book-dialog');
    const outputBox = document.querySelector("output");
    const cancelButton = document.getElementById('cancel');
    const saveButton = document.getElementById('save');

    // get any info from library and display it
    // outputBox.innerHTML = JSON.stringify(Library, null, 2);
    


    addBookButton.addEventListener('click', function() {
        modal.showModal();
    }
    );
    cancelButton.addEventListener('click', function() {
        modal.close();
    });
    saveButton.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const pages = document.getElementById('pages').value;
        const publisher = document.getElementById('publisher').value;
        const size = document.getElementById('size').value;
        const format = document.getElementById('format').value;
        const language = document.getElementById('language').value;
        const description = document.getElementById('description').value;

        addBookToLibrary(title, author, year, pages, publisher, size, format, language, description);
        
        outputBox.innerHTML = JSON.stringify(Library, null, 2);
        
        modal.close();
    }
    );
});



function Book(id, title, author, year, pages, publisher, size, format, language, description) {
    if (!new.target) {
        return new Book();
    }
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.pages = pages;
    this.publisher = publisher;
    this.size = size;
    this.format = format;
    this.language = language;
    this.description = description;
}

function addBookToLibrary(title, author, year, pages, publisher, size, format, language, description) {
    const id = crypto.randomUUID();
    const book = new Book(id, title, author, year, pages, publisher, size, format, language, description);
    Library.push(book);
}

function removeBookFromLibrary(id) {
    const index = Library.findIndex(book => book.id === id);
    if (index !== -1) {
        Library.splice(index, 1);
    }
}