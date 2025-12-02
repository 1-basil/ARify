import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, backendUrl } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    isNew: false
  });

  const [files, setFiles] = useState({
    image: null,
    glbModel: null,
    usdzModel: null
  });

  const [previews, setPreviews] = useState({
    image: null,
    glbModel: null,
    usdzModel: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file types
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (fileType === 'glbModel' && !file.name.endsWith('.glb')) {
      toast.error('Please select a valid GLB file');
      return;
    }
    if (fileType === 'usdzModel' && !file.name.endsWith('.usdz')) {
      toast.error('Please select a valid USDZ file');
      return;
    }

    // Update files state
    setFiles(prev => ({ ...prev, [fileType]: file }));

    // Create preview for image
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => ({ ...prev, [fileType]: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!files.image || !files.glbModel || !files.usdzModel) {
      toast.error('Please upload all required files (image, GLB, USDZ)');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      formDataToSend.append('image', files.image);
      formDataToSend.append('glbModel', files.glbModel);
      formDataToSend.append('usdzModel', files.usdzModel);

      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/products/create`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Product created successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      
      if (data.message === "Logout successful") {
        setIsLoggedIn(false);
        setUserData(null);
        setShowDropdown(false);
        toast.success("Logged out successfully!");
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggedIn(false);
      setUserData(null);
      setShowDropdown(false);
      toast.info("Logged out");
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 
              className='text-3xl sm:text-5xl font-semibold cursor-pointer hover:text-blue-400 transition'
              onClick={() => navigate('/')}
            >
              <span className='text-gray-800 font-sans'>AR</span>
              <span className='text-blue-400 font-serif'>ify</span>
            </h2>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button onClick={() => navigate('/product-explore')} className="hover:text-blue-400 transition">
                Shop
              </button>
              <button onClick={() => navigate('/create-product')} className="text-blue-400 font-semibold">
                Create Product
              </button>

              {userData ? (
                <div className='relative user-menu'>
                  <div 
                    className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer hover:bg-gray-800 transition'
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {userData.username[0].toUpperCase()}
                  </div>
                  
                  {showDropdown && (
                    <div className='absolute top-12 right-0 z-50 bg-white shadow-xl rounded-lg border border-gray-200 min-w-[180px] overflow-hidden'>
                      <div className='p-3 border-b border-gray-100 bg-white'>
                        <p className='text-sm font-semibold text-gray-900'>{userData.username}</p>
                        <p className='text-xs text-gray-500 truncate'>{userData.email}</p>
                      </div>
                      <ul className='list-none m-0 p-2 bg-white'>
                        <li 
                          onClick={handleLogout}
                          className='py-2 px-4 hover:bg-red-50 cursor-pointer rounded text-sm text-red-600 font-medium flex items-center gap-2'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Login
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showDropdown && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg z-40">
            <nav className="px-4 py-4 space-y-3">
              <button 
                onClick={() => { navigate('/'); setShowDropdown(false); }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-50 transition"
              >
                Shop
              </button>
              <button 
                onClick={() => { navigate('/create-product'); setShowDropdown(false); }}
                className="block w-full text-left py-2 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold"
              >
                Create Product
              </button>
              
              {userData && (
                <>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className="text-sm font-semibold text-gray-900 px-4">{userData.username}</p>
                    <p className="text-xs text-gray-500 px-4 mb-3">{userData.email}</p>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setShowDropdown(false); }}
                    className="block w-full text-left py-2 px-4 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-400 transition mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Shop
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Add a new product with AR preview support</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Image Upload */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Product Image *
            </label>
            
            {previews.image ? (
              <div className="relative w-full aspect-square max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-sm">
                <img src={previews.image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFiles(prev => ({ ...prev, image: null }));
                    setPreviews(prev => ({ ...prev, image: null }));
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mb-3">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-700 font-semibold">Click to upload product image</p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                />
              </label>
            )}
          </div>

          {/* 3D Models Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GLB Model */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Android Model (GLB) *
              </label>
              
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {previews.glbModel ? (
                    <p className="text-sm text-green-600 font-semibold">✓ {previews.glbModel}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 font-semibold">Upload GLB file</p>
                      <p className="text-xs text-gray-500">For Android ARCore</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".glb"
                  onChange={(e) => handleFileChange(e, 'glbModel')}
                />
              </label>
            </div>

            {/* USDZ Model */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                iOS Model (USDZ) *
              </label>
              
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {previews.usdzModel ? (
                    <p className="text-sm text-green-600 font-semibold">✓ {previews.usdzModel}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 font-semibold">Upload USDZ file</p>
                      <p className="text-xs text-gray-500">For iOS ARKit</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".usdz"
                  onChange={(e) => handleFileChange(e, 'usdzModel')}
                />
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Thermos Bottle"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Household">Household</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="900"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isNew"
                id="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400 cursor-pointer"
              />
              <label htmlFor="isNew" className="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                Mark as "New Arrival"
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full font-semibold hover:border-gray-400 transition text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;