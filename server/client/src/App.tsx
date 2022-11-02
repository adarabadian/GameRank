import "./App.css";
import Header from "./Modules/Shared/Header/Header";
import Footer from "./Modules/Shared/Footer/Footer";
import React from "react";
import Landing from "./Modules/LandingPage/Components/Home/Landing";
import GameBoard from "./Modules/Main/Components/GameBoard/GameBoard";
import Login from "./Modules/Main/Components/Login/Login";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Modules/Main/Components/Register/Register";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GamePage from "./Modules/Main/Components/GamePage/GamePage";
import RankGame from "./Modules/Main/Components/RankGame/RankGame";
import EmailValidation from "./Modules/Main/Components/EmailValidation/EmailValidation";
import ResetPassword from "./Modules/Main/Components/ResetPassword/ResetPassword";
import ResetPasswordVerification from "./Modules/Main/Components/ResetPasswordVerification/ResetPasswordVerification";

export function App() {
	return (
	    <div id="app">
	        <ToastContainer
	            position="top-center"
	            autoClose={5000}
	            hideProgressBar={false}
	            newestOnTop={false}
	            closeOnClick
	            rtl={false}
	            pauseOnFocusLoss
	            draggable
	            pauseOnHover
	        />
	
	        <BrowserRouter>
	            <div id="appHeader" className="appDivs">
	                <Header />
	            </div>
	
	            <div id="appContent" className="appDivs">
	                <Routes>
	                    <Route path="/home" element={<Landing />}  />
	                    <Route path="/gameboard" element={<GameBoard />}  />
	                    <Route path="/login" element={<Login />}  />
	                    <Route path="/register" element={<Register />}  />
	                    <Route path="/game/:game" element={<GamePage />}  /> 
	                    <Route path="/rankgame" element={<RankGame />}  /> 
	                    <Route path="/emailvalidation" element={<EmailValidation />}  /> 
						<Route path="/resetpassword" element={<ResetPassword />}  />
						<Route path="/resetpasswordconfirmation" element={<ResetPasswordVerification />}  />
	                    <Route path="/" element={<Navigate to="/home" replace />}/>
	                </Routes>
	            </div>
	
	            <div id="appFooter" className="appDivs">
	                <Footer />
	            </div>
	        </BrowserRouter>
	    </div>
	);
}

export default App;
