import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import './BookCard.css';
import './GenresList.css';


const fallbackImage = 'https://via.placeholder.com/128x195?text=No+Cover';
const notFoundImage = '/Images/BooksNotFoundImg1.png'; // corrected to match your filename

const genreMap = {
  "Children's": 'Juvenile',
  'Science Fiction': 'Sci-Fi',
  'Non-Fiction': 'Nonfiction',
  'Literary Fiction': 'Fiction',
};

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [query, setQuery] = useState('');
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [savedBooks, setSavedBooks] = useState({}); // track saved book IDs

  const searchBooks = async (searchTerm) => {
    try {
      setLoading(true);
      setErrorOccurred(false);
      const mappedGenre = genreMap[selectedGenre] || selectedGenre;
      const genreQuery = mappedGenre ? `+subject:${mappedGenre}` : '';
      const finalQuery = searchTerm || query || 'book';

      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          finalQuery + genreQuery
        )}&maxResults=20&orderBy=relevance`
      );

      setBooks(res.data.items || []);
      setQuery(finalQuery);
    } catch (error) {
      console.error('Error fetching books:', error);
      setErrorOccurred(true);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const onGenreSelect = (genre) => {
    const cleanGenre = genre === 'All' ? '' : genre;
    setSelectedGenre(cleanGenre);
    searchBooks(query);
  };

  const saveBook = async (book) => {
    try {
      const info = book.volumeInfo;
      const newBook = {
        title: info.title || 'Untitled',
        coverImage:
          info.imageLinks?.thumbnail ||
          info.imageLinks?.smallThumbnail ||
          fallbackImage,
      };
      await axios.post('http://localhost:3001/books', newBook);
      setSavedBooks((prev) => ({ ...prev, [book.id]: true }));
    } catch (err) {
      console.error('Failed to save book:', err);
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
    } catch (err) {
      console.error('Failed to remove book:', err);
    }
  };

  return (
    <div className="search-page">
      <SearchBar onSearch={searchBooks} />

      <div className="genre-list-container">
        {['All', 'Biography', 'Non-Fiction', 'Thriller', 'Romance', 'Fiction', "Children's", 'Science Fiction', 'Literary Fiction', 'Psychology', 'Self-Help', 'History'].map(
          (genre) => (
            <button
              key={genre}
              className={`genre-button ${
                selectedGenre === genre || (genre === 'All' && !selectedGenre)
                  ? 'active'
                  : ''
              }`}
              onClick={() => onGenreSelect(genre)}
            >
              {genre}
            </button>
          )
        )}
      </div>

      {loading ? (
        <p className="loading"></p>
      ) : errorOccurred || books.length === 0 ? (
        <div className="no-results">
          <img
            src={notFoundImage}
            alt="No books found"
            style={{ maxWidth: '300px', margin: '20px auto', display: 'block' }}
          />
        </div>
      ) : (
        <div className="search-book-grid">
          {books.map((book) => {
            const info = book.volumeInfo;
            if (!info) return null;

            let thumbnail =
              info.imageLinks?.thumbnail ||
              info.imageLinks?.smallThumbnail ||
              fallbackImage;

            thumbnail = thumbnail.replace(/zoom=\d/, 'zoom=4');

            const rating = info.averageRating || 0;
            const isSaved = savedBooks[book.id];

            return (
              <div
                key={book.id}
                className={`book-card-grid ${activeCard === book.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveCard(book.id)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ position: 'relative' }}
              >
                <img
                  src={thumbnail}
                  alt={info.title || 'Book cover'}
                  className="book-thumbnail"
                />
                <h2 className="book-title">{info.title || 'Untitled'}</h2>

                <div className="book-rating">
                  {'★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))}
                </div>

                {activeCard === book.id && (
                  <div className="overlay">
                    {isSaved ? (
                    <button className="want-to-read-btn" disabled>
                      Added
                    </button>
                  ) : (
                    <button className="want-to-read-btn" onClick={() => saveBook(book)}>
                      Want to Read
                    </button>
                  )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
