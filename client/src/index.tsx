import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './App';
import { Provider } from 'react-redux'
import { store } from './Redux/store';

ReactDOM.render(
	<Provider store={store}>
		<Layout />
	</Provider>,
	document.getElementById('root')
);