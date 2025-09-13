import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import "./BookCard.css";
import "./GenresList.css";
import "./SearchPage.css";

const fallbackImage = "https://via.placeholder.com/128x195?text=No+Cover";
const notFoundImage = "/Images/BooksNotFoundImg1.png";

const genreMap = {
  "Children's": "Juvenile",
  "Science Fiction": "Sci-Fi",
  "Non-Fiction": "Nonfiction",
  "Literary Fiction": "Fiction",
};

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [query, setQuery] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [savedBooks, setSavedBooks] = useState({});

  const searchBooks = async (searchTerm) => {
    try {
      setLoading(true);
      setErrorOccurred(false);

      const mappedGenre = genreMap[selectedGenre] || selectedGenre;
      const genreQuery = mappedGenre ? `+subject:${mappedGenre}` : "";
      const finalQuery = searchTerm || query || "book";

      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          finalQuery
        )}${genreQuery}&maxResults=20&orderBy=relevance`
      );

      console.log("Fetched books:", res.data.items);

      setBooks(res.data.items || []);
      setQuery(finalQuery);
    } catch (error) {
      console.error("Error fetching books:", error);
      setErrorOccurred(true);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const onGenreSelect = (genre) => {
    const cleanGenre = genre === "All" ? "" : genre;
    setSelectedGenre(cleanGenre);
    searchBooks(query);
  };

  const saveBook = async (book) => {
    try {
      const info = book.volumeInfo;
      let thumbnail = fallbackImage;
      if (info.imageLinks) {
        thumbnail =
          info.imageLinks.large ||
          info.imageLinks.medium ||
          info.imageLinks.thumbnail ||
          info.imageLinks.smallThumbnail ||
          fallbackImage;
      }
      if (!info.imageLinks && info.industryIdentifiers?.[0]?.identifier) {
        thumbnail = `https://covers.openlibrary.org/b/isbn/${info.industryIdentifiers[0].identifier}-L.jpg`;
      }

      const newBook = {
        id: book.id,
        title: info.title || "Untitled",
        coverImage: thumbnail,
      };

      await axios.post("http://localhost:3001/books", newBook);
      setSavedBooks((prev) => ({ ...prev, [book.id]: true }));
      
      // Show success feedback
      const successEvent = new CustomEvent('showToast', {
        detail: { message: 'Book added to your library!', type: 'success' }
      });
      window.dispatchEvent(successEvent);
    } catch (err) {
      console.error("Failed to save book:", err);
      
      // Show error feedback
      const errorEvent = new CustomEvent('showToast', {
        detail: { message: 'Failed to add book. Please try again.', type: 'error' }
      });
      window.dispatchEvent(errorEvent);
    }
  };

  const removeBook = async (book) => {
    try {
      await axios.delete(`http://localhost:3001/books/${book.id}`);
      setSavedBooks((prev) => {
        const copy = { ...prev };
        delete copy[book.id];
        return copy;
      });
      
      // Show success feedback
      const successEvent = new CustomEvent('showToast', {
        detail: { message: 'Book removed from your library!', type: 'success' }
      });
      window.dispatchEvent(successEvent);
    } catch (err) {
      console.error("Failed to remove book:", err);
      
      // Show error feedback
      const errorEvent = new CustomEvent('showToast', {
        detail: { message: 'Failed to remove book. Please try again.', type: 'error' }
      });
      window.dispatchEvent(errorEvent);
    }
  };

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-title">Discover Your Next Favorite Book</h1>
        <p className="search-subtitle">Explore millions of titles across all genres</p>
      </div>
      
      <SearchBar onSearch={searchBooks} />

      <div className="genre-list-container">
        {[
          "All",
          "Biography",
          "Non-Fiction",
          "Thriller",
          "Romance",
          "Fiction",
          "Children's",
          "Science Fiction",
          "Literary Fiction",
          "Psychology",
          "Self-Help",
          "History",
        ].map((genre) => (
          <button
            key={genre}
            className={`genre-button ${
              selectedGenre === genre || (genre === "All" && !selectedGenre)
                ? "active"
                : ""
            }`}
            onClick={() => onGenreSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton-container">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-line long"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-rating">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton-star"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : errorOccurred ? (
        <div className="no-results">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>We couldn't fetch books at this time. Please try again later.</p>
          <button className="retry-button" onClick={() => searchBooks(query)}>
            Try Again
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="no-results">
          <img
            src={notFoundImage}
            alt="No books found"
            className="not-found-image"
          />
          <h3>No books found</h3>
          <p>Try a different search term or browse by genre</p>
        </div>
      ) : (
        <>
          <div className="results-header">
            <h2>Search Results for "{query}"</h2>
            <span className="results-count">{books.length} books found</span>
          </div>
          <div className="search-book-grid">
            {books.map((book) => {
              const info = book.volumeInfo;
              if (!info) return null;

              const bookId = book.id || info.title;
              let thumbnail = fallbackImage;
              if (info.imageLinks) {
                thumbnail =
                  info.imageLinks.large ||
                  info.imageLinks.medium ||
                  info.imageLinks.thumbnail ||
                  info.imageLinks.smallThumbnail ||
                  fallbackImage;
              }
              if (!info.imageLinks && info.industryIdentifiers?.[0]?.identifier) {
                thumbnail = `https://covers.openlibrary.org/b/isbn/${info.industryIdentifiers[0].identifier}-L.jpg`;
              }

              const rating = info.averageRating || 0;
              const isSaved = savedBooks[bookId];

              return (
                <div
                  key={bookId}
                  className={`book-card-grid ${
                    activeCard === bookId ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveCard(bookId)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="book-image-container">
                    <img
                      src={thumbnail}
                      alt={`Book cover for ${info.title || "Untitled"}`}
                      className="book-thumbnail"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div 
                      className={`favorite-icon ${isSaved ? 'active' : ''}`}
                      onClick={() => isSaved ? removeBook(book) : saveBook(book)}
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </div>
                  </div>
                  
                  <div className="book-content">
                    <h3 className="book-title">{info.title || "Untitled"}</h3>
                    <p className="book-author">{info.authors ? info.authors.join(', ') : 'Unknown Author'}</p>
                    
                    <div className="book-rating">
                      <span className="stars">
                        {"★".repeat(Math.floor(rating)) +
                          "☆".repeat(5 - Math.floor(rating))}
                      </span>
                      <span className="rating-count">
                        ({info.ratingsCount || 0})
                      </span>
                    </div>
                    
                    <p className="book-info">
                      {info.publishedDate ? new Date(info.publishedDate).getFullYear() : ''}
                      {info.pageCount ? ` • ${info.pageCount} pages` : ''}
                    </p>
                  </div>

                  <div className="overlay">
                    {isSaved ? (
                      <button 
                        className="want-to-read-btn added"
                        onClick={() => removeBook(book)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="want-to-read-btn"
                        onClick={() => saveBook(book)}
                      >
                        Want to Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;