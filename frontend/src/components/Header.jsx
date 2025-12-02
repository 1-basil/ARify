import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const { userData,isLoggedIn } = useContext(AppContext)
    const navigate = useNavigate()
    console.log("Header User Data:", userData);

    return (
        <div className='flex flex-col items-center mt-60 px-4 text-center text-white'>
                    <h2 className='text-3xl sm:text-5xl font-semibold mb-2 text-gray-800'>{userData ? `Welcome back, ${userData.username}` : 'Shop with AR preview'}</h2>
                    <p className='mb-8 max-w-md text-gray-800 '>{userData ? 'Explore new products with AR preview tailored for you.' : 'Experience products in your space before buying'}</p>
            <button onClick={() => navigate(isLoggedIn ? '/product-explore' : '/Login')} className='border border-gray-600 rounded-full px-8 py-2.5 text-gray-800 hover:bg-white hover:text-blue-600 transition-all'>
                {userData ? 'Explore Products' : 'Get Started'}
            </button>
        </div>
    )
}

export default Header