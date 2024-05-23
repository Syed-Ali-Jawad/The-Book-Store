import { Table, Button, Tag, Image, Card, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setBookToEdit, setIsBookEditModalOpen } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import BookSellModal from "../Components/BookSellModal";

import BookEditModal from "../Components/BookEditModal";
import SideBar from "../Components/SideBar";

export default function SellerPage() {
  const [sellerBooks, setSellerBooks] = useState();
  const search = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => state.sellerId);

  const [totalBooksSold, setTotalBooksSold] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const dateFilter = useSelector((state) => state.dateFilter);

  const { Column } = Table;
  useEffect(() => {
    const fetchData = async function () {
      let fetchFn = null;
      if (dateFilter && dateFilter !== "1/1/1970") {
        fetchFn = await fetch(
          `http://localhost:3000/books?_embed=${sellerId}&DateOfPostingBook=${dateFilter}`
        );
      } else {
        fetchFn = await fetch(`http://localhost:3000/books?_embed=${sellerId}`);
      }
      const response = await fetchFn.json();
      let books = response;
      const bookSold = books.reduce(
        (booksSold, book) => (booksSold += book.Sold),
        0
      );
      const revenue = books.reduce(
        (revenue, book) => (revenue += book.Revenue),
        0
      );
      setTotalBooksSold(bookSold);
      setTotalRevenue(revenue);
      if (search) {
        books = books.filter((book) =>
          book.BookName.toLowerCase().includes(search.toLowerCase())
        );
      }

      setSellerBooks(books);
    };
    fetchData();
    let interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, [dateFilter, search]);

  function patchStock(bookId, stockStatus) {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: "PATCH",
      body: JSON.stringify({
        Stock: stockStatus,
      }),
    });
  }

  function removeBookHandler(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`, { method: "DELETE" });
  }

  async function editBookHandler(bookId) {
    const fetchFn = await fetch(`http://localhost:3000/books/${bookId}`);
    const response = await fetchFn.json();
    const bookData = response;
    dispatch(setBookToEdit(bookData));
    dispatch(setIsBookEditModalOpen(true));
  }
  if (sellerId) {
    return (
      <div className="page">
        <>
          <SideBar
            search={true}
            sellABook={true}
            dateFilter={true}
            logout={true}
            sellerPage={true}
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card className="revenue-book-sold-card" title="Books Sold">
              {totalBooksSold}
            </Card>
            <Card className="revenue-book-sold-card" title="Revenue (PKR)">
              {totalRevenue}
            </Card>
          </div>
          <Table
            style={{
              width: "85%",
              margin: "auto 30px auto auto",
              paddingTop: "20px",
            }}
            size="small"
            pagination="10"
            dataSource={sellerBooks}
          >
            <Column title="Book Name" dataIndex="BookName" key="Book Name" />

            <Column
              title="Book Genre"
              dataIndex="BookGenre"
              key="BookGenre"
              filters={[
                { text: "Thriller", value: "Thriller" },
                { text: "Romance", value: "Romance" },
                { text: "Mystery", value: "Mystery" },
                { text: "Science Fiction", value: "Science Fiction" },
                { text: "Historical Fiction", value: "Historical Fiction" },
                { text: "Young Adult", value: "Young Adult" },
                { text: "Horror", value: "Horror" },
              ]}
              onFilter={(value, record) => record.BookGenre === value}
            />
            <Column
              title="Date of Posting Book"
              dataIndex="DateOfPostingBook"
              key="DateofPostingBook"
              sorter={(firstDate, secondDate) =>
                firstDate === secondDate ? 0 : firstDate > secondDate ? 1 : -1
              }
            />
            <Column
              title="Book Image"
              dataIndex="BookImage"
              key="BookImage"
              render={(BookImage) => (
                <Image style={{ width: "100px" }} src={BookImage} />
              )}
            />
            <Column
              title="Price (PKR)"
              dataIndex="Price"
              key="Price"
              sorter={(firstPrice, secondPrice) =>
                firstPrice === secondPrice
                  ? 0
                  : firstPrice > secondPrice
                  ? 1
                  : -1
              }
            />
            <Column
              title="Books Sold"
              dataIndex="Sold"
              key="Books Sold"
              sorter={(firstBookSold, secondBookSold) =>
                firstBookSold === secondBookSold
                  ? 0
                  : firstBookSold > secondBookSold
                  ? 1
                  : -1
              }
            />
            <Column
              title="Revenue (PKR)"
              dataIndex="Revenue"
              key="Revenue"
              sorter={(firstRev, secondRev) =>
                firstRev === secondRev ? 0 : firstRev > secondRev ? 1 : -1
              }
            />
            <Column
              title="Stock"
              dataIndex="Stock"
              key="Stock"
              render={(Stock) => {
                if (Stock === "Available") {
                  return <Tag color="green">Available</Tag>;
                } else {
                  return <Tag color="red">Out of Stock</Tag>;
                }
              }}
            />
            <Column
              title="Manage Stock"
              dataIndex="id"
              render={(id) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left ",
                  }}
                >
                  <Button
                    onClick={() => patchStock(id, "Available")}
                    type="link"
                  >
                    Available
                  </Button>

                  <Button
                    type="link"
                    onClick={() => patchStock(id, "Out of Stock")}
                  >
                    Out of Stock
                  </Button>

                  <Button onClick={() => removeBookHandler(id)} type="link">
                    Remove Book
                  </Button>
                  <Button onClick={() => editBookHandler(id)} type="link">
                    Edit Price
                  </Button>
                </div>
              )}
            />
          </Table>
          <BookSellModal />
          <BookEditModal />
        </>
      </div>
    );
  } else {
    return (
      <p>
        Please Sign in to your seller account{" "}
        <Typography.Link>
          <Link style={{ color: "blue" }} to="/login">
            Login
          </Link>
        </Typography.Link>
      </p>
    );
  }
}
