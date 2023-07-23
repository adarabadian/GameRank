import { createSlice } from '@reduxjs/toolkit'
import { Currency } from '../Models/Currency'
import type { RootState } from './store'

// Define a type for the slice state
interface CurrenciesState {
	currencies : Array<Currency>
}

// Define the initial state using that type
const initialState: CurrenciesState = {
	currencies : [
		{name : 'EUR', value : 1,	symbol : '€'}, 
		{name : 'ILS', value : null, symbol : '₪'},
		{name : 'USD', value : null, symbol : '$'} 
	]
}

export const currenciesSlice = createSlice({
	name: 'currencies',
	initialState,
	reducers: {
		updateCurrency: (state, action) => {
			state.currencies[action.payload[1]] = action.payload[0];
		}
	}
})

export const { updateCurrency} = currenciesSlice.actions
export const selectCurrencies = (state: RootState) => state.currenciesState
export default currenciesSlice.reducer