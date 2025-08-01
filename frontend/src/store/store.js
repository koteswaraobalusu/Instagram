import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {userAuthenticationApi} from "../api/userAuthenticationApi";



export const store=configureStore({
    reducer:{
        ...rootReducer,
        [userAuthenticationApi.reducerPath]: userAuthenticationApi.reducer,

    },
    devTools:process.env.NODE_ENV!=="production",
    middleware:(getDefaultMiddleware)=> 
        getDefaultMiddleware().concat(userAuthenticationApi.middleware)
})