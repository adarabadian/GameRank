import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../Redux/store";
import "./Landing.css";

export default function Landing() {
    const navigate = useNavigate();

    const isUserLoggedIn = useSelector(
        (state: RootState) => state.userState.isUserLoggedIn
    );
    useEffect(() => {
        if (isUserLoggedIn) {
            navigate("/gameboard");
        }
    }, [isUserLoggedIn]);
	
    return (
        <div id="landing">
            <h1 id="landingHeader">GameRank</h1>
            <div id="about">
                <p>
                    GamerRank&#8482; is a system developed by Adar Abadian
                    <br></br><br></br>
                    GameRank will save you tons of money, by letting you get the cheapest deals available
                    for ANY game/software you'd like (Try searching your desire in the search bar in the games board).
                    <br></br><br></br>
                    Gamerank was designed to help everyone to find his next game and
                    give you - gamers a chance to criticise the video games they
                    played.
                    You may browse all games and see their ranks, if you want to
                    rank game yourself you have to login.<br></br>
                    In case you don't have a user you can create one down below.
                </p>
            </div>
            <div id="buttonsDiv">
                <button
                    className="landingBtns"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Login
                </button>
                <button
                    className="landingBtns"
                    onClick={() => {
                        navigate("/register");
                    }}
                >
                    Register
                </button>
                <button
                    className="landingBtns"
                    id="gamesLinkBtn"
                    onClick={() => {
                        navigate("/gameboard");
                    }}
                >
                    Games Board
                </button>
            </div>
        </div>
    );
}
