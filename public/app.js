//Function to get book list and structure data to display
function fetchBooks() {
    fetch('/books')
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('book-list');
        list.innerHTML = '';
        data.forEach(book => {
          const li = document.createElement('li');
          li.textContent = `${book.Title} by ${book.Authors} (${book.Year}) [${book.Genre}] Book ID: ${book.BookID}`;
          list.appendChild(li);
        });
      });
  }
  
  //Function to get new and structure data to display
  function addMember() {
    const name = document.getElementById('member-name').value;
    const email = document.getElementById('member-email').value;
    fetch('/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then(res => res.json())
      .then(data => {
        alert('Member added with ID: ' + data.MemberID);
      });
  }
  
  //Function to get book borrowed and structure data to display
  function borrowBook() {
    const memberId = document.getElementById('borrow-member-id').value;
    const bookId = document.getElementById('borrow-book-id').value;
    fetch('/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, bookId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return alert(data.error);
        alert('Book borrowed!');
      });
  }
  
  //Function to get book returned and structure data to display
  function returnBook() {
    const bookId = document.getElementById('return-book-id').value;
    fetch('/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId })
    })
      .then(res => res.json())
      .then(data => {
        alert('Book returned!');
      });
  }
  
  fetchBooks();
