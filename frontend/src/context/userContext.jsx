import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({children})=>{

const [user,setUser] = useState(null);
const [loading, setLoading] = useState(true) // New State to track loading

useEffect(()=>{
    if(user) return ;

    const accessToken = localStorage.getItem("token");
    if(!accessToken){
        setLoading(false);
        return ;
    }

    const fetchUser = async ()=>{
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data.user);
        } catch (error) {
               localStorage.removeItem("token"); //  IMPORTANT
            console.error("User not authenticated", error)
            setUser(null);
        }finally{
            setLoading(false);
        }
    };
    fetchUser();
    
},[]);

const updateUser = (data) => {
  const { token, ...userData } = data;

  setUser(userData);          //  correct user object
  localStorage.setItem("token", token);
  setLoading(false);
};



const clearUser = ()=>{
   
    localStorage.removeItem("token");
     setUser(null);
}

    return (
        <UserContext.Provider value={{user,loading,updateUser,clearUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider; 

