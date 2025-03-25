import React from "react";

function BookList() {
  // Define the book list array properly
  const booklist = [
    {
      id: 1,
      image:
        "https://m.media-amazon.com/images/I/71yR+jQLqXL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh2jMiDRp-M4lqgROL9gkiW_VPALCu1ICjzA&s",
    },
    {
      id: 3,
      image:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQoGcdYp9zIgF65HXN9e1Oq4LSg27nIOkRk4omDYqb_OmhTW7SVmimNuUqcQsQnhUsOf_OeCEE3SJ6eqw6hce-W5SWQEvptPePUHLdj-PIUz6Pe1_lJm0YT7g&usqp=CAE",
    },
    {
        id: 4,
        image:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTBpJfYZ66btvBBGBXG4R-4VKREQHeLmxQHCs0GmutQu0qlam5ywiV-gSeu7cQa_6jcuebZUIWnx8MAdB0_6oscDeITP7vEyHqb_CHjPVaL&usqp=CAE",
    },
    {
        id: 5,
        image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1558586807i/45167624.jpg",

    },
    {
        id: 6,
        image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1423763749i/6900.jpg",
    },
    {
        id: 7,
        image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg"
    },
    {
        id: 8,
        image:"https://m.media-amazon.com/images/I/41Dr37NRrNL._SR290,290_.jpg",
    },
    {
        id: 9,
        image:"https://m.media-amazon.com/images/I/81xeillF6tL._UF1000,1000_QL80_.jpg",
    },
    

  ];
  return (
    <div className="new-release">
        <p>New Releases</p>

        <div className="scroll-container">
            <div className="book-container">
                {booklist.map((item) => (
                    <div key={item.id}>
                        <div className="imgStyle">
                        <img src={item.image} className="book-image" alt="Book Cover"  />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

}

export default BookList;
