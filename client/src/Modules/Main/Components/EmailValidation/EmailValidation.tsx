import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function EmailValidation(props: any) {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state;
	const [isLoading, setIsLoading] = useState(false);
	const [verCode, setVerCode] = useState(undefined);
	
	const checkVerCode = async (e: FormEvent<HTMLFormElement>) =>{
		setIsLoading(true);
		// prevent reload on submit
		e.preventDefault();

		const data = {
			email: email,
			verCode: verCode,
		};

		try {
			await axios.post("https://gamerank.adarabadian.com/users/checkVerCode", data);
			
			toast.success("User activated successfully! Please log in to continue!");
			navigate('/login');			
		} catch (err: any) {
			toast.error(err.response.data.error);
		}
		setIsLoading(false);
	}

	return (
		<form className="loginForm" onSubmit={checkVerCode}>
			<h1 className="pageHeader">GameRank Verification</h1>

			<p>
				Hi, I'm GameRanks personal assistant!<br/>
				I've sent a verification code to {email !== undefined ? email : 'your email.'}
				<br></br><br></br>
				Please enter the verification code here:
			</p>
			
			<label>Verification Code:</label>
			<input type='number' placeholder="Verification Code" onChange={(e) => setVerCode(e.target.value)} />
			<br/><br/>
			<button type='submit'>Submit Code</button>
			
			{isLoading && 
				<div className="loaderDiv">
					<PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
				</div>
			}
		</form>);
}
