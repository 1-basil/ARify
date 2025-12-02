import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import images
import BottleImg from '../images/Bottle.jpg';
import ChairImg from '../images/Rocking_Chair.png';
import SmallRoundTable from '../images/Small_round_table.png';
import phoneImg from '../images/iphone_14_pro.jpg';

const ProductExplore = () => {
  const [view, setView] = useState('home');
  const [cartCount, setCartCount] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Add this
  const navigate = useNavigate();

  const { userData, setUserData, setIsLoggedIn, backendUrl } = useContext(AppContext);

  const PRODUCTS = [
    {
      id: 1,
      name: "Thermos Bottle",
      category: "Bottle",
      price: 900,
      image: BottleImg,
      modelUrl: "/models3d/thermos_final.glb",
      iosModelUrl: "/models3d/Thermos_-_Hydration_Bottle_24OZ.usdz",
      scale: "0.001 0.001 0.001",  // Fix massive scale issue
      isNew: true,
      description: "Stay refreshed anywhere..."
    },
    {
      id: 2,
      name: "Iphone 14 pro",
      category: "Electronics",
      price: 73000,
      image: phoneImg,
      modelUrl: "/models3d/iphone_14_pro_3d.glb",
      iosModelUrl: "/models3d/Iphone_14_pro_3d_ios.usdz",
      scale: "0.01 0.01 0.01",  // Adjust as needed
      description: "A beautifully designed phone..."
    },
    {
      id: 3,
      name: "Rocking Chair",
      category: "Household",
      price: 6900,
      image: ChairImg,
      modelUrl: "/models3d/Rocking_Chair.glb",
      iosModelUrl: "/models3d/Rocking_Chair.usdz",
      isNew: true,
      description: "Premium linen cushion with a hidden zipper. The breathable fabric makes it perfect for all seasons."
    },
    {
      id: 4,
      name: "Small Round Table",
      category: "Household",
      price: 700,
      image: SmallRoundTable,
      modelUrl: "/models3d/side_circle_table.glb",
      iosModelUrl: "/models3d/Side_Circle_Table.usdz",
      description: "A simple, elegant ceramic bowl. Durable enough for daily use, yet stylish enough for special occasions."
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const navigateHome = () => {
    setView('home');
    setSelectedProduct(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewProduct = (id) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const addToCart = () => {
    setCartCount(cartCount + 1);
    toast.success('Added to cart!');
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

  const Navbar = () => (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="text-2xl font-bold tracking-tight cursor-pointer z-40 hover:text-blue-400 transition-colors mt-4"
            onClick={navigateHome}
          >

            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
              <span className='text-white-800 font-sans'>AR</span><span className='text-blue-400 font-serif'>ify</span>
            </h2>
          </div>




          {/* User Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button onClick={navigateHome} className="hover:text-blue-400 transition duration-200">Shop</button>
            <a href="#" className="hover:text-blue-400 transition duration-200">Collections</a>
            <a href="#" className="hover:text-blue-400 transition duration-200">About</a>
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition group flex items-center gap-2">
              <span className="font-bold group-hover:text-blue-400 transition-colors">Cart ({cartCount})</span>  </button>
            <button
              onClick={() => navigate('/create-product')}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition font-semibold"
            >
              + Create Product
            </button>

            {/* User Menu - Desktop */}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className='py-2 px-4 hover:bg-red-50 active:bg-red-100 cursor-pointer rounded text-sm text-red-600 font-medium flex items-center gap-2 transition'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
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
            className="md:hidden z-40 p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="bg-white fixed inset-0  z-30 pt-20 px-6 flex flex-col md:hidden">
          <nav className="bg-white flex flex-col space-y-6 text-xl font-light tracking-wide text-center mt-10 border-t border-gray-200 pt-10">
            <button
              onClick={() => { navigateHome(); toggleMobileMenu(); }}
              className="py-3 border-b border-gray-200 w-full text-gray-900 hover:text-blue-400 transition"
            >
              Shop
            </button>
            <button
              onClick={() => { navigate('/create-product'); toggleMobileMenu(); }}
              className="py-3 border-b border-gray-200 text-gray-900 hover:text-blue-400 transition"
            >
              + Create Product
            </button>
            <a href="#" className="py-3 border-b border-gray-200 text-gray-900 hover:text-blue-400 transition">
              Collections
            </a>
            <a href="#" className="py-3 border-b border-gray-200 text-gray-900 hover:text-blue-400 transition">
              About
            </a>
            <a href="#" className="py-3 border-b border-gray-200 font-bold text-blue-400">
              View Cart ({cartCount})
            </a>
            

            {userData && (
              <>
                <div className="py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{userData.username}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
                <button
                  onClick={() => { handleLogout(); toggleMobileMenu(); }}
                  className="mt-4 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );

  const Hero = () => (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-[0.95]">
              Elevate Your <br />
              <span className="text-blue-400">Everyday.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-md font-light leading-relaxed">
              Curated essentials for modern living. We believe in quality over quantity and design that speaks for itself.
            </p>
            <div className="flex items-center gap-4">
              <a href="#shop-feed" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Shop Collection
              </a>
              <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:border-gray-900 transition-all duration-300">
                Our Story
              </button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 to-white"></div>
            <div className="absolute w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -top-10 -right-10"></div>
            <div className="absolute w-64 h-64 bg-blue-100/50 rounded-full blur-3xl bottom-10 left-10"></div>

            <div className="relative z-10 text-center">
              <div className="text-9xl">🌿</div>
              <p className="mt-4 text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">Est. 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const ProductCard = ({ product }) => (
    <div className="product-card cursor-pointer group" onClick={() => viewProduct(product.id)}>
      <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 transition duration-300 relative shadow-sm group-hover:shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-400 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
            New
          </span>
        )}
      </div>
      <div className="px-1">
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-[0.2em] mb-1 uppercase">{product.category}</p>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 leading-tight group-hover:text-blue-400 transition-colors">{product.name}</h3>
        <p className="text-base sm:text-lg font-semibold text-blue-400">₹{product.price}</p>
      </div>
    </div>
  );

  const Shop = () => (
    <div id="shop-feed" className="bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section>
          <div className="flex items-end justify-between mb-12 px-1">
            <div>
              <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">New Arrivals</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured</h2>
            </div>
            <button className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-blue-400 transition">
              View all products &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <button className="text-sm font-semibold text-blue-400 hover:text-gray-900 transition">View all products &rarr;</button>
          </div>
        </section>
      </div>
    </div>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <button onClick={navigateHome} className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-400 transition mb-6 sm:mb-8 active:scale-95 transform transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="w-full aspect-square sm:aspect-auto sm:h-[500px] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">{selectedProduct.category}</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4">{selectedProduct.name}</h1>
                <p className="text-3xl font-bold text-blue-400">₹{selectedProduct.price}</p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
                <p className="text-base text-gray-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 pb-20 sm:pb-0">
                <button onClick={addToCart} className="w-full sm:flex-1 py-4 text-white bg-gray-900 rounded-full font-semibold hover:bg-blue-400 active:bg-gray-800 transition duration-300 shadow-lg text-lg touch-manipulation">
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate('/ar-preview', { state: { product: selectedProduct } })}
                  className="w-full sm:flex-1 py-4 text-gray-900 bg-white border border-gray-200 rounded-full font-semibold hover:border-gray-400 active:bg-gray-50 transition duration-300 text-lg touch-manipulation"
                >
                  AR Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="mt-auto py-12 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <div className="text-blue-400 font-bold tracking-tight mb-2">ARify</div>
          <p className="text-sm text-gray-400 max-w-xs">Simplicity is the ultimate sophistication.</p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500 font-medium">
          <a href="#" className="hover:text-blue-400 transition">Instagram</a>
          <a href="#" className="hover:text-blue-400 transition">Twitter</a>
          <a href="#" className="hover:text-blue-400 transition">Support</a>
        </div>

        <p className="text-sm text-blue-400">&copy; 2024 ARify Store.</p>
      </div>
    </footer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 antialiased font-sans">
      <Navbar />
      {view === 'home' ? (
        <>
          <Hero />
          <Shop />
        </>
      ) : (
        <ProductDetail />
      )}
      <Footer />
    </div>
  );
};

export default ProductExplore;