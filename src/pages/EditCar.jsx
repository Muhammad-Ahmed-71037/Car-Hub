import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Form, Input, InputNumber, Select, Button, Upload, Card, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "../styles/Sell.css";


export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingFilePath, setExistingFilePath] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02, boxShadow: "0 8px 20px rgba(24, 144, 255, 0.2)" },
    tap: { scale: 0.98 }
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          form.setFieldsValue(data);

          setExistingFilePath(data.filePath || null);

          if (data.filePath) {
            const { data: signedData } = await supabase
              .storage
              .from("car-images")
              .createSignedUrl(data.filePath, 3600);
            setPreviewImage(signedData?.signedUrl || null);
          }
        } else {
          Swal.fire("Error", "Car not found", "error");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching car:", error);
        Swal.fire("Error", "Failed to fetch car", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, form, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let filePath = existingFilePath;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const safeTitle = values.title.replace(/[^a-zA-Z0-9]/g, "_");
        filePath = `${id}/${Date.now()}-${safeTitle}.${fileExt}`;

        const { error: uploadError } = await supabase
          .storage
          .from("car-images")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        if (existingFilePath && existingFilePath !== filePath) {
          await supabase.storage.from("car-images").remove([existingFilePath]);
        }
      }

      const docRef = doc(db, "cars", id);
      await updateDoc(docRef, { ...values, filePath });

      Swal.fire("Success", "Car updated successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating car:", error);
      Swal.fire("Error", "Failed to update car", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      className="sell-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="form-header" variants={itemVariants}>
        <motion.h1 className="form-title">
          Edit Car Listing
          <motion.div
            className="title-underline"
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.h1>
        <p className="form-subtitle">Update your car details</p>
      </motion.div>

      <Form 
        layout="vertical" 
        onFinish={onFinish} 
        className="sell-form"
        form={form}
      >
        <div className="form-columns">
          <div className="form-column">
            <motion.div variants={itemVariants}>
              <Form.Item
                name="title"
                label="Car Name"
                rules={[{ required: true, message: "Please enter car title" }]}
              >
                <Input placeholder="e.g. Toyota Corolla 2020" />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: "Please enter car brand" }]}
              >
                <Input placeholder="e.g. Toyota" />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="year"
                label="Model Year"
                rules={[{
                  required: true,
                  message: "Please enter model year",
                  validator: (_, value) => {
                    const currentYear = new Date().getFullYear();
                    if (value && value > currentYear + 1) {
                      return Promise.reject(new Error(`Year cannot be greater than ${currentYear + 1}`));
                    }
                    return Promise.resolve();
                  }
                }]}
              >
                <InputNumber
                  placeholder="e.g. 2020"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="price"
                label="Price (PKR)"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  min={50000}
                  step={10000}
                  style={{ width: "100%" }}
                  placeholder="e.g. 2,000,000"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </motion.div>
          </div>

          <div className="form-column">
            <motion.div variants={itemVariants}>
              <Form.Item
                name="transmission"
                label="Transmission"
                rules={[{ required: true, message: "Please select transmission" }]}
              >
                <Select
                  placeholder="Select transmission"
                  options={[
                    { label: "Automatic", value: "Automatic" },
                    { label: "Manual", value: "Manual" },
                  ]}
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="condition"
                label="Condition"
                rules={[{ required: true, message: "Please select condition" }]}
              >
                <Select
                  placeholder="Select condition"
                  options={[
                    { label: "Used", value: "Used" },
                    { label: "New", value: "New" },
                    { label: "Certified Pre-Owned", value: "Certified Pre-Owned" },
                  ]}
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="mileage"
                label="Mileage (KM)"
                rules={[{ required: true, message: "Please enter mileage" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="e.g. 35000"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="engineCapacity"
                label="Engine Capacity (cc)"
                rules={[{ required: true, message: "Please enter engine capacity" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="e.g. 1800"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="fuelType"
                label="Fuel Type"
                rules={[{ required: true, message: "Please select fuel type" }]}
              >
                <Select
                  placeholder="Select fuel type"
                  options={[
                    { label: "Petrol", value: "Petrol" },
                    { label: "Diesel", value: "Diesel" },
                    { label: "Hybrid", value: "Hybrid" },
                    { label: "Electric", value: "Electric" },
                  ]}
                />
              </Form.Item>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants}>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please enter color" }]}
          >
            <Input placeholder="e.g. White" />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Write something about the car (features, condition, special notes)..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form.Item
            name="city"
            label="Enter your city"
            rules={[{ required: true, message: "Please enter your city" }]}
          >
            <Input placeholder="e.g. Karachi" />
          </Form.Item>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="image-upload-card">
            <Form.Item label="Car Image" required>
              <div className="image-upload-container">
                <label className="image-upload-label">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="image-upload-input"
                  />
                  <motion.div
                    className={`upload-area ${previewImage ? 'has-image' : ''}`}
                    whileHover={{ borderColor: "#1890ff" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {previewImage ? (
                      <motion.div
                        className="image-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <img src={previewImage} alt="Preview" />
                        <div className="image-overlay">
                          <UploadOutlined />
                          <span>Change Image</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="upload-placeholder">
                        <PlusOutlined />
                        <p>Click to upload image</p>
                        <small>Recommended size: 800x600px</small>
                      </div>
                    )}
                  </motion.div>
                </label>
              </div>
            </Form.Item>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<UploadOutlined />}
              block
              className="submit-button"
              size="large"
            >
              Update Listing
            </Button>
          </motion.div>
        </motion.div>
      </Form>
    </motion.div>
  );
}