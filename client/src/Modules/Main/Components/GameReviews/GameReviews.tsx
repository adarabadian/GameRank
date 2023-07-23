import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners';
import { Review } from '../../../../Models/Review';
import GameReview from '../GameReview/GameReview';
import './GameReviews.css'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { RootState } from '../../../../Redux/store';
import { setGameData } from '../../../../Redux/gamesReducer';
import {useLocation, useNavigate} from "react-router-dom";
import { useAppDispatch } from '../../../../Redux/hooks';
import axios from 'axios';

export default function GameReviews(props: any) {
	const location = useLocation();
	const { state } : any = location;
	let game = state.game;
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const isLoggedIn = useSelector((state : RootState) => state.userState.isUserLoggedIn);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (game == undefined){
			navigate('/gamesboard')
			return;
		}

		if (game.reviews == undefined || game.reviews.length != game.reviewsCount){
			getUserReviews();
			return;
		}
		
		setReviews(game.reviews);
	},[])
	
	const getUserReviews = async () =>{
		setIsLoading(true);
			const response = await axios.get("https://gamerank.adarabadian.com/ranks", {params: { gameId: game.id}});
			setReviews(response.data);

			let gameCopy = JSON.parse(JSON.stringify(game));
			gameCopy.reviews = response.data;

			dispatch({type: setGameData, payload: gameCopy});
		setIsLoading(false);
	}
	
	const getButtonToShow = () =>{
		if (isLoggedIn){
			if (game.userScore != null){
				return <button onClick={() => navigate('/rankgame',	{state: {game:game}})}>Update rank</button>
			}
			return <button onClick={() => navigate('/rankgame', {state: {game:game}})} className='confirmBtn'>Rank me!</button>
		} else{
			return <button onClick={() => navigate('/login')}>Log in to rank this game</button>
		}
	}

	return (
		<div className='gameReviews'>
			<h1 className="reviewsTitle">User Reviews</h1>

			{(reviews != undefined && reviews.length != 0) && 
					<div className='reviews'>
						{(reviews != undefined) &&
							reviews.map((review: Review, index: number) => (
							<GameReview {...review} key={index}/>	
						))}
					</div>
			}

			{(reviews == undefined || reviews.length == 0) && 
					<div className='noReviews'>
						<SentimentDissatisfiedIcon/>
						<p>
							Unfortunately, no reviews yet.<br></br>
							Be the first to rank!
						</p>
						{getButtonToShow()}
					</div>
			}

			{isLoading && 
				<div className="loaderDiv">
					<PacmanLoader color={'#673ab7'} loading={isLoading} size={150} />
				</div>
			}
		</div>
	)
}
