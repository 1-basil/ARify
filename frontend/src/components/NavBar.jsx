import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const NavBar = () => {
    const navigate = useNavigate();
   const {userData,backendUrl,setIsLoggedIn,setUserData} = useContext(AppContext);

    console.log("NavBar User Data:", userData);
    console.log("account data:",userData);
    console.log("backend url:",backendUrl);
    const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      console.log("Logout response:", response.data);

      setIsLoggedIn(false);
      setUserData(null);

      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed. Try again.');
    }
  };
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
    <span className='text-white-800 font-sans'>AR</span><span className='text-blue-600 font-serif'>ify</span>
</h2>

{userData ? <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>{userData.username[0].toUpperCase()}
    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 '>
      <ul className='list-none m-0 p-2 bg-gray-100 text-sm '>
        <li onClick={handleLogout}className='py-1 px-2 active:bg-gray-200 cursor-pointer pr-10'>logout</li>
      </ul>

    </div>
</div> :<button onClick={()=>navigate('/Login')} className='flex items-center gap-2 border border-gray rounded-full px-6 py-2 text-gray-800 active:bg-zinc-200' >
          { userData ? `${userData.username}` : 'Login' }
          <img src={assets.arrow_icon} alt=''/>
        </button>}
    </div> 
  )
}

export default NavBar