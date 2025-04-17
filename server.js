const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./library.db');

app.use(bodyParser.json());
app.use(express.static('public'));

//Get books list
app.get('/books', (req, res) => {
  db.all(`
    SELECT Books.BookID, Books.Title, Books.Genre, Books.Year, GROUP_CONCAT(Authors.Name, ', ') AS Authors
    FROM Books
    JOIN Book_Authors ON Books.BookID = Book_Authors.BookID
    JOIN Authors ON Book_Authors.AuthorID = Authors.AuthorID
    GROUP BY Books.BookID;
  `
  //Error handling
  , [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//Get members
app.get('/members', (req, res) => {
  db.all('SELECT * FROM Members', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Upon getting new user member data, insert data to database
app.post('/members', (req, res) => {
  const { name, email } = req.body;
  const date = new Date().toISOString().split('T')[0];
  db.run('INSERT INTO Members (Name, Email, MembershipDate) VALUES (?, ?, ?)', [name, email, date], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ MemberID: this.lastID });
  });
});

//Upon getting new borrow data, insert data to database
app.post('/borrow', (req, res) => {
  const { memberId, bookId } = req.body;
  const date = new Date().toISOString().split('T')[0];
  db.get('SELECT * FROM Borrow_Records WHERE BookID = ? AND ReturnDate IS NULL', [bookId], (err, row) => {
    if (row) return res.status(400).json({ error: 'Book is already borrowed' });
    db.run('INSERT INTO Borrow_Records (MemberID, BookID, BorrowDate) VALUES (?, ?, ?)', [memberId, bookId, date], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ RecordID: this.lastID });
    });
  });
});

// Upon getting new return data, insert data to database
app.post('/return', (req, res) => {
  const { bookId } = req.body;
  const date = new Date().toISOString().split('T')[0];
  db.run('UPDATE Borrow_Records SET ReturnDate = ? WHERE BookID = ? AND ReturnDate IS NULL', [date, bookId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
