import { createContext, useState } from "react";
import axios from "axios";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/user/userdata`, {
      withCredentials: true,
    });

    if (response.data.success) {
      setUserData(response.data.userData);
    } else {
      setUserData(null);
    }
  } catch (err) {
    console.error(
      "Error fetching user data:",
      err.response?.data?.message || err.message
    );
    setUserData(null);
  }
};
    
    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
