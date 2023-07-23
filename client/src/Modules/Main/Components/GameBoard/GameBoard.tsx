import React, { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Game } from "../../../../Models/Game";
import { getGames } from "../../../../Redux/gamesReducer";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import CustomGame from "../CustomGame/CustomGame";
import GameCard from "../GameCard/GameCard";
import "./GameBoard.css";

export default function GameBoard() {
	const [isLoading, setIsLoading] = useState(false);
	const userDetails = useAppSelector(state => state.userState.userDetails);
	const gamesArray = useAppSelector(state => state.gamesState.gamesArray);
	const [searchValue, setSearchValue] = useState('');
	const [gamesToShow, setGamesToShow] = useState(gamesArray);
	const dispatch = useAppDispatch();
	
	useEffect(()=>{
		if (gamesArray == undefined || gamesArray.length == 0) {
			getGamesFromServer();
		};
	}, [userDetails])

	
	useEffect(()=>{
		setGamesToShow(gamesArray);
	}, [gamesArray])

	const getGamesFromServer = async () =>{
		setIsLoading(true);
			const token : String = localStorage.getItem("token");
			if (token == null){
				await dispatch(getGames(''));
			}
		setIsLoading(false);
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
		let filtered : Array<Game> = gamesArray.filter(g => g.name.toLowerCase().includes(e.target.value.toLowerCase()));
		setGamesToShow(filtered);
		setSearchValue(e.target.value);
	}

	const getGamesToShow = () =>{
		return gamesToShow.slice()
			.sort((a:any, b:any) => Number(b.releaseDate) - Number(a.releaseDate))
			.map((game: Game) => (
			<div className="gameCard" key={game.id}>
				<GameCard {...game} />
			</div>
		))
	}

	return (
		<div id="gameBoard">
			<h1 id="GB-header">Game Board</h1>

			<label>Search any game: </label>
			<input aria-label="Search" value={searchValue} placeholder="Try me :)" className={'animatedBorder'} onChange={handleSearchChange}></input>
			
			{(gamesToShow.length == 0) &&
				<CustomGame searchValue={searchValue}/>
			}

			{gamesToShow &&
				<div id="cardsDiv">
						{getGamesToShow()}
				</div>
			}

			{isLoading && <div className="loaderDiv"><PacmanLoader color={'#673ab7'} size={150} /></div>}
		</div>
	);
}