import { Modal, Button, Table, Image } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setBuyerOrders, setBuyerProfile, setIsCartModalOpen } from "../Store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ShoppingCartModal() {
  const isCartModalOpen = useSelector((state) => state.isCartModalOpen);
  const buyerId = useSelector((state) => state.buyerId);
  const [buyerShoppingCart, setBuyerShoppingCart] = useState();
  let subTotal = null;
  const { Column } = Table;
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      const fetchFn = await fetch(`http://localhost:3000/buyers/${buyerId}`);
      const response = await fetchFn.json();
      const buyerData = response;
      dispatch(
        setBuyerProfile({
          buyerUsername: buyerData.Username,
          buyerPassword: buyerData.Password,
        })
      );

      setBuyerShoppingCart(buyerData.ShoppingCart);
    })(buyerId);
  }, [buyerShoppingCart]);

  function removeFromCart(bookName, buyerId) {
    const index = buyerShoppingCart.findIndex(
      (book) => book.BookName === bookName
    );
    const updatedCart = buyerShoppingCart.splice(index - 1, 1);
    setBuyerShoppingCart(updatedCart);
    fetch(`http://localhost:3000/buyers/${buyerId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ShoppingCart: buyerShoppingCart,
      }),
    });
  }

  if (buyerShoppingCart) {
    subTotal = buyerShoppingCart.reduce(
      (subTotal, book) => (subTotal += book.BookPrice * book.Quantity),
      0
    );
  }

  function checkoutHandler() {
    fetch(`http://localhost:3000/buyers/${buyerId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ShoppingCart: [],
      }),
    });
    buyerShoppingCart.map((book) =>
      fetch("http://localhost:3000/orders", {
        method: "POST",
        body: JSON.stringify({
          BookName: book.BookName,
          DateOfPurchase: new Date().toLocaleDateString("en-US"),
          BookRevenue: book.BookRevenue,
          BookPrice: book.BookPrice,
          Quantity: book.Quantity,
          BuyerId: buyerId,
        }),
      })
    ),
      buyerShoppingCart.map((book) => {
        (async function () {
          const fetchFn = await fetch(
            `http://localhost:3000/books/${book.BookId}`
          );
          const response = await fetchFn.json();
          const buyerShoppingCartBook = response;
          await fetch(`http://localhost:3000/books/${book.BookId}`, {
            method: "PATCH",
            body: JSON.stringify({
              Sold: buyerShoppingCartBook.Sold + book.Quantity,
              Revenue:
                buyerShoppingCartBook.Revenue + buyerShoppingCartBook.Price,
            }),
          });
        })();
      });
    dispatch(setIsCartModalOpen(false));
  }

  return (
    <Modal
      title="Shopping Cart"
      open={isCartModalOpen}
      closeIcon={
        <Button
          type="button"
          onClick={() => dispatch(setIsCartModalOpen(false))}
        >
          <CloseOutlined />
        </Button>
      }
      footer={[
        <Button
          onClick={() => dispatch(setIsCartModalOpen(false))}
          type="button"
        >
          Cancel
        </Button>,
        <Button onClick={() => checkoutHandler()}>Proceed to Checkout</Button>,
      ]}
    >
      {buyerId ? (
        buyerShoppingCart && buyerShoppingCart.length > 0 ? (
          <>
            <Table
              size="small"
              pagination={false}
              dataSource={buyerShoppingCart}
            >
              <Column
                title="Book Image"
                dataIndex="BookImage"
                key="BookImage"
                render={(bookImage) => (
                  <Image
                    style={{ width: "80px", height: "80px" }}
                    src={bookImage}
                  />
                )}
              />
              <Column title="Book Name" dataIndex="BookName" key="Book Name" />
              <Column title="Price (PKR)" dataIndex="BookPrice" key="Price" />
              <Column title="Quantity" dataIndex="Quantity" key="quantity" />
              <Column
                title="Total (PKR)"
                render={(record) => record.BookPrice * record.Quantity}
              />
              <Column
                title="Action"
                dataIndex="BookName"
                key="Action"
                render={(bookName) => (
                  <Button
                    type="link"
                    onClick={() => removeFromCart(bookName, buyerId)}
                  >
                    Remove
                  </Button>
                )}
              />
            </Table>
            <h4>Subtotal: PKR {subTotal}</h4>
          </>
        ) : (
          <p>Cart is Empty</p>
        )
      ) : (
        <p>
          Please login to your account <Link to="/login">Login</Link>
        </p>
      )}
    </Modal>
  );
}
