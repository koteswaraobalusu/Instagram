import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../utils/getCookie";


const baseQuery= fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    credentials: 'include',
    prepareHeaders: (headers) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken); // ✅ Set CSRF token for Django
    }
    return headers;
  },
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
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // ✅ Include CSRF token for refresh too
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