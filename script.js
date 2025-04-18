// Initialize the Library array from localStorage or empty array
let Library = JSON.parse(localStorage.getItem("library")) || [];

// Function to save library to localStorage
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(Library));
}

// Card template for book display
const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
<div class="card">
    <div class="card-header">
        <h2 class="card-title"></h2>
    </div>
    <div class="card-body">
        <p class="card-text">Author: <span class="author"></span></p>
        <p class="card-text">Year: <span class="year"></span></p>
        <p class="card-text">Pages: <span class="pages"></span></p>
        <p class="card-text">Publisher: <span class="publisher"></span></p>
        <p class="card-text">Size: <span class="size"></span></p>
        <p class="card-text">Format: <span class="format"></span></p>
        <p class="card-text">Language: <span class="language"></span></p>
        <p class="card-text">Description: <span class="description"></span></p>
    </div>
    <div class="card-footer">
        <button class="btn mark-read" data-id=""></button>
        <button class="btn btn-danger" data-id="">Remove</button>
    </div>
</div>
`;

// Book constructor
function Book(
  id,
  title,
  author,
  year,
  pages,
  publisher,
  size,
  format,
  language,
  description
) {
  if (!new.target) {
    return new Book(
      id,
      title,
      author,
      year,
      pages,
      publisher,
      size,
      format,
      language,
      description
    );
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
  this.read = false;
}

// Function to create a card element for a book
function createCardElement(book) {
  const card = cardTemplate.content.cloneNode(true);
  const cardElement = card.querySelector(".card");

  // Set book details
  card.querySelector(".card-title").textContent = book.title;
  card.querySelector(".author").textContent = book.author;
  card.querySelector(".year").textContent = book.year;
  card.querySelector(".pages").textContent = book.pages;
  card.querySelector(".publisher").textContent = book.publisher;
  card.querySelector(".size").textContent = book.size;
  card.querySelector(".format").textContent = book.format;
  card.querySelector(".language").textContent = book.language;
  card.querySelector(".description").textContent = book.description;

  // Set button attributes and text
  const markReadBtn = card.querySelector(".btn.mark-read");
  markReadBtn.textContent = book.read ? "Read" : "Not Read";
  markReadBtn.dataset.id = book.id;
  markReadBtn.classList.toggle("read", book.read);
  markReadBtn.classList.toggle("not-read", !book.read);

  const removeBtn = card.querySelector(".btn.btn-danger");
  removeBtn.dataset.id = book.id;

  // Add event listeners
  markReadBtn.addEventListener("click", function () {
    toggleReadStatus(this.dataset.id);

  });

  removeBtn.addEventListener("click", function () {
    removeBook(this.dataset.id);
  });

  return card;
}

// Function to render the library
function renderLibrary() {
  const libraryContainer = document.getElementById("library-container");
  if (!libraryContainer) return;

  // Clear the container
  libraryContainer.innerHTML = "";

  // No books message
  if (Library.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your library is empty. Add some books!";
    emptyMessage.classList.add("empty-library-message");
    libraryContainer.appendChild(emptyMessage);
    return;
  }

  // Create a card for each book
  Library.forEach((book) => {
    const card = createCardElement(book);
    libraryContainer.appendChild(card);
  });
}

// Function to add a new book
function addBook(
  title,
  author,
  year,
  pages,
  publisher,
  size,
  format,
  language,
  description
) {
  const id = crypto.randomUUID();
  const book = new Book(
    id,
    title,
    author,
    parseInt(year),
    parseInt(pages),
    publisher,
    size,
    format,
    language,
    description
  );
  Library.push(book);
  saveLibrary();
  renderLibrary();
}

// Function to remove a book
function removeBook(id) {
  const index = Library.findIndex((book) => book.id === id);
  if (index !== -1) {
    Library.splice(index, 1);
    saveLibrary();
    renderLibrary();
  }
}

// Function to toggle read status
function toggleReadStatus(id) {
  const book = Library.find((book) => book.id === id);
  if (book) {
    book.read = !book.read;
    saveLibrary();
    renderLibrary();
  }
}

// Function to handle search
function searchBooks(query) {
  query = query.toLowerCase();
  const results = Library.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
  );

  const searchResultsHeader = document.getElementById("search-results-header");
  const searchResultsContainer = document.getElementById(
    "search-results-container"
  );

  searchResultsContainer.innerHTML = "";

  if (query === "") {
    searchResultsHeader.textContent = "";
    return;
  }

  searchResultsHeader.textContent = `Search Results for "${query}"`;

  if (results.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No results found.";
    searchResultsContainer.appendChild(noResults);
    return;
  }

  results.forEach((book) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("search-result-item");
    resultItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
        `;
    resultItem.addEventListener("click", () => {
      // Scroll to the book in the library
      const bookElement = document
        .querySelector(`.btn.mark-read[data-id="${book.id}"]`)
        .closest(".card");
      bookElement.scrollIntoView({ behavior: "smooth" });
      bookElement.classList.add("highlight");
      setTimeout(() => bookElement.classList.remove("highlight"), 2000);
    });
    searchResultsContainer.appendChild(resultItem);
  });
}

// Event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  renderLibrary();

  const addBookButton = document.getElementById("add-book");
  const modal = document.getElementById("book-dialog");
  const cancelButton = document.getElementById("cancel");
  const saveButton = document.getElementById("save");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  // Add book dialog
  if (addBookButton && modal) {
    addBookButton.addEventListener("click", function () {
      // Clear form fields
      const form = modal.querySelector("form");
      form.reset();
      modal.showModal();
    });
  }

  // Cancel button
  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      modal.close();
    });
  }

  // Save book
  if (saveButton) {
    saveButton.addEventListener("click", function (event) {
      event.preventDefault();

      const title = document.getElementById("book-title").value;
      const author = document.getElementById("book-author").value;
      const year = document.getElementById("book-year").value;
      const pages = document.getElementById("book-pages").value;
      const publisher = document.getElementById("book-publisher").value;
      const size = document.getElementById("book-size").value;
      const format = document.getElementById("book-format").value;
      const language = document.getElementById("book-language").value;
      const description = document.getElementById("book-description").value;

      // Validate inputs
      if (
        !title ||
        !author ||
        !year ||
        !pages ||
        !publisher ||
        !size ||
        !format ||
        !language ||
        !description
      ) {
        alert("All fields are required.");
        return;
      }

      // Add the book
      addBook(
        title,
        author,
        year,
        pages,
        publisher,
        size,
        format,
        language,
        description
      );
      modal.close();
    });
  }

  // Search functionality
  if (searchInput && searchButton) {
    searchButton.addEventListener("click", function () {
      searchBooks(searchInput.value);
    });

    searchInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        searchBooks(this.value);
      }
    });
  }
});
