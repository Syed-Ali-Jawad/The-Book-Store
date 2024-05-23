import { Modal, Button, Form, InputNumber, Select } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { setIsBookEditModalOpen } from "../Store";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

export default function BookEditModal() {
  const [updatedPrice, setUpdatedPrice] = useState();
  const isBookEditModalOpen = useSelector((state) => state.isBookEditModalOpen);
  const dispatch = useDispatch();
  const bookToEdit = useSelector((state) => state.bookToEdit);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      Price: bookToEdit.Price,
    });
    setUpdatedPrice(bookToEdit.Price);
  }, [isBookEditModalOpen]);

  function bookEditHandler() {
    fetch(`http://localhost:3000/books/${bookToEdit.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        Price: updatedPrice,
      }),
    });

    dispatch(setIsBookEditModalOpen(false));
  }

  return (
    <Modal
      open={isBookEditModalOpen}
      closeIcon={
        <Button
          type="button"
          onClick={() => dispatch(setIsBookEditModalOpen(false))}
        >
          <CloseOutlined />
        </Button>
      }
      title="Edit Book"
      footer={[
        <Button
          onClick={() => dispatch(setIsBookEditModalOpen(false))}
          type="button"
        >
          Cancel
        </Button>,
        <Button
          disabled={updatedPrice ? false : true}
          onClick={() => bookEditHandler()}
          type="primary"
        >
          Edit
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="Price"
          label="Price"
          rules={[{ required: true, message: "Book name is required" }]}
        >
          <InputNumber
            onChange={(value) => setUpdatedPrice(value)}
            addonBefore="PKR"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
