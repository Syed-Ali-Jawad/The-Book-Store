import { Table, Typography } from "antd";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SideBar from "../Components/SideBar";

export default function MyOrdersPage() {
  const [buyerOrders, setBuyerOrders] = useState();
  const search = useSelector((state) => state.search);

  const dateFilter = useSelector((state) => state.dateFilter);

  const buyerId = useSelector((state) => state.buyerId);
  const { Column } = Table;

  useEffect(() => {
    const fetchData = async function () {
      const fetchFn = await fetch(
        `http://localhost:3000/orders?BuyerId=${buyerId}`
      );

      const response = await fetchFn.json();
      let buyerOrdersData = response;
      if (search) {
        buyerOrdersData = buyerOrdersData.filter((order) =>
          order.BookName.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (dateFilter && dateFilter !== "1/1/1970") {
        buyerOrdersData = buyerOrdersData.filter(
          (order) => order.DateOfPurchase === dateFilter
        );
      }
      setBuyerOrders(buyerOrdersData);
    };
    fetchData();
    let interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, [buyerOrders, dateFilter, search]);
  if (buyerId) {
    return (
      <div className="page">
        <SideBar search={true} home={true} dateFilter={true} logout={true} />
        <Table
          style={{
            width: "85%",
            margin: "auto 30px auto auto",
            paddingTop: "20px",
          }}
          size="small"
          dataSource={buyerOrders}
        >
          <Column title="Book Name" dataIndex="BookName" key="Book Name" />
          <Column
            title="Date of Purchase"
            dataIndex="DateOfPurchase"
            key="DateOfPurchase"
          />
          <Column title="Price (PKR)" dataIndex="BookPrice" key="Price" />
          <Column title="Quantity" dataIndex="Quantity" key="quantity" />
          <Column
            title="Total (PKR)"
            render={(record) => record.BookPrice * record.Quantity}
            sorter={(firstPrice, secondPrice) =>
              firstPrice === secondPrice ? 0 : firstPrice > secondPrice ? 1 : -1
            }
          />
        </Table>
      </div>
    );
  } else {
    return (
      <p>
        Please login to your account
        <Typography.Link>
          <Link to="/login"> Login</Link>
        </Typography.Link>
      </p>
    );
  }
}
