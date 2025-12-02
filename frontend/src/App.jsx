import React from 'react'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductExplore from './pages/ProductExplore'
import ARPreview from './pages/ARPreview'
import CreateProduct from './pages/CreateProduct'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/product-explore" element={<ProductExplore/>}/>
        <Route path="/ar-preview" element={<ARPreview />}/>
        <Route path="/create-product" element={<CreateProduct />}/>
      </Routes>
    </div>
  )
}

export default App