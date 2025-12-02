import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { backendUrl, setIsLoggedIn , getUserData} = useContext(AppContext)
  const [state, setState] = useState('signup')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true      
      const url = state === 'signup' 
        ? `${backendUrl}/api/auth/signup` 
        : `${backendUrl}/api/auth/login`
      
      const payload = state === 'signup' 
        ? { username, email, password } 
        : { email, password }
      
      const { data } = await axios.post(url, payload)     
      if (data) {
        setIsLoggedIn(true)
        await getUserData()
        navigate('/')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
       toast.error(err.response?.data?.message || 'Error occurred. Please try again later.')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0'>
      <div onClick={() => navigate('/')}>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4 absolute top-4 left-6 sm:top-6 sm:left-24 w-28 sm:w-32 cursor-pointer'>
          <span className='text-black font-sans'>AR</span>
          <span className='text-blue-600 font-serif'>ify</span>
        </h2>
      </div>
      
      <div className='bg-blue-600 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'signup' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6 text-gray-200'>
          {state === 'signup' ? 'Register your Account Here' : 'Login to your Account'}
        </p>
        
        <form onSubmit={onSubmitHandler}>
          {state === 'signup' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/90 text-gray-600'>
              <img src={assets.person_icon} alt=''/>
              <input 
                className='bg-transparent outline-none w-full' 
                type="text" 
                placeholder="Full Name" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          )}
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/90 text-gray-600'>
            <img src={assets.mail_icon} alt=''/>
            <input 
              className='bg-transparent outline-none w-full' 
              type="email" 
              placeholder="Email Id" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/90 text-gray-600'>
            <img src={assets.lock_icon} alt=''/>
            <input 
              className='bg-transparent outline-none w-full' 
              type="password" 
              placeholder="Password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <p 
            onClick={() => navigate('/reset-password')} 
            className='pl-3 mb-4 text-white hover:text-blue-300 cursor-pointer transition-colors'
          >
            Forgot Password?
          </p>
          
          <button className='w-full bg-white text-blue-600 font-semibold py-2.5 rounded-full hover:bg-blue-50 transition-all mb-4'>
            {state === 'signup' ? 'Register' : 'Login'}
          </button>
          
          <p className='text-center text-gray-200 text-sm mt-1.5'>
            {state === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              onClick={() => setState(state === 'signup' ? 'login' : 'signup')} 
              className='text-white font-semibold cursor-pointer underline hover:text-blue-300 transition-colors'
            >
              {state === 'signup' ? 'Login here' : 'Sign Up'}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login