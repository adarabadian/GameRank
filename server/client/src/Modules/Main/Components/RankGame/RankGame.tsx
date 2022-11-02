import React, { useEffect, useState } from "react";
import "./RankGame.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Game } from "../../../../Models/Game";
import Slider from "react-input-slider";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Review } from "../../../../Models/Review";
import { RootState } from "../../../../Redux/store";
import { setGameData } from "../../../../Redux/gamesReducer";
import { useAppDispatch } from "../../../../Redux/hooks";
import axios from "axios";


export default function RankGame() {
    const navigate = useNavigate();
    const location : any = useLocation();
    let game: Game = location.state;
    const isLoggedIn = useSelector((state: RootState) => state.userState.isUserLoggedIn);
    const userDetails = useSelector((state: RootState) => state.userState.userDetails);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Rank');
    const [form, setForm] = useState({
        title: "",
        description: "",
        score: { x: 5 },
    });

    useEffect(() => {
        checkIfUpdate();
        
        if (!isLoggedIn || game == undefined) {
            navigate('/gameboard');
            return
        }
    }, [isLoggedIn]);

    const checkIfUpdate = async () =>{
        setIsLoading(true);

        if (game.userScore != null || userDetails != undefined){
            axios.defaults.headers.common['authorization'] = "Bearer " + userDetails.token;
            let userRank = await axios.get("https://adar-gamerank.herokuapp.com/ranks/getUserRank/" + game.id);
            
            if (userRank == undefined || userRank.data.length == 0){
                setIsLoading(false);
                return
            };

            game.userScore = userRank.data[0].score;
            setButtonText('Update review');
    
            setForm({title: userRank.data[0].title, description: userRank.data[0].description, score: {x: userRank.data[0].score}});
        }

        setIsLoading(false);
    }

    const areInputsValid = () =>{
        if (form.title.length > 50 ||form.title.length < 3){
            toast.warn('Review title must be minimum 3 letters and maximum 50.');
            return false;
        }
        
        if (form.description.length > 300){
            toast.warn('Review description must be maximum 300 letters.');
            return false;
        }
        
        if (form.score.x > 10 ||form.score.x < 0){
            toast.warn('Review score must be from 0 to 10.');
            return false;
        }
        return true;
    }

    const updateGameScore = (gameToUpdate: Game, newScore: number, oldScore: number) => {
        gameToUpdate.userScore = Number(newScore);
        gameToUpdate.scoreSummary = Number(gameToUpdate.scoreSummary) + Number(newScore);
         
        if (oldScore != null){
            gameToUpdate.scoreSummary = Number(gameToUpdate.scoreSummary -Number(oldScore));
        } else{
            gameToUpdate.reviewsCount ++;
        }

        dispatch({type: setGameData, payload: gameToUpdate});
        return gameToUpdate;           
    }

    const updateGameReviews = (gameToUpdate: Game, newReview: Review, oldScore: number) =>{
        newReview.reviewer = userDetails.firstName + ' ' + userDetails.lastName;
        newReview.reviewerId = userDetails.userId;
        newReview.date = getDate();
        
        if (oldScore != null && game.reviews != null){
            const index = gameToUpdate.reviews.findIndex(review => 
                review.reviewerId == userDetails.userId
            );
            
            let copy = JSON.parse(JSON.stringify(gameToUpdate))
            copy.reviews[index] = newReview;
            
            dispatch({type: setGameData, payload: copy});                
            const gameName = game.name.replace(/\s/g, '_');
            navigate(`/Game/`+gameName, {state:{game : copy}, replace : true}); 
            return
        } else{
            if (gameToUpdate.reviews != undefined){            
                gameToUpdate.reviews.push(newReview);
            }
            dispatch({type: setGameData, payload: gameToUpdate});
        }        
    }

    function padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    function getDate() {
        const date = new Date();

        return [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join('/');
    }

    const pushToGame = () =>{
        const gameName = game.name.replace(/\s/g, '_');
        const path = `/Game/`+gameName;
        
        navigate(path, {state:{game : game}, replace : true});
    }

    const setNewRankData = () =>{
        return {
            title:       form.title,
            description: form.description,
            score:       form.score.x,
            gameId:      game.id
        }
    }

    const submitRank = async (e: any) => {
        setIsLoading(true);
        // prevent reload on submit
        e.preventDefault();
        
        if (areInputsValid() === false){
            setIsLoading(false);
            return
        };

        const rank = await setNewRankData();

        try {
            axios.defaults.headers.common['authorization'] = "Bearer " +  userDetails.token;
            await axios.post("https://adar-gamerank.herokuapp.com/ranks", rank);

            let updatedGame = await updateGameScore(game, rank.score, game.userScore);
            updateGameReviews(updatedGame, rank, updatedGame.userScore);

            pushToGame();
            userDetails.socket.emit("updateGameReviews", {game: updatedGame, review: rank});

            toast.success("Your review was added successfully, Thanks!");
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);
        }
    };

    return (
        <form className="rankGameForm" onSubmit={submitRank}>
            <h1 className="pageHeader">Rank {game.name}</h1>
            <div className="sideBySide">
                <div>
                    <img src={game.picture}></img>
                </div>

                <div>
                    <p>Rank Title</p>
                    <input placeholder="Rank title" value={form.title}
                        onChange={(e) => {setForm(prev => {return {...prev, title: e.target.value}})}}>
                    </input>

                    <p>Description</p>
                    <textarea 
                        className="rankDescription" maxLength={300} value={form.description}
                        onChange={(e) => {setForm(prev => {return {...prev, description: e.target.value}})}}>
                    </textarea>

                    <br></br>
                    <p>Score</p>

                    <Slider axis="x" x={form.score.x} xmin={0} xmax={10} onChange={(e) => {setForm((prev) => { return { ...prev, score: e };});}}/>
                    <p>{form.score.x}</p>
                </div>
                
                <div>
                    <p>Average game score: {game.scoreSummary / game.reviewsCount >= 0 ? (game.scoreSummary / game.reviewsCount).toFixed(1) : 'Unranked'}</p><br></br>
                    <p>Reviewers amount: {game.reviewsCount}</p>
                </div>
            </div>

            <button type="submit" className={true ? "confirmBtn" : ""}>
                {buttonText}
            </button>

            <button
                type="button"
                onClick={() => {navigate(-1)}}>
                Back
            </button>

            {isLoading && (
                <div className="loaderDiv">
                    <PacmanLoader color={"#673ab7"} size={150} />
                </div>
            )}
        </form>
    );
}