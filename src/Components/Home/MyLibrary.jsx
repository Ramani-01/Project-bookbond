import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyLibrary.css";
import "./../DashBoard/Search/BookCard.css";

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const fetchBooks = () => {
    axios.get("http://localhost:3001/books")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBook = async (id) => {
    if (!id) {
      console.error("Cannot delete book - ID is undefined");
      return;
  }
    try {
        const response = await axios.delete(`http://localhost:3001/books/${id}`);
        console.log("Book deleted:", response.data);
      
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (err) {
     
        console.error("Failed to delete book:", err.response ? err.response.data : err.message);
    }
};


  return (
    <div className="my-library-container">
      <h2>My Library</h2>
      {books.length === 0 ? (
        <p className="no-results">No books in your library yet.</p>
      ) : (
        <div className="search-book-grid">
          {books.map((book, index) => (
            <div
              key={index}
              className={`book-card-grid ${activeCard === index ? 'active' : ''}`}
              onClick={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ position: 'relative' }}
            >
              <img src={book.coverImage} alt={book.title} />
              <div className="book-title">{book.title}</div>
              <div className="book-rating">
                {'★'.repeat(Math.floor(book.star)) + '☆'.repeat(5 - Math.floor(book.star))}
              </div>
              {activeCard === index && (
                <button
                  className="delete-book-btn"
                  onClick={() => deleteBook(book._id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
