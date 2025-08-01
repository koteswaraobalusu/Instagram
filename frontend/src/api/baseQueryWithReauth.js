import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery= fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);      
    if (result.error && result.error.status === 401) {
        // try to reauthenticate
        console.log('Reauthenticating...');     
        const reauthResult = await baseQuery({
            url:'token/refresh/', 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
        },
            body: {},
        },
            api, extraOptions);
        if (reauthResult.data) {
            // store the new token
            console.log('Reauthentication successful, retrying original query...');
            // retry the original query
            result = await baseQuery(args, api, extraOptions);
        }           
    } else if (result.error) {
        console.error('Error occurred:', result.error);
    }   
    return result;
};

export default baseQueryWithReauth;