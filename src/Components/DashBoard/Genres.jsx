import React from "react";
import Header from "../Header";
import GenresList from "./GenresList";
import SearchPage from "./Search/SearchPage";

function Genres(){
    return(
        <div>
            <div>
            <Header/>
            </div>
            <div style={{ margin: "70px 0" }}></div> 
            <div>
                <SearchPage/>
            </div>
        </div>
    );
}

export default Genres;