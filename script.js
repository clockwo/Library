const selectors = {
  books: '[data-js-books]',
  addButton: '[data-js-add-button]',
  editButton: '[data-js-edit-button]',
  deleteButton: '[data-js-delete-button]',
  modal: '[data-js-modal]',
  modalCloseButton: '[data-js-modal-close-button]',
  addBookForm: '[data-js-form]',
};

const booksElement = document.querySelector(selectors.books);
const addButtonElement = document.querySelector(selectors.addButton);
const editButtonElement = document.querySelector(selectors.editButton);
const deleteButtonElement = document.querySelector(selectors.deleteButton);
const modalElement = document.querySelector(selectors.modal);
const modalCloseButtonElement = document.querySelector(
  selectors.modalCloseButton
);
const addBookForm = document.querySelector(selectors.addBookForm);

class chosenTarget {
  static target = null;

  static setChosenTarget (target)  {
    chosenTarget.target = target;
  }
  static clearChosenTarget ()  {
    chosenTarget.target = null;
  }

  static getTarget () {
    return chosenTarget.target
  }

}

class editMode {
  static mode = null;

  static enterEditMode() {
    editMode.mode = true;
  }

  static exitEditMode() {
    editMode.mode = false
  }

  static getMode() {
    return editMode.mode
  }
}

class Library {
  static books = [];

  static addBookToLibrary (title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    Library.books.push(book);
  }

  static deleteBookFromLibrary(index)  {
    Library.books.splice(index, 1);
  }

  static editBookInLibrary (index, book)  {
    Library.books[index] = book;
  }

  static getLastAddedBook() {
    return Library.books[Library.books.length - 1];
  }
}

class Book {
  constructor(title, author, pages, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  getElement = () => {
    const bookElement = createElement('div', 'book');
    const titleElement = createElement('h2', 'book-title', this.title);
    const authorElement = createElement('p', 'book-author', this.author);
    const pagesElement = createElement('p', 'book-pages', `${this.pages} pages`);
    const isReadElement = createElement(
      'p',
      'book-is-read',
      this.read ? 'Is read' : 'Not Read'
    );

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(pagesElement);
    bookElement.appendChild(isReadElement);

    return bookElement;
  }
}

// ! Delete when no longer needed (That's just a test data)
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
  Library.books.push(new Book(titles[i], authors[i], pages[i]));
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

const bookElementArray = Library.books.map((book) => book.getElement());

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
  Library.deleteBookFromLibrary(indexOfElement);
  booksElement.removeChild(chosenTarget.getTarget());
  chosenTarget.clearChosenTarget();
  hideOptionButtons();
});

editButtonElement.addEventListener('click', () => {
  const indexOfElement = getIndexOfCurrentElement(chosenTarget.getTarget());
  const book = Library.books[indexOfElement];
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
    Library.editBookInLibrary(indexOfElement, book);
    booksElement.replaceChild(
      book.getElement(),
      booksElement.childNodes[indexOfElement]
    );
    chosenTarget.clearChosenTarget();
    editMode.exitEditMode();
    hideOptionButtons();
    return;
  }
  Library.addBookToLibrary(
    target.bookTitle.value,
    target.bookAuthor.value,
    target.bookPages.value,
    getSelectedValue()
  );
  console.log(Library);
  booksElement.appendChild(Library.getLastAddedBook().getElement());
});
