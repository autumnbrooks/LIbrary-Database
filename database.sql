DROP TABLE IF EXISTS Borrow_Records;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Book_Authors;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Authors;

-- Table creation
CREATE TABLE Authors (
    AuthorID INTEGER PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

CREATE TABLE Books (
    BookID INTEGER PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Genre VARCHAR(50),
    Year INTEGER
);

CREATE TABLE Book_Authors (
    BookID INTEGER,
    AuthorID INTEGER,
    PRIMARY KEY (BookID, AuthorID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);

CREATE TABLE Members (
    MemberID INTEGER PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    MembershipDate DATE
);

CREATE TABLE Borrow_Records (
    RecordID INTEGER PRIMARY KEY,
    MemberID INTEGER,
    BookID INTEGER,
    BorrowDate DATE,
    ReturnDate DATE,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

CREATE TABLE Library_Branch (
    BranchID INT PRIMARY KEY,
    BranchName VARCHAR(100) NOT NULL,
    Location VARCHAR(200),
    PhoneNumber VARCHAR(15)
);


-- Sample data
INSERT INTO Authors VALUES (1, 'Rebecca Yarros'), (2, 'Emily Henry');
INSERT INTO Books VALUES (101, 'Fourth Wing', 'Adventure', 2023), (102, 'Just for the Summer', 'Romance', 2024);
INSERT INTO Book_Authors VALUES (101, 1), (102, 2);
INSERT INTO Members VALUES (1, 'Kailyn Mac', 'kailyn@icloud.com', '2024-01-15');
INSERT INTO Borrow_Records VALUES (1, 1, 101, '2025-04-01', NULL);

-- 5 distinct queries
SELECT Books.BookID, Title, Genre, Year, GROUP_CONCAT(Authors.Name, ', ') AS Authors
FROM Books
JOIN Book_Authors ON Books.BookID = Book_Authors.BookID
JOIN Authors ON Book_Authors.AuthorID = Authors.AuthorID
GROUP BY Books.BookID;


SELECT Members.MemberID, Members.Name, Borrow_Records.BorrowDate, Borrow_Records.BookID
FROM Members
JOIN Borrow_Records ON Members.MemberID = Borrow_Records.MemberID
WHERE Borrow_Records.BorrowDate BETWEEN '2025-04-01' AND '2025-04-30';


INSERT INTO Members (Name, Email, MembershipDate)
VALUES ('Bianca Morgan', 'bianca.morgan@gmail.com', '2025-04-14');

UPDATE Books
SET Genre = 'Fantasy'
WHERE BookID = 101;

DELETE FROM Borrow_Records
WHERE RecordID = 1;
