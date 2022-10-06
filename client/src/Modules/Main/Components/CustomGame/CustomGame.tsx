import { MenuItem, Select } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PacmanLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Deal } from '../../../../Models/Deal';
import GameDeals from '../GameDeals/GameDeals';
import './CustomGame.css'

export default function CustomGame(props: any) {
    const [isLoading,   setIsLoading] = useState(false);
    const [deals,       setDeals] = useState(null);
    const [platforms,   setPlatforms] = useState(null);
    const [platform,    setPlatform] = useState(null);
    const [gameFound,   setGameFound] = useState(null);

    useEffect(() => {
        updateStateFromResponse(null);
    }, [props.searchValue])
    
    const getGamePlatforms = async () =>{
        setIsLoading(true);
        try {
            const response = await axios.get(
                "https://adar-gamerank.herokuapp.com/deals/getPlatforms",
                { params: { gameName: props.searchValue } }
            );
            
            if (response.data.gameFound && response.data.platformsArray.length == 0){
                return await scrapeCustomGame(response.data.gameFound);
            }

            updateStateFromResponse(response.data);
        } catch (err) {
            toast.error("We didn't managed to get this game for you, please try a different game.");
        } finally{
            setIsLoading(false);
        }
    }

    const getGameDeals = async () =>{
        setIsLoading(true);
        try {
            const response = await axios.get(
                "https://adar-gamerank.herokuapp.com/deals/getDealsByGameId",
                { params: { gameId: platform.gameId, platform : platform.platform} }
            );
            
            if (response.data == null){
                setIsLoading(false);
                return toast.error("We didn't managed to get deals for you, please try again later.");
            }

            setDeals(response.data.deals);
        } catch (err) {
            toast.error(err);
        } finally{
            setIsLoading(false);
        }
    }

    const updateStateFromResponse = (data : any) =>{
        if (data != null){
            setPlatform (data.platformsArray[0]);
            setPlatforms(data.platformsArray);
            setGameFound(data.gameFound);
            return;
        }

        setPlatform (null);
        setPlatforms(null);
        setGameFound(null);
        setDeals(null);
    }

    const changePlatform = (e: any) =>{
        setPlatform(JSON.parse(e.target.dataset.platform));
    }

    const scrapeCustomGame = async (gameFound : String) =>{
        const response = await axios.get(
            "https://adar-gamerank.herokuapp.com/deals",
            { params: { game: gameFound, platform: ''} }
        );
        
        setGameFound(response.data.gameFound);
        let sortedDeals = await response.data.deals.sort((a:Deal, b:Deal) => a.price - b.price);
        setDeals(sortedDeals);
    }

    return (
        <div className='customGameComponent'>
            {(deals == null && platforms == null) &&
                <div>
                    <h2>Not found - No problem!</h2>

                    <p>
                        We didnt found your game, no worries though.<br></br>
                        We will get you deals for any game that you'd like!
                    </p>

                    <button onClick={getGamePlatforms} className='confirmBtn'>Get deals!</button>
                </div>
            }

            {(deals == null && platforms != null) &&
                <div>
                    <h2 className='gameFound'>We found {gameFound} for you!</h2>
                    <h2>Please choose a platform:</h2>
                    <Select className='select'
                        labelId="Select-Platform"
                        value={platform.platform}
                        label={platform.platform}
                        >
                            
                        {platforms.map((platform: any) => (
                            <MenuItem key={platform.gameId} data-platform={JSON.stringify(platform)}
                                      value={platform.platform} onClick={changePlatform}>{platform.platform}</MenuItem>  
                        ))}
                    </Select>

                    <button onClick={getGameDeals} className='confirmBtn'>Get deals!</button>
                </div>
            }

            {(deals) && 
                <GameDeals game={{name: gameFound, deals:deals}} custom={true} />
            }
            
            {isLoading && <div className="loaderDiv"><PacmanLoader color={'#673ab7'} size={150} /></div>}
        </div>
    )
}
