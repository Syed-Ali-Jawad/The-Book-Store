import { Modal, Form, Button, Input, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setIsProfileUpdateModalOpen } from "../Store";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function ProfileUpdateModal() {
  const isProfileUpdateModalOpen = useSelector(
    (state) => state.isProfileUpdateModalOpen
  );
  const buyerProfile = useSelector((state) => state.buyerProfile);
  const buyerId = useSelector((state) => state.buyerId);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [updatedUsername, setUpdatedUsername] = useState();
  const [updatedPassword, setUpdatedPassword] = useState();
  const [confirmedPasswordInput, setConfirmedPasswordInput] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    form.setFieldsValue({
      username: buyerProfile.buyerUsername,
      password: buyerProfile.buyerPassword,
      confirmPassword: buyerProfile.buyerPassword,
    });
    setUpdatedUsername(buyerProfile.buyerUsername);
    setUpdatedPassword(buyerProfile.buyerPassword);
    setConfirmedPasswordInput(buyerProfile.buyerPassword);
  }, [isProfileUpdateModalOpen]);

  function passwordValidator(event) {
    if (event.target.value.trim()) {
      const passwordCheckRegix =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (passwordCheckRegix.test(event.target.value)) {
        setUpdatedPassword(event.target.value.trim());
        setError(null);
      } else {
        setUpdatedPassword(null);
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
    if (event.target.value.trim() !== updatedPassword) {
      setError(
        <Typography.Text type="danger">Password Dont Match.</Typography.Text>
      );
    } else {
      setError(null);
    }
    setConfirmedPasswordInput(event.target.value.trim());
  }

  function updateHandler() {
    fetch(`http://localhost:3000/buyers/${buyerId}`, {
      method: "PATCH",
      body: JSON.stringify({
        Username: updatedUsername,
        Password: updatedPassword,
      }),
    });
    dispatch(setIsProfileUpdateModalOpen(false));
  }
  return (
    <Modal
      open={isProfileUpdateModalOpen}
      title="My Profile"
      closeIcon={
        <Button
          type="button"
          onClick={() => dispatch(setIsProfileUpdateModalOpen(false))}
        >
          <CloseOutlined />
        </Button>
      }
      footer={[
        <Button
          onClick={() => dispatch(setIsProfileUpdateModalOpen(false))}
          type="button"
        >
          Cancel
        </Button>,
        <Button
          disabled={
            updatedPassword &&
            updatedUsername &&
            updatedPassword === confirmedPasswordInput &&
            !error
              ? false
              : true
          }
          onClick={() => updateHandler()}
          type="primary"
        >
          Update
        </Button>,
      ]}
    >
      {buyerId ? (
        <Form form={form}>
          <Form.Item
            name="username"
            label="UserName"
            rules={[{ required: true, message: "UserName is required" }]}
          >
            <Input
              onChange={(e) => setUpdatedUsername(e.target.value.trim())}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password onChange={(e) => passwordValidator(e)} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password onChange={(e) => passwordConfirmation(e)} />
          </Form.Item>
          {error}
        </Form>
      ) : (
        <p>
          Please login to your account <Link to="/login">Login</Link>
        </p>
      )}
    </Modal>
  );
}
