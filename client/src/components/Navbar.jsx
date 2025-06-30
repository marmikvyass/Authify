import React, { useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar() {

    const navigate = useNavigate()
    const { userData, backendURL, setUserData, setIsLoggedin } = useContext(AppContext)
    const [showMenu, setShowMenu] = useState(false);
    const sendVerificationOtp  =async ()=>{
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendURL + '/api/auth/sendverifyotp')

            if(data.success){
                navigate('/email-verify')
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }


        } catch (error) {
             toast.error(error.message)
        }
    }
    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendURL + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            setTimeout(() => navigate('/'), 100); 
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <>
            <div className="navContainer bg-slate-900 w-full justify-between items-center px-10 flex h-14 sm:px-18 absolute top-0">
                <div className="logoContainer">
                    <span className='text-blue-500 font-bold text-2xl'>&lt;</span>
                    <span className='logo font-bold text-2xl text-white'>Auth</span>
                    <span className='text-blue-500 font-bold text-2xl'>ify/&gt;</span>
                </div>

                {userData ?
                    <div className='text-black flex justify-center items-center font-bold w-8 h-8 rounded-full bg-white relative group 
                    cursor-pointer'
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                    >
                        {userData?.name[0]?.toUpperCase()}
                        {showMenu && <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                            <ul className='list-none m-0 p-2 bg-slate-300 text-sm'>
                                {!userData.isVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-slate-400 cursor-pointer'>Verify Email</li>}
                                <li onClick={logout} className='py-1 px-2 hover:bg-slate-400 cursor-pointer pr-10'>Logout</li>


                            </ul>
                        </div>}
                        
                    </div>
                    :
                    <button onClick={() => navigate('/login')} className='text-black font-bold bg-slate-400 hover:text-white transition-all hover:bg-slate-800 border-1 rounded-lg h-8 w-20 cursor-pointer hover:scale-103'>Login</button>}


            </div>
        </>
    )
}

export default Navbar