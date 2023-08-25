import React, { useContext,useRef } from 'react'
import classes from './Login.module.css';
import AuthContext from './store/AuthContext';

import { useNavigate} from 'react-router-dom';
export default function LoginForm() {
    const context=useContext(AuthContext);
    const navigate=useNavigate();
    const emailRef=useRef();
  const passwordRef=useRef();
   function submitHandler(event){
    event.preventDefault();
    
    const enterdEmail=emailRef.current.value;
    const enterdPassword=passwordRef.current.value;
    
     let url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAQYXLrWSQR8lxbt1sc-ye5bGOTDsYKzQM'
    
    fetch(url,{
        method:'POST',
        body:JSON.stringify({
          email:enterdEmail,
          password:enterdPassword,
          returnSecureToken:true
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }).then((res)=>{
        if(res.ok){
            
         
    return res.json();
        }else{
          return res.json().then((data)=>{
            
            let errorMessage='Authentication failed!';
            
            
           throw new Error(errorMessage);
          })
        }
      })
      .then((data)=>{
       
        context.login(data.idToken);
        navigate("/NavigateProfile")
        console.log("succes");
      })
      .catch((err)=>{
        alert(err.message);
      })
      try{
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAQYXLrWSQR8lxbt1sc-ye5bGOTDsYKzQM',{
              method:'POST',
            
              body:JSON.stringify({
                requestType:"VERIFY_EMAIL",
                  idToken:context.token,
                  }),
                  
                  headers:{
                      'Content-Type':'application/json'
                    }
            }).then((resVerify)=>{
              if(resVerify.ok){
                  
               
          return resVerify.json();
              }else{
                return resVerify.json().then((data)=>{
                  
                  let errorMessage='Not Verify!';
                  
                  
                 throw new Error(errorMessage);
                })
              }
            })
            .then((data)=>{
             
              
              console.log("succes");
            })
          }
              catch (error) {
                console.error('Error updating account:', error);
      
              }
       
  }
   
  return (
    <div>
       <section className={classes.auth}>
      <h1>Login</h1>
      <div>
      <form onSubmit={submitHandler}>
      
        <div className={classes.control}>
         
          <input type='email' id='email' placeholder='Email' ref={emailRef} required />
        </div>
        <div className={classes.control}>
          
        <input
            type='password'
            id='password'
            placeholder='Password'
            ref={passwordRef}
            required
          />
        </div>
    
        <button  id='log'>Login</button>
        
      </form>
      </div>
      
    </section>
    </div>
  )
}
