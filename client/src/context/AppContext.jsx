import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{
    
    
    const backendURL = import.meta.env.VITE_BACKEND_URL
    axios.defaults.baseURL = backendURL;
    axios.defaults.withCredentials = true

    
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthStatus = async ()=>{
        try{
            const {data} = await axios.get('/api/auth/isAuth', { withCredentials: true })
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get('/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(()=>{
            getAuthStatus();
    }, [])
    const value = {
        backendURL,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
