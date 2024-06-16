import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigateToTrackList } from "../navigationHelper";
import { navigateToTeacherHome } from "../navigationHelper";
import { navigateToadmin } from "../navigationHelper";
import { navigateToSignup } from "../navigationHelper";


const authReducer = (state,action) => {
    switch(action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload};
        case 'signin':
            return { errorMessage:'', token:action.payload};
        case 'clear_error_message':
            return {...state, errorMessage:''};
        case 'signout':
            return {token:null,errorMessage:''};    
        default:
            return state;
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        dispatch ({type:'signin', payload:token});
        navigateToTrackList();
    } else {
        navigateToTrackList();
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({type:'clear_error_message'});
}

const signup = dispatch =>  async ({email,password,batchCode}) => {
        try{
            console.log('j');
            const response = await trackerApi.post('/signupS', {email,password,batchCode});
            console.log("ds1");
            await AsyncStorage.setItem('token',response.data.token);
            console.log("ds2");
            dispatch({type:'signin',payload:response.data.token});
            console.log("ds3");

            navigateToTrackList();
            console.log('qs');
        } catch (err) {
            console.log('lss');
            dispatch({type: 'add_error', payload: 'Something went wrong with sign up'})
        }

    };


    const signin = dispatch =>  async ({email,password}) => {
        try{
            console.log('j');
            const response = await trackerApi.post('/signin', {email,password});
            console.log('a',response.data.userType);
            await AsyncStorage.setItem('token',response.data.token);
            console.log("ds2");
            dispatch({type:'signin',payload:response.data.token});
            console.log("ds3");
            
            if (response.data.userType == 1) {
            navigateToTrackList()};
            if (response.data.userType == 2) {
                console.log("SD");
            navigateToTeacherHome()};
            if (response.data.userType == 3) {
            navigateToadmin()};
            console.log('qs');
        } catch (err) {
            console.log('lss');
            dispatch({type: 'add_error', payload: 'Something went wrong with sign in'})
        }

    };

const signout = dispatch => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type:'signout'});
    navigateToSignup();
};


export const { Provider, Context} = createDataContext(
    authReducer,
    {signup,signin,signout, clearErrorMessage,tryLocalSignin},
    { token: null, errorMessage: ''}
);