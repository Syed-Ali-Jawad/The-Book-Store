import { Card, Image, Button, Typography, InputNumber, List } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
export default function BooksEntriesCard({ book }) {
  const [buyerData, setBuyerData] = useState();
  const [booksQuantity, setBooksQuantity] = useState(1);
  const dispatch = useDispatch();
  const buyerId = useSelector((state) => state.buyerId);
  useEffect(() => {
    const fetchData = async function () {
      const fetchFn = await fetch(`http://localhost:3000/buyers/${buyerId}`);
      const response = await fetchFn.json();
      const buyerData = response;
      setBuyerData(buyerData);
    };
    fetchData();
    const interval = setInterval(() => fetchData(), 2000);
    return () => clearInterval(interval);
  }, [buyerData]);
  function addToCartHandler() {
    fetch(`http://localhost:3000/buyers/${buyerId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ShoppingCart: [
          ...buyerData.ShoppingCart,
          {
            BookId: book.id,
            BookImage: book.BookImage,
            BookName: book.BookName,
            BookPrice: book.Price,
            Quantity: booksQuantity,
            BookRevenue: book.Price * booksQuantity,
          },
        ],
      }),
    });
  }
  return (
    <>
      <Card
        hoverable
        className="books-entries-card"
        size="small"
        cover={
          <Image
            style={{
              width: "100%",
              height: "125px",
            }}
            src={book.BookImage}
          />
        }
      >
        <h3 style={{ height: "60px" }}>{book.BookName}</h3>
        <p>Genre: {book.BookGenre}</p>
        <p>Price: Rs {book.Price}</p>
        <p>Sold: {book.Sold}</p>

        <p>
          Quantity:
          <InputNumber
            onChange={(value) => setBooksQuantity(value)}
            style={{ width: "45px" }}
            defaultValue={1}
          />
        </p>

        <Button
          onClick={() => addToCartHandler()}
          disabled={book.Stock === "Out of Stock" ? true : false}
        >
          {book.Stock === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
        </Button>
      </Card>
    </>
  );
}
