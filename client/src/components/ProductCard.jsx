// src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col sm:flex-row justify-between items-start">
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full sm:w-32 h-32 object-cover rounded-lg shadow-md"
        />
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-2">{product.title}</h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-gray-600 font-semibold">
            Price: ${product.price.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;