import {createUserWithEmailAndPassword, getAdditionalUserInfo} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth,  } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken, updateUser } from "../app/chatSlice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch()
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth,email,password)
    .then((response)=>{
      
      let accessToken=response.user.accessToken
      let user=response.user
      dispatch(updateUser(user.email))
      dispatch(updateAccessToken(accessToken))
      sessionStorage.setItem('token',user.accessToken);
      sessionStorage.setItem('user',user.email);
      
      navigate("/");
    })
    .catch((err)=>{
      alert("email already exists")
    })
    
  };
  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      dispatch(updateUser(sessionStorage.getItem('user')))
      dispatch(updateAccessToken(sessionStorage.getItem('token')))
      navigate("/")
    }
    
     
    }, [])
 
  return (
    <div className="flex flex-col w-full h-full gap-6">
      <div>create account</div>
      <div>
        {" "}
        email:
        <input
          type="email"
          name="email"
          value={email}
          className="outline-none border border-black"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        {" "}
        password:
        <input
          type="password"
          name="password"
          value={password}
          className="outline-none border border-black"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          className="border border-black px-2 py-2"
          onClick={handleSubmit}
        >
          Sign up
        </button>
      </div>
      <p>
        allready have an account? <Link to="/login">login </Link>
      </p>
    </div>
  );
};

export default Signup;
