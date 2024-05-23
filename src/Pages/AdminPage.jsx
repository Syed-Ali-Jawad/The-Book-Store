import { Table, Card, Typography } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import SideBar from "../Components/SideBar";

export default function AdminPage() {
  const [booksSold, setBookSold] = useState();
  const [revenue, setRevenue] = useState();
  const [tableData, setTableData] = useState();
  const dateFilter = useSelector((state) => state.dateFilter);
  const adminId = useSelector((state) => state.adminId);
  const { Column } = Table;

  useEffect(() => {
    const fetchData = async function () {
      const fetchFn = await fetch("http://localhost:3000/orders");
      const response = await fetchFn.json();
      let ordersData = response;
      if (dateFilter && dateFilter !== "1/1/1970") {
        ordersData = ordersData.filter(
          (order) => order.DateOfPurchase === dateFilter
        );
      }
      const bookSold = ordersData.reduce(
        (booksSold, order) => (booksSold += order.Quantity),
        0
      );
      const revenue = ordersData.reduce(
        (revenue, order) => (revenue += order.BookRevenue),
        0
      );
      let tableData = [];

      const bookNames = [...new Set(ordersData.map((order) => order.BookName))];

      bookNames.forEach((book) => {
        const bookOrders = ordersData.filter(
          (order) => order.BookName === book
        );
        const totalSold = bookOrders.reduce(
          (sum, order) => sum + order.Quantity,
          0
        );
        const totalRevenue = bookOrders.reduce(
          (sum, order) => sum + order.BookRevenue,
          0
        );

        tableData.push({
          BookName: book,
          BookSold: totalSold,
          Revenue: totalRevenue,
        });
      });

      setBookSold(bookSold);
      setRevenue(revenue);
      setTableData(tableData);
    };
    fetchData();
    const interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, [dateFilter]);
  if (adminId) {
    return (
      <div className="page">
        <>
          <SideBar dateFilter={true} logout={true} />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card className="revenue-book-sold-cards" title="Books Sold">
              {booksSold}
            </Card>
            <Card className="revenue-book-sold-cards" title="Revenue (PKR)">
              {revenue}
            </Card>
          </div>
          <Table
            style={{
              width: "85%",
              margin: "auto 30px auto auto",
              paddingTop: "20px",
            }}
            dataSource={tableData}
          >
            <Column title="Book Name" dataIndex="BookName" key="Book Name" />
            <Column
              title="Book Sold"
              dataIndex="BookSold"
              key="Book Sold"
              sorter={(firstBookSold, secondBookSold) =>
                firstBookSold === secondBookSold
                  ? 0
                  : firstBookSold > secondBookSold
                  ? -1
                  : 1
              }
            />
            <Column
              title="Revenue (PKR)"
              dataIndex="Revenue"
              key="Revenue"
              sorter={(firstBookSold, secondBookSold) =>
                firstBookSold === secondBookSold
                  ? 0
                  : firstBookSold > secondBookSold
                  ? -1
                  : 1
              }
            />
          </Table>
        </>
      </div>
    );
  } else {
    return (
      <p>
        Please login to the admin{" "}
        <Typography.Link>
          <Link to="/login">Login</Link>
        </Typography.Link>
      </p>
    );
  }
}
