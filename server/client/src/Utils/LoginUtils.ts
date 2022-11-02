import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const createReactClass = require('create-react-class');

const LoginUtils = createReactClass({
    statics: {
        // function that tries log in with token only
        async loginWithToken (token: string) {
            try {
                axios.defaults.headers.common['authorization'] = "Bearer " + token;
                const response =  await axios.post("https://gamerank.onrender.com/users/logUserWithToken");
                const userData = response.data;
                userData.token = token;
            
                userData.socket = io("https://gamerank.onrender.com/", {query : {"token" : token}});
                toast.success("Welcome back " + userData.firstName + "!")
                return userData;
            }
            catch (err: any) {
            }
        },        
    },
    render() {
        return
    },
  });
  
  export default LoginUtils;

