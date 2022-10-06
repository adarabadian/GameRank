import './GameDeals.css'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Deal } from '../../../../Models/Deal';
import { MenuItem, Select } from '@mui/material';
import { RootState } from '../../../../Redux/store';
import { setGameData } from '../../../../Redux/gamesReducer';
import { useAppDispatch } from '../../../../Redux/hooks';
import axios from 'axios';
import { updateCurrency } from '../../../../Redux/currenciesReducer';
import { Currency } from '../../../../Models/Currency';

export default function GameDeals(props: any) {
    const game = props.game;
    const platform = props.platform;
    const isCustom = props.custom;
    const [isLoading, setIsLoading] = useState(false);
    const [platformFilter, setPlatformFilter] = useState('');
    const [deals, setDeals] = useState([]);
    const currencies : Array<Currency> = useSelector((state : RootState) => state.currenciesState.currencies);
    const [currency, setCurrency]= useState(currencies[0]);
    const dispatch = useAppDispatch();
    const dealsTable = useRef(null);
    
    useEffect(() => {
        if (isCustom == undefined){
            handlePlatform();
        } else{
            setDeals(game.deals);
        }
    }, []);

    useEffect(() => {
        if (isCustom == undefined){
            if (platformFilter != undefined && platformFilter != ''){
                getGameDeals();
            }
        }

        dealsTable.current.scrollTo(0, 0);
    }, [platformFilter]);

    function handlePlatform() {
        if (platform == undefined || platform == '') {
            if(game.isPc){
                setPlatformFilter('PC');
                return;
            } 
            if(game.isXbox){
                setPlatformFilter('Xbox');
                return;
            } 
            if(game.isPs){
                setPlatformFilter('PS');
                return;
            } 
        }
        setPlatformFilter(platform+'');
    }

    async function getGameDeals() {
        if ( game.deals != [] && game.deals != undefined &&
            (game.deals.filter((deal: Deal) => deal.platform == platformFilter)) != undefined &&
            (game.deals.filter((deal: Deal)  => deal.platform == platformFilter)) != [] &&
            (game.deals.filter((deal: Deal)  => deal.platform == platformFilter)).length != 0){
                setDeals(game.deals.filter((deal: Deal) => deal.platform == platformFilter));
                return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                "https://adar-gamerank.herokuapp.com/deals",
                { params: { game: game.name, platform: platformFilter } }
            );
            setDeals(response.data.deals.sort((a:Deal, b:Deal) => a.price - b.price))
                
            if (game.deals != undefined){                
                game.deals.push(response.data.sort((a:Deal, b:Deal) => a.price - b.price));
            } else{
                game.deals = response.data.sort((a:Deal, b:Deal) => a.price - b.price);
            }
            
            dispatch({ type: setGameData, payload: game });
        } catch (err) {
            toast.error(err);
        }
        setIsLoading(false);
    }

    async function getCurrFromServer(requestCurrency:string, index: number) {
        const host = 'api.frankfurter.app';
        let res : any = await axios.get(`https://${host}/latest?amount=1&from=EUR&to=${requestCurrency}`);
        res = res.data;
        let cur = {...currencies[index]};
        cur.value = res.rates[requestCurrency];
        dispatch({type: updateCurrency, payload: [cur, index]});
        setCurrency(cur);
    }
    

    async function handleCurrencyChange(requestCurrency:string){
        const index : number= currencies.findIndex(object => {
            return object.name == requestCurrency;
        });
        
        setIsLoading(true);
            try {
                if (currencies[index].value == null){
                    await getCurrFromServer(requestCurrency, index)
                } else{
                    setCurrency(currencies[index]);
                }
            } catch (err : any){         
                toast.error('An error has occured. ' + err);
            }
        setIsLoading(false);
    }

    return (
        <div id='gameDeals'>
            <h1><a>Best</a> {game.name} deals</h1>
            
            <div className='selectorsDiv'>
                {isCustom == undefined && 
                    <Select className='platformSelector'
                        labelId="Select-Platform"
                        value={platformFilter}
                        label={'platform'}
                        onChange={(e: any) =>
                            setPlatformFilter(e.target.value)
                        }>
                        {game.isPc && <MenuItem value={"PC"}>PC</MenuItem>}
                        {game.isXbox && <MenuItem value={"Xbox"}>Xbox</MenuItem>}
                        {game.isPs && <MenuItem value={"PS"}>PlayStation</MenuItem>}
                    </Select>
                }

                <Select className='currencySelector'
                    labelId="Select-Currency"
                    value={currency.name}
                    label={'Currency'}
                    onChange={(e: any) =>
                        handleCurrencyChange(e.target.value)
                        }>
                        <MenuItem value={"EUR"}>EUR / €</MenuItem>
                        <MenuItem value={"USD"}>USD / $</MenuItem>
                        <MenuItem value={"ILS"}>ILS / ₪</MenuItem>
                </Select>
            </div>

            <div className='tableContainer'>
                <table className='headerTable'>
                    <tbody>
                        <tr>
                            <th>
                                Store
                            </th>
                            <th>
                                Edition
                            </th>
                            <th>
                                Price in {currency.symbol}
                            </th>
                            <th>
                            </th>
                        </tr>
                    </tbody>
                </table>

                <table ref={dealsTable} className='bodyTable'>
                    <tbody>
                        {(deals != undefined) &&
                            deals.map((deal: Deal, index: number) => (
                            <tr key={index}>
                                <td>
                                    {deal.store}
                                </td>
                                <td>
                                    {deal.edition}
                                </td>
                                <td>
                                    {(deal.price * currency.value).toFixed(2)}{currency.symbol}
                                </td>
                                <td>
                                    <button style={{animationDelay : (index/6)+ 's'}} onClick={()=>{window.location.href=(deal.link)}}><a>Go to</a>{deal.store}</button>
                                </td>
                            </tr> 
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isLoading && (
                <div className="loaderDiv">
                    <PacmanLoader
                        color={"#673ab7"}
                        loading={isLoading}
                        size={150}
                    />
                </div>
            )}
        </div>
    )
}
