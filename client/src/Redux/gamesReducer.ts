import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Game } from '../Models/Game'
import { RootState} from './store'

export const getGames = createAsyncThunk('GamesState/getGames',
	async (token : string, thunkAPI) => {
		try {
			if (token == ''){
				axios.defaults.headers.common['authorization'] = null;
			} else{
				axios.defaults.headers.common['authorization'] = "Bearer " + token;
			}

			const response = await axios.get("https://gamerank.adarabadian.com/games");
			return response.data;
		} catch (err: any) {
			if (err.response.data.error !== undefined){
				toast.error(err.response.data.error);
			}
			toast.error(err);		 
		}
	}
)

// Define a type for the slice state
interface GamesState {
	gamesArray : Array<Game>
}

// Define the initial state using that type
const initialState: GamesState = {
	gamesArray : []
}

export const gamesSlice = createSlice({
	name: 'games',
	initialState,
	reducers: {
		setGamesArray: (state, action) => {
			state.gamesArray = action.payload;
		},

		setGameData: (state, action) => {
			const index = state.gamesArray.findIndex(game => 
				action.payload.id == game.id
			);
			
			state.gamesArray[index] = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getGames.fulfilled, (state, action: any) => {
			state.gamesArray = action.payload;
		})
	}
})

export const {setGamesArray, setGameData} = gamesSlice.actions
export const selectGames = (state: RootState) => state.gamesState
export default gamesSlice.reducer