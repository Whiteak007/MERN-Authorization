import { useState, useEffect } from 'react';
import { handleSuccess, handleError } from '../utils';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (isEditing) {
      if (formData.password && formData.password.length < 4) {
        newErrors.password = 'Password must be at least 4 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Here you would call your API to update the profile
      const response = await fetch('https://mern-authorization-crud-api.vercel.app/api/auth/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password })
        })
      });

      localStorage.setItem('loggedInUser', formData.name);

      const result = await response.json();

      if (response.ok) {
        handleSuccess('Profile updated successfully');
        localStorage.setItem('loggedInUser', formData.name);
        onClose();
        // window.location.reload(); 
      } else {
        handleError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      handleError('Network error. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <p className="text-blue-100 text-sm mt-1">
            {isEditing ? 'Edit your profile details' : 'View your profile information'}
          </p>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                } ${!isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'}`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                } ${!isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'}`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {isEditing && (
              <>
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Leave blank to keep current"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm cursor-pointer font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 text-sm cursor-pointer font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                    }}
                    className="px-5 py-2.5 text-sm cursor-pointer font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm cursor-pointer font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;