import { Modal, Button, Form, Input, InputNumber, Image, Select } from "antd";
import {
  CloseOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setIsBookSellModalOpen } from "../Store";
import { useRef, useState } from "react";

export default function BookSellModal() {
  const isBookSellModalOpen = useSelector((state) => state.isBookSellModalOpen);
  const [uploadedBookImage, setUploadedBookImage] = useState();
  const [price, setPrice] = useState();
  const [bookName, setBookName] = useState();
  const [bookGenre, setBookGenre] = useState();

  const dispatch = useDispatch();
  const imgRef = useRef();
  const [form] = Form.useForm();
  const sellerId = useSelector((state) => state.sellerId);
  const genres = [
    { value: "Thriller", label: "Thriller" },
    { value: "Romance", lable: "Romance" },
    { value: "Mystery", label: "Mystery" },
    { value: "Historical Fiction", label: "Historical Fiction" },
    { value: "Young Adult", label: "Young Adult" },
    { value: "Horror", label: "Horror" },
    { value: "Fantasy", label: "Fantasy" },
  ];
  function cancelHandler() {
    form.resetFields();
    setUploadedBookImage(null);
    setBookName(null);
    setPrice(null);
    dispatch(setIsBookSellModalOpen(false));
  }
  function sellHandler() {
    if (uploadedBookImage) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result;
        fetch("http://localhost:3000/books", {
          method: "POST",
          body: JSON.stringify({
            BookName: bookName,
            Price: price,
            BookGenre: bookGenre,
            BookImage: result,
            DateOfPostingBook: new Date().toLocaleDateString("en-US"),
            SellerId: sellerId,
            Stock: "Available",
            Sold: 0,
            Revenue: 0,
          }),
        });
      };

      fileReader.readAsDataURL(uploadedBookImage);
      form.resetFields();
      dispatch(setIsBookSellModalOpen(false));
    } else {
      return;
    }
  }

  return (
    <>
      <Modal
        open={isBookSellModalOpen}
        closeIcon={
          <Button
            type="button"
            onClick={() => dispatch(setIsBookSellModalOpen(false))}
          >
            <CloseOutlined />
          </Button>
        }
        title="Sell a Book"
        footer={[
          <Button onClick={() => cancelHandler()} type="button">
            Cancel
          </Button>,
          <Button onClick={() => sellHandler()} type="primary">
            Sell
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item
            name="Book Name"
            label="Book Name"
            rules={[{ required: true, message: "Book name is required" }]}
          >
            <Input onChange={(e) => setBookName(e.target.value.trim())} />
          </Form.Item>
          <Form.Item
            name="Price"
            label="Price"
            rules={[{ required: true, message: "Book name is required" }]}
          >
            <InputNumber
              onChange={(value) => setPrice(value)}
              addonBefore="PKR"
            />
          </Form.Item>
          <Form.Item
            name="Genre"
            label="Select Genre"
            rules={[{ required: true, message: "Genre is required" }]}
          >
            <Select
              onChange={(value) => setBookGenre(value)}
              options={genres}
            />
          </Form.Item>
          <Form.Item
            name="Book Image"
            label="Add Book Image"
            rules={[{ required: true, message: "Book image is required" }]}
          >
            <input
              onChange={(e) => setUploadedBookImage(e.target.files[0])}
              style={{ display: "none" }}
              ref={imgRef}
              type="file"
              accept="image/*"
            />
            <Button onClick={() => imgRef.current.click()}>
              <PlusOutlined /> Add Image
            </Button>
          </Form.Item>
          {uploadedBookImage ? (
            <Form.Item>
              <Image
                style={{ border: "2px solid gray", width: "100px" }}
                src={URL.createObjectURL(uploadedBookImage)}
              />{" "}
              <CloseCircleOutlined onClick={() => setUploadedBookImage(null)} />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </>
  );
}
