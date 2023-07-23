import axios from "axios";
import React, {useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import { RootState } from "../../../../Redux/store";

export default function ResetPasswordVerification(props: any) {
	const location = useLocation();
	const { state } : any = location;
	const email = state.email;
	const pwd = state.pwd;

	const isUserLoggedIn = useSelector((state: RootState) => state.userState.isUserLoggedIn);	 
	
	const [isLoading, setIsLoading] = useState(false);
	const [verCode, setVerCode] = useState(undefined);

	const navigate = useNavigate();

	useEffect(()=>{
		if (isUserLoggedIn || email == undefined || pwd == undefined){
			navigate('/gameboard');
		}
	}, [isUserLoggedIn]);
	

	const resetPassword = async (e: any) =>{
		setIsLoading(true);
		// prevent reload on submit
		e.preventDefault();
		try {
			await axios.post("https://gamerank.adarabadian.com/users/resetPassword", {email: email, password: pwd, verCode: verCode});
			setIsLoading(false);
			
			toast.success("Success! Your password was updated, you can log in now.")
			navigate('/login');
			
		} catch (err: any) {
			if (err.response.data.error.includes('validated')){
				toast.warn(err.response.data.error);
				navigate(-1);
				return;
			}

			toast.error(err.response.data.error);
		}
		setIsLoading(false);
	}

	return (
			<form className="loginForm" onSubmit={resetPassword}>
				<h1 className="pageHeader">GameRank Verification</h1>
	
				<p>
					Hi, I'm GameRanks personal assistant!<br/>
					I've sent a verification code to {email}
					<br></br><br></br>
					Please enter the verification code here:
				</p>
				
				<label>Verification Code:</label>
				<input type='number' placeholder="Verification Code" onChange={(e) => setVerCode(e.target.value)} />
				<br/><br/>
				<button type='submit'>Submit Code</button>

				<button type='button' onClick={() => {navigate(-1)}}>
					Back
				</button>
				
				{isLoading && 
					<div className="loaderDiv">
						<PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
					</div>
				}
			</form>
			);
}
