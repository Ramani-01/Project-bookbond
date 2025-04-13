import react, {useEffect, useState} from "react";
// import GenresList from "./GenresList";
import axios from "axios";
import "./GenresBookList.css";


function GenresBookList({ genre }){
    const [books, setBooks] = useState([]);

        useEffect(()=>{
            axios
            .get(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=20`)
            .then(res => setBooks(res.data.items || []))
            .catch((err) => console.error("Error fetching books:", err));
        }, [genre]);
       
        return (
            <div className="book-list">  
              {books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className="book-card">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail}
                      alt={book.volumeInfo.title}
                      width="100"
                    />
                    <h4>{book.volumeInfo.title}</h4>
                    <p>{book.volumeInfo.authors?.join(", ")}</p>
                  </div>
                ))
              ) : (
                <p>Loading or no results for "{genre}"</p>
              )}
            </div>
          );
}

export default GenresBookList;