import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import SellerPage from "./Pages/SellerPage.jsx";
import AdminPage from "./Pages/AdminPage.jsx";
import { Provider } from "react-redux";
import store from "./Store.js";
import MyOrdersPage from "./Pages/MyOrdersPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/seller", element: <SellerPage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/my-orders", element: <MyOrdersPage /> },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
