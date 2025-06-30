import React from 'react'
import { useNavigate } from 'react-router-dom'


function LoginNavbar() {
    const navigate = useNavigate()
    return (
        <>
            <div className="loginnavContainer w-full justify-center sm:justify-start items-center px-10 flex h-14 sm:px-18 absolute top-0">
                <div onClick={()=>navigate('/')}  className="logoContainer text-center hover:cursor-pointer">
                    <span className='text-blue-500 font-bold text-2xl'>&lt;</span>
                    <span className='logo font-bold text-3xl text-white'>Auth</span>
                    <span className='text-blue-500 font-bold text-3xl'>ify/&gt;</span>
                </div>
                {/* <button onClick={() => navigate('/login')} className='text-black font-bold bg-slate-400 hover:text-white transition-all hover:bg-slate-800 border-1 rounded-lg h-8 w-20 cursor-pointer hover:scale-103'>Logout</button> */}
            </div>
        </>
    )
}

export default LoginNavbar