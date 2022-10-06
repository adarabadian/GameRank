import axios from "axios";
import React, { FormEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import { RootState } from "../../../../Redux/store";

export default function ResetPassword() {
    const isUserLoggedIn = useSelector((state: RootState) => state.userState.isUserLoggedIn);   
    
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');

    const navigate = useNavigate();
    
    useEffect(()=>{
        if (isUserLoggedIn){
            navigate('/gameboard');
        }
    }, [isUserLoggedIn]);

    const isEmailValid = () =>{
        return (email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null);
    }

    const isPasswordValid = () =>{
        return (password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/) !== null);
    }

    const isPasswordVerificationValid = () =>{
        return (password == passwordVerification);
    }
    
    const validateAllInputs = () => {
        if(!isEmailValid()) {
            warn('The email you entered is not valid.');
            return false;
        }
        if(!isPasswordValid()) {
            warn('The password you entered is not valid.');
            return false;
        }
        if(!isPasswordVerificationValid()) {
            warn('The passwords are not identical.');
            return false;
        }
        
        return true;
    };

    const resetPassword = async (e: any) =>{
        setIsLoading(true);
        // prevent reload on submit
        e.preventDefault();

        if (validateAllInputs() === false) {
            setIsLoading(false);
            return;
        }

        try {
            await axios.post("https://adar-gamerank.herokuapp.com/users/sendResetPassVerCode", {email:email})
         
            setIsLoading(false);
            navigate('/resetpasswordconfirmation', {state: {email:email, pwd: password}});
        } catch (err: any) {
            toast.error(err.response.data.error);
        }
        setIsLoading(false);
    }

    const warn = (message: string) => {
        toast.warn(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <form className="loginForm" onSubmit={resetPassword}>
            <h1 className="pageHeader">Reset Password</h1>
            <span>Email:</span>
            <input
                name="Email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <span>Password:</span>
            <input
                name="password"
                placeholder="Password"
                type="password"
                autoComplete="false"
                onChange={(e) => setPassword(e.target.value)}
            />

            <span>Confirm Password:</span>
            <input
                name="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                autoComplete="false"
                onChange={(e) => setPasswordVerification(e.target.value)}
            />

            <button onClick={resetPassword} type='submit'>
                Reset Password
            </button>

            <button type='button' onClick={() => {navigate(-1)}}>
                Back
            </button>


            {isLoading && 
                <div className="loaderDiv">
                    <PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
                </div>
            }
        </form>
    )
}
