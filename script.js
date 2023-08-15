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

const chosenTarget = {
  target: null,
  setChosenTarget: (target) => {
    chosenTarget.target = target;
  },
  clearChosenTarget: () => {
    chosenTarget.target = null;
  },
  getTarget: () => chosenTarget.target,
};

const editMode = {
  mode: null,
  enterEditMode: () => {
    editMode.mode = true;
  },
  exitEditMode: () => {
    editMode.mode = false;
  },
  getMode: () => editMode.mode,
};

const library = {
  books: [],
  addBookToLibrary: (title, author, pages, read) => {
    const book = new Book(title, author, pages, read);
    library.books.push(book);
  },

  deleteBookFromLibrary: (index) => {
    library.books.splice(index, 1);
  },

  editBookInLibrary: (index, book) => {
    library.books[index] = book;
  },

  getLastAddedBook: () => {
    return library.books[library.books.length - 1];
  },
};

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
  library.books.push(new Book(titles[i], authors[i], pages[i]));
}
// !End

const createElement = (tag, className, innerHTML = '') => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = innerHTML;
  return element;
};

const getSelectedValue = () => {
  let selected = document.querySelector("input[name='isRead']:checked");
  return selected.value === 'true';
};

const createBookElement = (book) => {
  const bookElement = createElement('div', 'book');
  const titleElement = createElement('h2', 'book-title', book.title);
  const authorElement = createElement('p', 'book-author', book.author);
  const pagesElement = createElement('p', 'book-pages', `${book.pages} pages`);
  const isReadElement = createElement(
    'p',
    'book-is-read',
    book.read ? 'Is read' : 'Not Read'
  );

  bookElement.appendChild(titleElement);
  bookElement.appendChild(authorElement);
  bookElement.appendChild(pagesElement);
  bookElement.appendChild(isReadElement);

  return bookElement;
};

const bookElementArray = library.books.map((book) => createBookElement(book));

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

  if (!chosenTarget.getTarget()) {
    target.classList.toggle('is-chosen');
    showOptionButtons();
    chosenTarget.setChosenTarget(target);
  } else if (target.matches('.is-chosen')) {
    target.classList.toggle('is-chosen');
    hideOptionButtons();
    chosenTarget.clearChosenTarget();
  }
});

addButtonElement.addEventListener('click', () => {
  clearValue();
  modalElement.showModal();
});

deleteButtonElement.addEventListener('click', () => {
  const indexOfElement = getIndexOfCurrentElement(chosenTarget.getTarget());
  library.deleteBookFromLibrary(indexOfElement);
  booksElement.removeChild(chosenTarget.getTarget());
  chosenTarget.clearChosenTarget();
  hideOptionButtons();
});

editButtonElement.addEventListener('click', () => {
  const indexOfElement = getIndexOfCurrentElement(chosenTarget.getTarget());
  const book = library.books[indexOfElement];
  modalElement.showModal();
  addBookForm.bookTitle.value = book.title;
  addBookForm.bookAuthor.value = book.author;
  addBookForm.bookPages.value = book.pages;
  editMode.enterEditMode();
});

modalCloseButtonElement.addEventListener('click', () => {
  modalElement.close();
});

addBookForm.addEventListener('submit', ({ target }) => {
  if (editMode.getMode()) {
    const indexOfElement = getIndexOfCurrentElement(chosenTarget.getTarget());
    const book = new Book(
      target.bookTitle.value,
      target.bookAuthor.value,
      target.bookPages.value,
      getSelectedValue()
    );
    library.editBookInLibrary(indexOfElement, book);
    booksElement.replaceChild(
      createBookElement(book),
      booksElement.childNodes[indexOfElement]
    );
    chosenTarget.clearChosenTarget();
    editMode.exitEditMode();
    hideOptionButtons();
    return;
  }
  library.addBookToLibrary(
    target.bookTitle.value,
    target.bookAuthor.value,
    target.bookPages.value,
    getSelectedValue()
  );
  console.log(library);
  booksElement.appendChild(createBookElement(library.getLastAddedBook()));
});
