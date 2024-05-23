import { Carousel, Divider } from "antd";

import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import BooksEntriesCard from "../Components/BooksEntriesCard";
import ShoppingCartModal from "../Components/ShoppingCartModal";

import ProfileUpdateModal from "../Components/ProfileUpdateModal";
import sliderPic1 from "../assets/Slider Pic 1.jfif";
import sliderPic2 from "../assets/Slider Pic 2.jfif";
import sliderPic3 from "../assets/Slider Pic 3.jfif";
import SideBar from "../Components/SideBar";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const search = useSelector((state) => state.search);

  const priceFilter = useSelector((state) => state.priceFilter);
  const genreFilter = useSelector((state) => state.genreFilter);

  useEffect(() => {
    const fetchData = async function () {
      const fetchFn = await fetch("http://localhost:3000/books");
      const response = await fetchFn.json();
      let booksFetched = response;
      if (search) {
        booksFetched = booksFetched.filter((book) =>
          book.BookName.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (genreFilter) {
        booksFetched = booksFetched.filter(
          (book) => book.BookGenre === genreFilter
        );
      }
      if (priceFilter) {
        if (priceFilter === "Low to High") {
          booksFetched = booksFetched.sort((book1, book2) =>
            book1.Price > book2.Price ? 1 : -1
          );
        } else if (priceFilter === "High to Low") {
          booksFetched = booksFetched.sort((book1, book2) => {
            book1.Price > book2.Price ? -1 : 1;
          });
        }
      }
      setBooks(booksFetched);
    };
    fetchData();
    let interval = setInterval(() => fetchData(), 5000);
    console.log("fetching...");
    return () => {
      clearInterval(interval);
    };
  }, [search, genreFilter, priceFilter]);

  return (
    <div className="page">
      <SideBar homePage={true} search={true} />

      <Carousel className="carousel" autoplay>
        <div>
          <img className="carousel-pic" src={sliderPic1} />
        </div>
        <div>
          <img className="carousel-pic" src={sliderPic2} />
        </div>
        <div>
          <img className="carousel-pic" src={sliderPic3} />
        </div>
      </Carousel>

      <Divider>
        {
          <h2
            className="home-divider-text"
            style={{
              color: "black",
              backgroundColor: "white",
              padding: "0 15px",
              borderRadius: "40px",
              opacity: "90%",
            }}
          >
            Explore Books
          </h2>
        }
      </Divider>
      <div className="books-section">
        {books.map((book) => (
          <BooksEntriesCard book={book} />
        ))}
      </div>

      <ShoppingCartModal />

      <ProfileUpdateModal />
    </div>
  );
}
