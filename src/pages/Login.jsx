import {  signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { updateAccessToken, updateUser } from '../app/chatSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [session,setSession]=useState(false)
  const dispatch=useDispatch()
  const navigate= useNavigate()

  useEffect(() => {
  if (sessionStorage.getItem('token')) {
    
    dispatch(updateUser(sessionStorage.getItem('user')))
    dispatch(updateAccessToken(sessionStorage.getItem('token')))
    navigate("/")
  }
  
   
  }, [])
  
  const handleSubmit= async(e)=>{
    e.preventDefault()
    try {
      const userCredentials= await signInWithEmailAndPassword(auth,email,password)

      const user= userCredentials.user;
      sessionStorage.setItem('token',user.accessToken);
      sessionStorage.setItem('user',user.email);
      
      
      dispatch(updateUser(user.email))
      dispatch(updateAccessToken(user.accessToken))
     
     navigate("/");
    } catch (error) {
      if (error.message==="Firebase: Error (auth/invalid-credential).") {
        alert("invalid email or password")
      }
      console.log(error.message);
    }
  }
  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div>Login account</div>
      <div> email:<input type='email' name='email' value={email} className='outline-none border border-black' required onChange={(e)=>setEmail(e.target.value)}/></div>
     <div> password:<input type='password' name='password' value={password} className='outline-none border border-black' required onChange={(e)=>setPassword(e.target.value)}/></div>
      <div><button className='border border-black px-2 py-2' onClick={handleSubmit}>Login</button></div>
      <p>dont have an account? <Link to="/signup">create account</Link></p>
    </div>
  )
}

export default Login
