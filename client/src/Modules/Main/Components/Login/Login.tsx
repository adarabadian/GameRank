import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../Redux/hooks";
import { RootState } from "../../../../Redux/store";
import { getUser } from "../../../../Redux/userDetailsReducer";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isUserLoggedIn = useSelector((state: RootState) => state.userState.isUserLoggedIn);   
    
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginBtnValid, setIsLoginBtnValid] = useState(false);

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
    
    const err = (message: string) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    
    useEffect(() => {
        checkBtnValidity();
    },[userName, password]);

    useEffect(()=>{
        if (isUserLoggedIn){
            navigate('/gameboard');
        }
    }, [isUserLoggedIn]);

    const validateAllInputs = () => {
        if (userName === "") {
            warn("Please fill username.");
            return false;
        }

        if (password === "") {
            warn("Please fill password.");
            return false;
        }
    };

    const loginUser = async (e: any) => {
        setIsLoading(true);
        // prevent reload on submit
        e.preventDefault();

        if (validateAllInputs() === false) {
            setIsLoading(false);
            return;
        }

        let user = {
            userName: userName,
            password: password,
        };

        
        const res = await dispatch(getUser(user));
        setIsLoading(false);
        
        if (res.payload.response && res.payload.response.status !== 200) {
            if (res.payload.response.error.includes('validated')){
                warn(res.payload.response.error);
                navigate('/emailvalidation', {state: userName});
                return;
            }

            err(res.payload.response.error);
        }
    };

    const checkBtnValidity = () =>{
        if(userName.length > 2 && password.length > 5){
            setIsLoginBtnValid(true);
            return;
        } 
        setIsLoginBtnValid(false);
    }

    return (
        <form className="loginForm" onSubmit={loginUser}>
            <h1 className="pageHeader">Login</h1>
            <span>Username \ Email:</span>
            <input
                name="userName"
                placeholder="Username \ Email"
                onChange={(e) => setUserName(e.target.value)}
            />

            <span>Password:</span>
            <input
                name="password"
                placeholder="Password"
                type="password"
                autoComplete="true"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={loginUser}
                className={isLoginBtnValid ? "confirmBtn" : ""}
            >
                Log In
            </button>

            <br></br>
            <i>Don't have an account?</i>
            <br></br>
            <i>Register and start ranking today, It's free!</i>
            <br></br>

            <button
                onClick={() => {
                    navigate("/register")
                }}
            >
                Register
            </button>

            
            <br></br>
            <i>Forgot your password?</i>
            <br></br>

            <button onClick={() => {navigate("/resetpassword")}}>
                Reset Password
            </button>


            {isLoading && 
                <div className="loaderDiv">
                    <PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
                </div>
            }
        </form>
    );
}
