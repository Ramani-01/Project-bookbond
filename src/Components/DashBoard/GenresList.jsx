import React from "react";
import "./GenresList.css";
import Biography from "./../../assets/GenresListImg/biography.png";
import Children from "./../../assets/GenresListImg/children's.png";
import Fiction from "./../../assets/GenresListImg/Fiction.png";
import Romance from "./../../assets/GenresListImg/romance.png";
import Thriller from "./../../assets/GenresListImg/thriller.png";
import nonfiction from "./../../assets/GenresListImg/Non-Fiction.png";



function GenresList(){
    return(
        <div>
            <div className="List-container">
               <table>
                <tbody>
                <tr className="row-container">        
                        <td className="genreslist">
                            <img src={Biography} alt="Biography" width="50"/> Biography</td>

                        <td className="genreslist">
                            <img src = {nonfiction} alt = "Non-Fiction" witch ={40} height={40} />
                            Non-Fiction</td>

                        <td className="genreslist">
                            <img src = {Thriller} alt ="Thriller" width="50"/>
                            Thriller</td>
                </tr>
                <tr className="row-container">
                        <td className="genreslist">
                            <img src = {Romance} alt ="Romance" width={50}/>Romance</td>
                        <td className="genreslist">
                            <img src= {Fiction} alt = "Fiction" width ={50}/>Fiction</td>
                        <td className="genreslist"> <img src = {Children} alt ="Children" width = "50"/>
                        Children's</td>
                </tr>
                </tbody>
               </table>
            </div>
        </div>
       
    );
}

export default GenresList;