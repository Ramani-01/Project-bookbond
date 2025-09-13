// GenresBookList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GenresBookList.css";
import { toast } from "react-toastify";

function GenresBookList({ genre }) {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [addedBooks, setAddedBooks] = useState({});

  useEffect(() => {
    setBooks([]);
    setStartIndex(0);
    setHasMore(true);
  }, [genre]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&startIndex=${startIndex}&maxResults=30`
        );
        const allBooks = res.data.items || [];
        setBooks((prevBooks) => [...prevBooks, ...allBooks]);

        if (allBooks.length < 30) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [startIndex, genre]);

  const loadMore = () => {
    setStartIndex((prevIndex) => prevIndex + 30);
  };

  const handleWantToRead = async (book) => {
    try {
      const payload = {
        title: book.volumeInfo.title,
        coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
      };

      const res = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Added to your library!");
        setAddedBooks(prev => ({ ...prev, [book.id]: true }));
      } else {
        console.error('❌ Failed to add book');
      }
    } catch (err) {
      console.error('❌ Error adding book:', err);
    }
  };

  return (
    <div className="genres-book-container">
      <h2 className="genre-title">{genre} Books</h2>
      
      <div className="book-list">
        {books.length === 0 && loading && (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-thumbnail"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line" style={{ width: "60%" }}></div>
                </div>
              </div>
            ))}
          </>
        )}

        {books.length > 0 ? (
          <>
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                    />
                  ) : (
                    <div className="book-cover-placeholder">
                      <i className="fas fa-book"></i>
                    </div>
                  )}
                </div>
                
                <div className="book-content">
                  <div className="book-info">
                    <h4>{book.volumeInfo.title}</h4>
                    <p className="book-author">
                      by {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                    </p>
                    <div className="book-meta">
                      <span className="publisher">{book.volumeInfo.publisher || "N/A"}</span>
                      <span className="published-date">{book.volumeInfo.publishedDate || "N/A"}</span>
                    </div>
                  </div>

                  <div className="button-group">
                    {book.accessInfo?.pdf?.isAvailable && book.accessInfo?.pdf?.acsTokenLink ? (
                      <a
                        href={book.accessInfo.pdf.acsTokenLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        <i className="fas fa-file-pdf"></i> View PDF
                      </a>
                    ) : (
                      <span className="not-available">
                        <i className="fas fa-times-circle"></i> PDF Not Available
                      </span>
                    )}
                    
                    <button
                      className={`want-to-read-btn ${addedBooks[book.id] ? 'added' : ''}`}
                      onClick={() => handleWantToRead(book)}
                      disabled={addedBooks[book.id]}
                    >
                      {addedBooks[book.id] ? (
                        <>
                          <i className="fas fa-check"></i> Added
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus"></i> Want to Read
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="load-more-btn"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-arrow-down"></i> Load More
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          !loading && <p className="no-results">No results found for "{genre}"</p>
        )}
      </div>
    </div>
  );
}

export default GenresBookList;