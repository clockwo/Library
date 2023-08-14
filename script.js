const selectors = {
  body: '[data-js-body]',
  books: '[data-js-books]',
  addButton: '[data-js-add-button]',
  editButton: '[data-js-edit-button]',
  deleteButton: '[data-js-delete-button]',
  modal: '[data-js-modal]',
  modalAddButton: '[data-js-modal-add-button]',
  modalCloseButton: '[data-js-modal-close-button]',
  addBookForm: '[data-js-form]',
};

const bodyElement = document.querySelector(selectors.body);
const booksElement = document.querySelector(selectors.books);
const addButtonElement = document.querySelector(selectors.addButton);
const editButtonElement = document.querySelector(selectors.editButton);
const deleteButtonElement = document.querySelector(selectors.deleteButton);
const modalElement = document.querySelector(selectors.modal);
const modalAddButtonElement = document.querySelector(selectors.modalAddButton);
const modalCloseButtonElement = document.querySelector(
  selectors.modalCloseButton
);
const addBookForm = document.querySelector(selectors.addBookForm);

const library = [];
let chosenTarget = '';
let editMode = false;

function Book(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// ! Delete when no longer needed (Thats just a test data)
const titles = [
  'The Hobbit',
  'The Lord of the Rings',
  "Harry Potter and the Philosopher's Stone",
  'Pride and Prejudice',
  'To Kill a Mockingbird',
  '1984',
  'The Great Gatsby',
  'Moby Dick',
  'War and Peace',
  'Ulysses',
];
const authors = [
  'J.R.R. Tolkien',
  'J.R.R. Tolkien',
  'J.K. Rowling',
  'Jane Austen',
  'Harper Lee',
  'George Orwell',
  'F. Scott Fitzgerald',
  'Herman Melville',
  'Leo Tolstoy',
  'James Joyce',
];
const pages = [310, 400, 250, 281, 328, 200, 180, 634, 1225, 730];
for (let i = 0; i < 10; i++) {
  library.push(new Book(titles[i], authors[i], pages[i]));
}
// !End

const createElement = (tag, className, innerHTML = '') => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = innerHTML;
  return element;
};

const createBookElement = (book) => {
  const bookElement = createElement('div', 'book');
  const titleElement = createElement('h2', 'book-title', book.title);
  const authorElement = createElement('p', 'book-author', book.author);
  const pagesElement = createElement('p', 'book-pages', book.pages);

  bookElement.appendChild(titleElement);
  bookElement.appendChild(authorElement);
  bookElement.appendChild(pagesElement);

  return bookElement;
};

const addBookToLibrary = () => {
  library.push(new Book('Mandolorian', 'By Disney', 250));
  const addedBook = library[library.length - 1];
  const newElement = createBookElement(addedBook);
  booksElement.appendChild(newElement);
};

const bookElementArray = library.map((book) => createBookElement(book));

const showOptionButtons = () => {
  editButtonElement.classList.add('show');
  deleteButtonElement.classList.add('show');
};

const hideOptionButtons = () => {
  editButtonElement.classList.remove('show');
  deleteButtonElement.classList.remove('show');
};

const getIndexOfCurrentElement = (target) => {
  return [...booksElement.children].indexOf(target);
};

const clearValue = () => {
  addBookForm.bookTitle.value = '';
  addBookForm.bookAuthor.value = '';
  addBookForm.bookPages.value = '';
};

bookElementArray.forEach((singleBookElement) =>
  booksElement.appendChild(singleBookElement)
);

booksElement.addEventListener('click', ({ target }) => {
  if (!target.matches('.book')) return;

  if (!chosenTarget) {
    target.classList.toggle('is-chosen');
    showOptionButtons();
    chosenTarget = target;
  } else if (target.matches('.is-chosen')) {
    target.classList.toggle('is-chosen');
    hideOptionButtons();
    chosenTarget = '';
  }
});

addButtonElement.addEventListener('click', () => {
  clearValue();
  modalElement.showModal();
});

deleteButtonElement.addEventListener('click', () => {
  const indexOfElement = getIndexOfCurrentElement(chosenTarget);
  library.splice(indexOfElement, 1);
  booksElement.removeChild(chosenTarget);
  chosenTarget = '';
  hideOptionButtons();
});

editButtonElement.addEventListener('click', () => {
  const indexOfElement = getIndexOfCurrentElement(chosenTarget);
  const book = library[indexOfElement];
  modalElement.showModal();
  addBookForm.bookTitle.value = book.title;
  addBookForm.bookAuthor.value = book.author;
  addBookForm.bookPages.value = book.pages;
  editMode = true;
});

modalCloseButtonElement.addEventListener('click', () => {
  modalElement.close();
});

addBookForm.addEventListener('submit', ({ target }) => {
  if (editMode) {
    const indexOfElement = getIndexOfCurrentElement(chosenTarget);
    const book = new Book(
      target.bookTitle.value,
      target.bookAuthor.value,
      target.bookPages.value
    );
    library[indexOfElement] = book;
    console.log(library);
    booksElement.replaceChild(
      createBookElement(book),
      booksElement.childNodes[indexOfElement]
    );
    chosenTarget = '';
    editMode = false;
    hideOptionButtons();
    return;
  }
  const book = new Book(
    target.bookTitle.value,
    target.bookAuthor.value,
    target.bookPages.value
  );
  library.push(book);
  booksElement.appendChild(createBookElement(book));
});
