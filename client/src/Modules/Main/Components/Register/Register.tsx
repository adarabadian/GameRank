import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import { RootState } from "../../../../Redux/store";
import "./Register.css";

export default function Register() {
	const [form, setForm] = useState({
		userName: '',
		password: '',
		firstName: '',
		lastName: '',
		email: ''
	})
	const [isLoading, setIsLoading] = useState(false);

	const validFields = useRef(new Set());

	const navigate = useNavigate();

	const isUserLoggedIn = useSelector((state: RootState) => state.userState.isUserLoggedIn);	 
	useEffect(()=>{
		if (isUserLoggedIn){
			navigate('/gameboard');
		}
	}, [isUserLoggedIn]);
		


	const shouldToastMessage = (inputName: string) => {
		if (inputName === "userName") {
			if (!validFields.current.has('userName')) {
				warn("Username allowed length is between 4 - 12 and must contain only letters or numbers.");
				return false;
			} return true;
		}

		if (inputName === "email") {
			if (!validFields.current.has('email')) {
				warn("This email isn't valid, please check again.");
				return false;
			} return true;
		}

		if (inputName === "firstName") {
			if (!validFields.current.has('firstName')) {
				warn("First name length has to be between 4 - 20 and must be written in english letters only..");
				return false;
			} return true;
		}

		if (inputName === "lastName") {
			if (!validFields.current.has('lastName')) {
				warn("Last name length has to be between 4 - 20 and must be written in english letters only.");
				return false;
			} return true;
		}

		if (!validFields.current.has('password')) {
			warn(
				"Password allowed length is between 6 - 12 characters and must contain at least 1 letter 1 number."
			); return false;
		}
		return true;
	};

	const isUserNameValid = () =>{
		if (form.userName.match(/^(?=.{4,12}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/) !== null){
			validFields.current.add('userName');
			return true;
		}
		validFields.current.delete('userName');
		return false;
	}

	const isEmailValid = () =>{
		if (form.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null){
			validFields.current.add('email');
			return true;
		}
		validFields.current.delete('email');
		return false;
	}

	const isFirstNameValid = () =>{
		if (form.firstName.match(/^(?=.{2,12}$)[a-z]+(?:['_.\s][a-z]+)*$/i) !== null){
			validFields.current.add('firstName');
			return true;
		}
		validFields.current.delete('firstName');
		return false;
	}

	const isLastNameValid = () =>{
		if (form.lastName.match(/^(?=.{2,12}$)[a-z]+(?:['_.\s][a-z]+)*$/i) !== null){
			validFields.current.add('lastName');
			return true;
		}
		validFields.current.delete('lastName');
		return false;
	}

	const isPasswordValid = () =>{
		if (form.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/) !== null){
			validFields.current.add('password');
			return true;
		}
		validFields.current.delete('password');
		return false;
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

	const registerNewUser = async () => {
		setIsLoading(true);
		if (validateAllInputs() === false){
			setIsLoading(false);
			return
		};

		let user = {
			userName:	 form.userName,
			email:		form.email,
			firstName:	form.firstName,
			lastName:	 form.lastName,
			password:	 form.password,
		};

		try {
			await axios.post("https://gamerank.adarabadian.com/users", user);
			
			navigate('/emailvalidation',	{state: user.email});
		} catch (err: any) {
			toast.error(err.response.data.error);
		}
		setIsLoading(false);
	};

	const validateAllInputs = () => {
		if (!shouldToastMessage("userName") || !shouldToastMessage("password") || !shouldToastMessage("email") || 
			!shouldToastMessage("firstName") || !shouldToastMessage("lastName")) {
			return false;
		} return true;
	};

	return (
		<form className="loginForm" onSubmit={registerNewUser}>
			<h1 className="pageHeader">Register</h1>

			<span>Username:</span>
			<input name="userName" placeholder="Username"
				className={(isUserNameValid() ? 'validField' : 'invalidField')}
				onChange={(e) => {setForm(prev => {return {...prev, userName: e.target.value}})}}
			/>

			<span>Email:</span>
			<input name="email" placeholder="Email" type="email"
				className={(isEmailValid() ? 'validField' : 'invalidField')}
				onChange={(e) => {setForm(prev => {return {...prev, email: e.target.value} })}}
			/>

			<span>First Name:</span>
			<input name="firstName" placeholder="First Name"
				className={(isFirstNameValid() ? 'validField' : 'invalidField')}
				onChange={(e) => {setForm(prev => {return {...prev, firstName: e.target.value}})}}
			/>

			<span>Last Name:</span>
			<input name="lastName" placeholder="Last Name"
				className={(isLastNameValid() ? 'validField' : 'invalidField')}
				onChange={(e) => {setForm(prev => {return {...prev, lastName: e.target.value}})}}
			/>

			<span>Password:</span>
			<input name="password" placeholder="Password" type="password" autoComplete="true"
				className={(isPasswordValid() ? 'validField' : 'invalidField')}
				onChange={(e) => {setForm(prev => {return {...prev, password: e.target.value}})}}
			/>

			<button type="button" onClick={registerNewUser} className={(validFields.current.size ===5 ? 'confirmBtn' : '')}>
				Register
			</button>

			<button type="button" onClick={() => {navigate(-1)}}>
				Back
			</button>

			{isLoading && 
				<div className="loaderDiv">
					<PacmanLoader color={'#673ab7'} size={150} />
				</div>
			}
		</form>
	);
}
