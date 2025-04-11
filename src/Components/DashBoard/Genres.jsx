import React from "react";
import Header from "../Header";
import GenresList from "./GenresList";

function Genres(){
    return(
        <div>
            <div>
            <Header/>
            </div>
            <div>
            <GenresList/>
            </div>
        </div>
    );
}

export default Genres;