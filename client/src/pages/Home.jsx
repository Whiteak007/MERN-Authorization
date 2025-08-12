// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { handleSuccess, handleError } from "../utils";
import ProductFormModal from "../components/ProductFormModal";
import ProductCard from "../components/ProductCard";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState(null); // Initialize with null to differentiate from an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [hasFetchedProducts, setHasFetchedProducts] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mern-authorization-crud-api.vercel.app/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setProducts(result.products);
        handleSuccess("Products loaded successfully!");
        setHasFetchedProducts(true);
      } else {
        handleError(result.message || "Failed to fetch products");
        setProducts(null);
        setHasFetchedProducts(false);
      }
    } catch (err) {
      handleError("Network error. Please try again.");
      setProducts(null);
      setHasFetchedProducts(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mern-authorization-crud-api.vercel.app/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setProducts(products.filter((p) => p._id !== productId));
          handleSuccess("Product deleted successfully!");
        } else {
          handleError(result.message || "Failed to delete product");
        }
      } catch (err) {
        handleError("Network error. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductAction = (action, product = null) => {
    if (action === 'add') {
      setEditingProduct(null);
      setIsModalOpen(true);
    } else if (action === 'edit' && product) {
      setEditingProduct(product);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={{ name: loggedInUser }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {loggedInUser}</h1>

          <div className="mb-8">
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={fetchProducts}
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Get All Products
              </button>
              <button
                onClick={() => setProducts(null)}
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105"
              >
                Hide Products
              </button>
            </div>
            
            {hasFetchedProducts && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-700">Available Products</h2>
                  <button
                    onClick={() => handleProductAction('add')}
                    className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
                
                {products && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        onEdit={() => handleProductAction('edit', item)}
                        onDelete={() => handleDelete(item._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-lg mt-8">
                    No products found. Click "Add Product" to create one.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        productToEdit={editingProduct}
        onSave={fetchProducts}
      />
      <ToastContainer />
    </div>
  );
}

export default Home;