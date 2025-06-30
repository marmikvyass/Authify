import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

function Header() {

    const {userData} = useContext(AppContext)

  return (
    <>
        <div className="headerContainer flex flex-col items-center">
            <img className='w-125 mt-50 sm:mt-10' src="/header_img.png" alt="" />
            <h1 className='font-bold text-xl sm:text-2xl text-center px-5 sm:px-3'>Hey {userData ? userData.name : 'Developers'} !</h1>
            <h1 className='font-bold text-2xl sm:text-5xl text-center px-5 sm:px-3'>Welcome to our app</h1>
            <button className='text-black font-bold bg-slate-400 hover:text-white transition-all hover:bg-slate-800 border-1 rounded-full px-8 py-3 border-slate-500 cursor-pointer mt-10 mb-10 hover:scale-115 '>Get Started</button>
        </div>
    </>
  )
}

export default Header
