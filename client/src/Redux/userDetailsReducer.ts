import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";
import { UserDetails } from "../Models/UserDetails";
import { getGames } from "./gamesReducer";
import type { RootState } from "./store";


export const getUser = createAsyncThunk('userDetails/updateUser',
    async (user: any, thunkAPI) => {
        try{
            const response = await axios.post("https://gamerank.onrender.com/users/login", user);
            localStorage.setItem("token", response.data.token);
            const socket = await io("https://gamerank.onrender.com/", {query : {"token" : response.data.token}});
            response.data.socket = socket;
    
            thunkAPI.dispatch({ type: logInUser, payload: response.data });
            thunkAPI.dispatch(getGames(response.data.token))
            return response.data;
        }
        catch (err : any){
            return err;
        }
    }
)

export const loginWithToken = createAsyncThunk('userDetails/loginWithToken',
    async (token: any, thunkAPI) => {
        try{
            axios.defaults.headers.common['authorization'] = "Bearer " + token;
            const response = await axios.post("https://gamerank.onrender.com/users/logUserWithToken",token);
            localStorage.setItem("token", response.data.token);
            const socket = await io("https://gamerank.onrender.com/", {query : {"token" : response.data.token}});
            response.data.socket = socket;
    
            thunkAPI.dispatch({ type: logInUser, payload: response.data });
            thunkAPI.dispatch(getGames(response.data.token));
            return response.data;
        } catch{
            thunkAPI.dispatch(getGames(''));
        }
    }
)

// Define a type for the slice state
interface UserDetailsState {
    isUserLoggedIn: boolean;
    userDetails: UserDetails;
}

// Define the initial state using that type
const initialState: UserDetailsState = {
    isUserLoggedIn: false,
    userDetails: null,
};

export const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState,
    reducers: {
        logInUser: (state, action) => {
            state.userDetails = action.payload;
            state.isUserLoggedIn = true;
        },

        logOffUser: (state) => {
			state.userDetails.socket.disconnect();
            state.userDetails = null;
            state.isUserLoggedIn = false;
            // clear session storage so he wont have useless data and wont be able to login until he relogs
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUser.fulfilled, (state, action: any) => {
            state.userDetails = action.payload;
        });

        builder.addCase(loginWithToken.fulfilled, (state, action: any) => {
            state.userDetails = action.payload;
        })
    }
});

export const { logInUser, logOffUser } = userDetailsSlice.actions;
export const selectUserDetails = (state: RootState) => state.userState;
export default userDetailsSlice.reducer;
