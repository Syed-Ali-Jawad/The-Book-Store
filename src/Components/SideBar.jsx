import { List, ConfigProvider, Input, Select, DatePicker } from "antd";
import {
  SearchOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setGenreFilter,
  setPriceFilter,
  setSearch,
  setBuyerId,
  setIsProfileUpdateModalOpen,
  setIsCartModalOpen,
  setDateFilter,
  setSellerId,
  setIsBookSellModalOpen,
  setAdminId,
} from "../Store";
import { useNavigate } from "react-router-dom";
import logo from "../../public/Logo.png";

export default function SideBar(props) {
  const buyerId = useSelector((state) => state.buyerId);
  const navigate = useNavigate();
  const sellerId = useSelector((state) => state.sellerId);
  const adminId = useSelector((state) => state.adminId);

  const dispatch = useDispatch();
  const genres = [
    { value: "Thriller", label: "Thriller" },
    { value: "Romance", lable: "Romance" },
    { value: "Mystery", label: "Mystery" },
    { value: "Historical Fiction", label: "Historical Fiction" },
    { value: "Young Adult", label: "Young Adult" },
    { value: "Horror", label: "Horror" },
    { value: "Fantasy", label: "Fantasy" },
  ];
  function deleteBuyerAccountHandler() {
    fetch(`http://localhost:3000/buyers/${buyerId}`, { method: "DELETE" });
  }
  function deleteSellerAccountHandler() {
    fetch(`http://localhost:3000/books?_embed=${sellerId}`, {
      method: "DELETE",
    });
    fetch(`http://localhost:3000/sellers/${sellerId}`, { method: "DELETE" });
  }
  return (
    <div style={{ zIndex: props.homePage ? "1" : null }} className="side-bar">
      <List>
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorTextPlaceholder: "black",
                colorBorder: "none",
              },
              Input: { colorTextPlaceholder: "black" },
              DatePicker: { colorTextPlaceholder: "black" },
            },
          }}
        >
          <List.Item>
            <span>
              <img
                style={{
                  margin: "auto 30%",
                  borderRadius: "50%",

                  width: "40%",
                }}
                src={logo}
              />

              <h4 style={{ marginLeft: "auto 15%" }}>The Book Store</h4>
            </span>
          </List.Item>
          {props.search ? (
            <List.Item>
              <span>
                <SearchOutlined />
                <Input
                  allowClear
                  onClear={() => dispatch(setSearch(null))}
                  onChange={(e) => dispatch(setSearch(e.target.value.trim()))}
                  className="search-bar"
                  placeholder="Search Book"
                />
              </span>
            </List.Item>
          ) : null}
          {props.homePage ? (
            <>
              <List.Item
                onClick={() => dispatch(setIsProfileUpdateModalOpen(true))}
                className="side-bar-btn"
              >
                <ProfileOutlined /> My Profile
              </List.Item>
              <List.Item
                onClick={() => navigate("/my-orders")}
                type="button"
                className="side-bar-btn"
              >
                <ShoppingOutlined /> My Orders
              </List.Item>
              <List.Item
                onClick={() => dispatch(setIsCartModalOpen(true))}
                type="button"
                className="side-bar-btn"
              >
                <ShoppingCartOutlined style={{ color: "black" }} /> Shopping
                Cart
              </List.Item>

              <List.Item>
                <Select
                  allowClear
                  onClear={() => dispatch(setGenreFilter(null))}
                  onChange={(value) => dispatch(setGenreFilter(value))}
                  placeholder="Filter by Genre"
                  options={genres}
                  className="filters"
                />
              </List.Item>
              <List.Item>
                <Select
                  placeholder="Filter by Price"
                  allowClear
                  onClear={() => dispatch(setPriceFilter(null))}
                  onChange={(value) => dispatch(setPriceFilter(value))}
                  options={[
                    { value: "Low to High", lable: "Low to High" },
                    { value: "High to Low", label: "High to Low" },
                  ]}
                  className="filters"
                />
              </List.Item>
            </>
          ) : null}

          {!buyerId && props.homePage ? (
            <List.Item
              onClick={() => navigate("/login")}
              style={{ color: "black" }}
              className="side-bar-btn"
            >
              <LoginOutlined style={{ color: "black" }} /> Login
            </List.Item>
          ) : null}
          {buyerId && props.homePage ? (
            <List.Item
              onClick={() => {
                navigate("/login");
                localStorage.removeItem("BuyerId");
                dispatch(setBuyerId(null));
              }}
              className="side-bar-btn"
            >
              <LogoutOutlined /> Logout
            </List.Item>
          ) : null}
          {buyerId && props.homePage ? (
            <List.Item
              onClick={() => {
                dispatch(setBuyerId(null));
                localStorage.removeItem("BuyerId");
                navigate("/");
                deleteBuyerAccountHandler();
              }}
              className="side-bar-btn"
            >
              Delete Account
            </List.Item>
          ) : null}
          {!buyerId && props.homePage ? (
            <List.Item
              className="side-bar-btn"
              onClick={() => navigate("/signup")}
              type="button"
            >
              {" "}
              Signup
            </List.Item>
          ) : null}
          {props.home ? (
            <List.Item onClick={() => navigate("/")} className="side-bar-btn">
              <HomeOutlined /> Home
            </List.Item>
          ) : null}
          {props.sellABook ? (
            <List.Item
              className="side-bar-btn"
              onClick={() => dispatch(setIsBookSellModalOpen(true))}
            >
              Sell a Book
            </List.Item>
          ) : null}
          {props.dateFilter ? (
            <List.Item className="side-bar-btn">
              <DatePicker
                defaultValue={null}
                onChange={(dateString) =>
                  dispatch(
                    setDateFilter(
                      new Date(dateString).toLocaleDateString("en-US")
                    )
                  )
                }
                className="date-picker-styling"
                placeholder="Filter by Date"
              />
            </List.Item>
          ) : null}
          {props.logout ? (
            <List.Item
              onClick={() => {
                navigate("/login");
                {
                  buyerId
                    ? localStorage.removeItem("BuyerId")
                    : sellerId
                    ? localStorage.removeItem("SellerId")
                    : adminId
                    ? localStorage.removeItem("AdminId")
                    : null;
                }
                {
                  buyerId
                    ? dispatch(setBuyerId(null))
                    : sellerId
                    ? dispatch(setSellerId(null))
                    : adminId
                    ? dispatch(setAdminId(null))
                    : null;
                }
              }}
              className="side-bar-btn"
            >
              <LogoutOutlined style={{ color: "black" }} /> Logout
            </List.Item>
          ) : null}

          {sellerId && props.sellerPage ? (
            <List.Item
              onClick={() => {
                dispatch(setSellerId(null));
                localStorage.removeItem("SellerId");
                navigate("/login");
                deleteSellerAccountHandler();
              }}
              className="side-bar-btn"
              style={{ color: "black" }}
            >
              Delete Account
            </List.Item>
          ) : null}
        </ConfigProvider>
      </List>
    </div>
  );
}
