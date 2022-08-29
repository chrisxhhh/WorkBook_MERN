import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {alertsSlice} from "./alertsSlice";
import { contentSlice } from './contentSlice';
import { userSlice } from './userSlice';

const appReducer = combineReducers({
    alerts: alertsSlice.reducer,
    user: userSlice.reducer,
    content: contentSlice.reducer

    
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT'){
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

const store = configureStore({
    reducer: rootReducer,
});

export default store;