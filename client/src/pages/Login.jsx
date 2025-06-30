import React, { useContext, useState } from 'react'
import LoginNavbar from '../components/LoginNavbar'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast  } from 'react-toastify'



function Login() {
    const navigate = useNavigate()
    const { backendURL, setIsLoggedin,getUserData } = useContext(AppContext)
    const [state, setState] = useState('Sign up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true

            if (state === 'Sign up') {
                const { data } = await axios.post(backendURL + '/api/auth/signin', { name, email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                }
                else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendURL + '/api/auth/login', { email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                }
                else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <>

            <div className='LoginContainer flex items-center justify-center min-h-screen px-5 sm:px-0'>

                <LoginNavbar />
                <div className='loginBox shadow-2xl shadow-black rounded-lg w-90 sm:w-100 flex flex-col items-center   '>
                    <h2 className='font-bold text-black text-3xl mt-3'>{state === 'Sign up' ? 'Create Account' : 'Login account'}</h2>
                    <p className='font-medium text-black text-sm mt-2'>{state === 'Sign up' ? 'Create your account' : 'Login to your account'}</p>

                    <form onSubmit={onSubmitHandler}>

                        <div className='flex flex-col gap-1'>
                            {state === 'Sign up' && (<input onChange={e => setName(e.target.value)} value={name} className='shadow-xl shadow-slate-600 bg-slate-900 outline-none text-white rounded-full w-65 sm:w-90 px-4 py-2.5 mt-3 sm:mt-5' type="text" placeholder='Full Name' required />)}


                            <input onChange={e => setEmail(e.target.value)} value={email} className='shadow-xl shadow-slate-600 bg-slate-900 outline-none text-white rounded-full w-65 sm:w-90 px-4 py-2.5 mt-3 sm:mt-5' type="email" placeholder='Email' required />


                            <input onChange={e => setPassword(e.target.value)} value={password} className='shadow-xl shadow-slate-600 bg-slate-900 outline-none text-white rounded-full w-65 sm:w-90 px-4 py-2.5 mt-3 sm:mt-5' type="password" placeholder='Password' required />


                        </div>
                        <p onClick={() => navigate('/reset-password')} className='mt-5 ml-3 mb-2 text-sm text-slate-950 font-medium cursor-pointer'>Forgot password?</p>

                        <button className='text-white font-bold bg-slate-900 hover:text-white transition-all hover:bg-slate-950 border-1 rounded-full w-65 sm:w-90 px-4 py-2.5 border-slate-500 cursor-pointer  hover:scale-103'>{state}</button>
                    </form>

                    {state === 'Sign up' ?
                        (
                            <p className='text-slate-950 text-sm mt-4 mb-7'>
                                Already have an account? {' '}
                                <span onClick={() => setState('Login')} className='text-blue-900 cursor-pointer underline'>
                                    Login here
                                </span>
                            </p>
                        )
                        :
                        (
                            <p className='text-slate-950 text-sm mt-4 mb-7 '>
                                Don't have an account? {' '}
                                <span onClick={() => setState('Sign up')} className='text-blue-900 cursor-pointer underline'>
                                    Sign up
                                </span>
                            </p>
                        )}


                </div>
            </div>

        </>
    )
}

export default Login
