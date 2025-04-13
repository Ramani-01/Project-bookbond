import React from "react";
import { useParams } from "react-router-dom"; 
import GenresBookList from "./GenresBookList";


function SelectGenres(){
    const { genre } = useParams(); //  extract genre from URL

    return (
      <div>
        <h3>Showing results for: <em>{genre}</em></h3>
        <GenresBookList genre={genre} />
      </div>
    )
}

export default SelectGenres;