import React, { useContext, useEffect } from 'react'
import './Login.css'
import LoginNavbar from '../components/LoginNavbar'
import { AppContext } from '../context/AppContext'
import  axios  from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function EmailVerify() {
    const navigate = useNavigate()
    axios.defaults.withCredentials = true
    const {backendURL, isLoggedin, getUserData, userData } = useContext(AppContext)
    const inputrefs = React.useRef([])
    const handleInput = (e,index)=>{
        if(e.target.value.length > 0 && index < inputrefs.current.length - 1 ){
            inputrefs.current[index+1].focus()
        }
    }
    const handleKeyDown = (e, index)=>{
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputrefs.current[index - 1].focus();
        }
    }

    const onSubmitHandler = async(e)=>{
        try {
            e.preventDefault()
            const otpArray = inputrefs.current.map(e=> e.value)
            const otp = otpArray.join('')

            const {data} = await axios.post(backendURL + '/api/auth/verifyaccount', {otp})
            if(data.success){
                toast.success(data.message)
                getUserData()
                navigate('/')
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

   

    useEffect(()=>{
        isLoggedin && userData && userData.isVerified && navigate('/')
    }, [isLoggedin,userData])

    return (
        <>

            <div className='LoginContainer flex items-center justify-center min-h-screen px-5 sm:px-0'>
                <LoginNavbar />
                <form onSubmit={onSubmitHandler} className='bg-slate-50 px-4 sm:px-0 flex flex-col items-center p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-slate-950 text-2xl font-bold text-center mb-3'>Email Verify OTP</h1>
                    <p className='text-slate-950 text-sm font-medium text-center mb-3'>Enter 6-digit code sent to your email id.</p>
                    <div className='flex justify-center gap-1 mb-8'>
                        {Array(6).fill(0).map((_, index) => (
                            <input type="text" maxLength='1' key={index} required className='w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white text-center text-xl rounded-xl'ref={e=> inputrefs.current[index] = e} onInput={(e)=>handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e, index)}/>
                        ))}
                    </div>
                    <button className='text-white font-bold bg-slate-900 hover:text-white transition-all hover:bg-slate-950 border-1 rounded-full w-65 sm:w-85 px-4 py-2.5 border-slate-500 cursor-pointer  hover:scale-103'>Verify Email</button>
                </form>
            </div>

        </>
    )
}

export default EmailVerify