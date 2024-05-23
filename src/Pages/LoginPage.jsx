import { Card, Form, Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { setBuyerId, setSellerId, setAdminId } from "../Store";
export default function LoginPage() {
  const [error, setError] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function emailValidation(event) {
    setEmail(null)
    if (event.target.value.trim()) {
      const emailCheckRegix =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailCheckRegix.test(event.target.value)) {
        setEmail(event.target.value);
        setError(null);
      } else {
        setError(
          <Typography.Text type="danger">Email is Invalid</Typography.Text>
        );
      }
    }
  }

  async function loginHandler() {
    const fetchFn = await fetch(
      `http://localhost:3000/buyers?Email=${email.trim()}`
    );
    const response = await fetchFn.json();
    const buyerData = response;

    if (buyerData.length > 0) {
      if (buyerData[0].Password === password.trim()) {
        localStorage.setItem("BuyerId", buyerData[0].id);
        dispatch(setBuyerId(buyerData[0].id));
        navigate("/");
      } else {
        setError(
          <Typography.Text type="danger">Incorrect Password</Typography.Text>
        );
      }
    } else if (buyerData.length === 0) {
      const fetchFn = await fetch(
        `http://localhost:3000/sellers?Email=${email.trim()}`
      );
      const response = await fetchFn.json();
      const sellerData = response;
      if (sellerData.length > 0) {
        if (sellerData[0].Password === password.trim()) {
          localStorage.setItem("SellerId", sellerData[0].id);
          dispatch(setSellerId(sellerData[0].id));
          navigate("/seller");
        } else {
          setError(
            <Typography.Text type="danger">Incorrect Password</Typography.Text>
          );
        }
      } else {
        const fetchFn = await fetch("http://localhost:3000/admin");
        const response = await fetchFn.json();
        const adminData = response;
        if (
          adminData[0].Password === password.trim() &&
          adminData[0].Email === email.trim()
        ) {
          localStorage.setItem("AdminId", adminData[0].id);
          dispatch(setAdminId(adminData[0].id));
          setError(null);
          navigate("/admin");
        }
        setError(
          <Typography.Text type="danger">User not found</Typography.Text>
        );
      }
    }
  }

  function passwordValidator(event) {
    setPassword(null);
    if (event.target.value.trim()) {
      setPassword(event.target.value);
    }
  }

  return (
    <div className="signup-login-page page">
      <Card className="signup-login-card">
        <Form className="signup-login-form">
          <h2 style={{ margin: "10px auto" }}>Login</h2>
          <Form.Item
            name="email"
            label="Email:"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input allowClear onChange={(event) => emailValidation(event)} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password allowClear onChange={(e) => passwordValidator(e)} />
          </Form.Item>

          {error ? (
            <Form.Item>
              <p style={{ margin: "auto" }}>{error}</p>
            </Form.Item>
          ) : null}
          <Button
            disabled={email && password ? false : true}
            onClick={() => loginHandler()}
            type="primary"
            style={{ width: "30%", margin: "auto " }}
          >
            Login
          </Button>

          <p style={{ margin: "10px auto" }}>
            Don't have an account? <Link to="/signup">Singup</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}
