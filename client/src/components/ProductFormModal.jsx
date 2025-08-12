// src/components/ProductFormModal.jsx
import { useState, useEffect } from "react";
import { handleSuccess, handleError } from "../utils";

const ProductFormModal = ({ isOpen, onClose, productToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        description: productToEdit.description,
        price: productToEdit.price,
      });
      setPreview(productToEdit.imageUrl);
      setFile(null); // Clear file for editing
    } else {
      setFormData({ title: "", description: "", price: "" });
      setPreview(null);
      setFile(null);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be a positive number";
    if (!productToEdit && !file) newErrors.image = "An image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const method = productToEdit ? "PUT" : "POST";
      const url = productToEdit
        ? `http://localhost:3000/api/products/${productToEdit._id}`
        : "http://localhost:3000/api/products";

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);
      if (file) {
        form.append("image", file);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        handleSuccess(
          productToEdit
            ? "Product updated successfully"
            : "Product added successfully"
        );
        onClose();
        onSave(); // Refresh the product list
      } else {
        handleError(result.message || "Failed to perform action");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scaleIn overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h2 className="text-xl font-semibold">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
        </div>


        <div className="p-6 overflow-y-auto flex-grow" >
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="description"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="price"
              >
                Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="image"
              >
                Product Image{" "}
                {!productToEdit && <span className="text-red-500">*</span>}
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <svg
                      className="w-8 h-8 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 text-center">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      PNG, JPG, JPEG (Max. 5MB)
                    </p>
                  </div>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Image Preview:
                  </p>
                  <img
                    src={preview}
                    alt="Product Preview"
                    className="w-full h-48 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 cursor-pointer py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : productToEdit ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
