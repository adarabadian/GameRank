import React from 'react'
import './GamePage.css';
import GameCard from '../GameCard/GameCard';
import GameReviews from '../GameReviews/GameReviews';
import GameDeals from '../GameDeals/GameDeals';
import { useLocation } from 'react-router-dom';

export default function GamePage() {
    const location = useLocation();
    const { state } : any = location;
    const game = state.game;
      
    return (
        <div className="gamePage">
            <GameCard {...game}/>
            <GameDeals {...{game:game}}/>
            <GameReviews {...{game:game}}/>
        </div>
    )
}
