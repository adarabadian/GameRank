import React, { useEffect, useState } from 'react'
import { Game } from '../../../../Models/Game'
import './GameCard.css'
import pcPic from '../../../../Assets/pc.png';
import psPic from '../../../../Assets/ps.png';
import xboxPic from '../../../../Assets/xbox.png';
import noPic from '../../../../Assets/missing.jpg';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import GameDealsModal from '../GameDealsModal/GameDealsModal'
import { RootState } from '../../../../Redux/store'
import { useLocation } from 'react-router-dom'


export default function GameCard(props: any) {
	const location = useLocation();
	const [game, setGame] = useState(props);
	const navigate = useNavigate();
	const isLoggedIn =	useSelector((state : RootState) => state.userState.isUserLoggedIn);
	const gamesArray =	useSelector((state : RootState) => state.gamesState.gamesArray);
	const [secondButton, setSecondButton] = useState(<button></button>);
	const [isFirstRun, setIsFirstRun] = useState(true);

	useEffect( ()=>{
		if (!isFirstRun){
			setGame(refreshGameFromArr());
			return;
		} 
		setIsFirstRun(false);
	},[gamesArray]);

	function refreshGameFromArr(){
		const index = gamesArray.findIndex(gameFromArr => 
			game.id == gameFromArr.id
		);
			
		return gamesArray[index];
	}


	useEffect(() => {
		if (location.pathname != '/gameboard'){
			setSecondButton(<button onClick={() => navigate('/gameboard')}>Go back</button>)
			return;
		}
		setSecondButton(<button onClick={() => goToGamePage(game)}>Read more</button>)
	},[location.pathname])
	
	
	const goToGamePage = (game: Game) =>{
		const gameName = game.name.replace(/\s/g, '_');
		const path = `/Game/`+gameName;

		navigate(path, {state:{game : game}});		
	}

	const getButtonToShow = () =>{
		if (isLoggedIn){
			if (game.userScore != null){
				return <button onClick={() => navigate('/rankgame',	{state: game})}>Update rank</button>
			}
			return <button onClick={() => navigate('/rankgame',	{state: game})} className='confirmBtn'>Rank me!</button>
		} else{
			return <button onClick={() => navigate('/login')}>Log in to rank this game</button>
		}
	}

	return (
		<div className="gameCard">
			<h1 className="name">{game.name}</h1>
			
			<div id="gameCardGeneralInfo">
				<div className="generalInfoDiv">
					<h3>Developer:</h3>{game.developer}
				</div>
				<div className="generalInfoDiv">
					<h3>Platforms:</h3>
					{game.isPc ? <img src={pcPic} alt={noPic}></img> : ''}
					{game.isPs ? <img src={psPic} alt={noPic}></img> : ''}
					{game.isXbox ? <img src={xboxPic} alt={noPic}></img> : ''}
				</div>
				<div className="generalInfoDiv">
					<h3>Release Year:</h3>{game.releaseDate}
				</div>
			</div>

			<img className="gamePic" src={game.picture} alt={noPic}></img>

			<p>{game.description}</p>

			<h2 className="scoreRow">Game Score: {Number(Number(game.scoreSummary) / Number(game.reviewsCount)) >= 0 ? (Number(game.scoreSummary) / Number(game.reviewsCount)).toFixed(1) : 'Unranked'}</h2>
			<h2 className="scoreRow">Reviewers: {game.reviewsCount}</h2>

			{getButtonToShow()}
			{secondButton}
			<GameDealsModal {...game}/>
		</div>
	)
}
