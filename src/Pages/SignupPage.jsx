import { Card, Form, Button, Input, Select, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupPage() {
  const [error, setError] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordMatched, setPasswordMatched] = useState(false);
  const [userType, setUserType] = useState();
  const userTypes = [
    { value: "Buyer", lable: "Buyer" },
    { value: "Seller", lable: "Seller" },
  ];
  const navigate = useNavigate();

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

  function passwordValidator(event) {
    
    if (event.target.value.trim()) {
      const passwordCheckRegix =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (passwordCheckRegix.test(event.target.value)) {
        setPassword(event.target.value);
        setError(null);
      } else {
        setError(
          <Typography.Text type="danger">
            Your passowrd shall have atleast one uppercase letter, one lower
            case letter, on digit and be 8 characters long.
          </Typography.Text>
        );
      }
    }
  }

  function passwordConfirmation(event) {
    
    if (
      event.target.value.trim() &&
      event.target.value.trim() === password.trim()
    ) {
      setPasswordMatched(true);
      setError(null);
    } else {
      setError(
        <Typography.Text type="danger">Passwords doesn't match</Typography.Text>
      );
    }
  }

  function handleReset() {
    setEmail(null);
    setUserName(null);
    setPassword(null);
    setPasswordMatched(false);
    setUserType(null);
  }
  function submitHandler() {
    if (userType === "Buyer") {
      fetch("http://localhost:3000/buyers", {
        method: "POST",
        body: JSON.stringify({
          Username: username,
          Email: email,
          Password: password,
          Usertype: userType,
          ShoppingCart: [],
          Orders: [],
        }),
      });
    } else {
      fetch("http://localhost:3000/sellers", {
        method: "POST",
        body: JSON.stringify({
          Username: username,
          Email: email,
          Password: password,
          Usertype: userType,
        }),
      });
    }
    navigate("/login");
  }

  return (
    <div className="signup-login-page page">
      <Card className="signup-login-card">
        <Form className="signup-login-form">
          <h2 style={{ margin: "10px auto" }}>Signup</h2>
          <Form.Item
            name="username"
            label="UserName"
            rules={[{ required: true, message: "UserName is required" }]}
          >
            <Input
              allowClear
              onChange={(e) => {setUserName(null);
                e.target.value.trim() ? setUserName(e.target.value) : null;
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input allowClear onChange={(event) => emailValidation(event)} />
          </Form.Item>
          <Form.Item
            name="user-type"
            label="Register As"
            rules={[{ required: true, message: "Field is required" }]}
          >
            <Select
              onChange={(value) => setUserType(value)}
              options={userTypes}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password allowClear onChange={(e) => passwordValidator(e)} />
          </Form.Item>
          <Form.Item
            name="confirm-password"
            label="Confirm Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              allowClear
              onChange={(e) => passwordConfirmation(e)}
            />
          </Form.Item>
          {error ? <Form.Item>{error}</Form.Item> : null}
          <Button
            style={{ width: "30%", margin: "auto" }}
            htmlType="reset"
            onClick={() => handleReset()}
            type="button"
          >
            Reset
          </Button>
          <Button
            style={{ width: "30%", margin: "auto" }}
            disabled={
              username && userType && email && password && passwordMatched && !error
                ? false
                : true
            }
            onClick={() => submitHandler()}
            type="primary"
          >
            Signup
          </Button>
          <p style={{ margin: "10px auto" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}
