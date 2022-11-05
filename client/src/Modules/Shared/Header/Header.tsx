import React, { useEffect, useRef, useState } from 'react';
import {  AppBar,  Toolbar,  Button} from "@material-ui/core";
import "./Header.css";
import { PacmanLoader } from "react-spinners";
import { loginWithToken, logOffUser } from '../../../Redux/userDetailsReducer';
import { useAppDispatch, useAppSelector } from '../../../Redux/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setGameData } from '../../../Redux/gamesReducer';
import { Review } from '../../../Models/Review';

function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const didMountRef = useRef(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const gamesArray = useAppSelector(state => state.gamesState.gamesArray);
    const isLoggedIn = useAppSelector(state => state.userState.isUserLoggedIn);
    const userDetails = useAppSelector(state => state.userState.userDetails);


    useEffect( ()=>{
        const token : String = localStorage.getItem("token");
        if (token !== null){
            loginUserWithToken(token);
        }
    },[]);
    
    useEffect( ()=>{
        if (isLoggedIn && !didMountRef.current){
            if (userDetails != undefined && userDetails != null && gamesArray != undefined && gamesArray.length != 0){
                setSocketListeners();
                didMountRef.current = true;
            }
        }

    },[isLoggedIn, gamesArray]);

    const loginUserWithToken = async (token : String)=>{
        if (userDetails != undefined && userDetails != null){
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
            await dispatch(loginWithToken(token));
        setIsLoading(false);
    }   
    
    const setSocketListeners = async () =>{
        let callbacks = await userDetails.socket._callbacks;
        
        if (callbacks == undefined || Object.keys(callbacks).length === 0 ){
            userDetails.socket.on("updateGameReviews", (data: any) => {
                let gameFromSocket = data.gameCopy[0];
                gameFromSocket.reviews = data.reviews;
                let modifiedGame = modifyGame(gameFromSocket);

                toast.info(<p onClick={()=>{
                                const gameName = modifiedGame.name.replace(/\s/g, '_');
                                navigate(`/Game/`+gameName, {state:{game : modifiedGame}});
                            }}>
                        {data.userName} has just ranked {modifiedGame.name}! click here to see the Review.</p>, {
                        position: "top-right",
                    });
                
                dispatch({type: setGameData, payload: modifiedGame});
            }); 
        }
    }   

    const modifyGame = (game : any) =>{
        const index = gamesArray.findIndex(gameFromArr => 
            game.id == gameFromArr.id
        );
        
        let modifiedGame = {...gamesArray[index]};        
        
        modifiedGame.scoreSummary  =  game.scoreSummary;
        modifiedGame.reviewsCount  =  game.reviewsCount;
        modifiedGame.reviews       =  game.reviews;

        if (modifiedGame.userScore == null){
            modifiedGame.userScore = searchForUserScore(modifiedGame.reviews);
        }
        
        return modifiedGame;
    }

    const searchForUserScore = (reviews : Array<Review>) =>{
        const index = reviews.findIndex((review : Review) => 
            review.reviewerId == userDetails.userId
        );

        if (index > -1){
            return reviews[index].score;
        }

        return null;
    }

    const logOut = async () =>{
        setIsLoading(true);
        let token = userDetails.token;
        axios.defaults.headers.common['authorization'] = "Bearer " + token;
        await axios.post("https://gamerank.onrender.com/users/logOutUser/");
        // GamesUtils.getGamesFromServer('', dispatch);

        dispatch({type: logOffUser});
        setIsLoading(false);
    }
    
    return (
        <div className='header'>
            <AppBar position="static">
                <Toolbar>
                    <Button id="homeLink"onClick={() =>{navigate('/home')}}color="inherit">GameRanks</Button>
                    {isLoggedIn ? 
                                <Button id="pageHeaderBtn" onClick={logOut} color="inherit">Log Out</Button> : 
                                <Button id="pageHeaderBtn" onClick={() => {navigate('/login')}} color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
            
            {isLoading && 
                <div className="loaderDiv">
                    <PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
                </div>
            }
        </div>
    );
}

export default Header

