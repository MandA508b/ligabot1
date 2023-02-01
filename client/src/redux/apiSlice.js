import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {logoutUser, setCredentials} from "./auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl:"https://ligabotv2.onrender.com",
    credentials: 'include',
    prepareHeaders: (headers,{getState}) =>{
        const token = localStorage.getItem('token')
        if(token){
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api,extraOption)=>{
    let result = await baseQuery(args, api,extraOption)

    if(result?.error?.status === 401){
        console.log("send re token")
        const refreshResult = await baseQuery('/auth/refresh', api, extraOption)
        console.log(refreshResult)
        if(refreshResult?.data){
            const user = api.getState().user.user
            api.dispatch(setCredentials({...refreshResult.data, user}))
            //retry request with refreshed token
            result = await baseQuery(args, api, extraOption)
        }else{
            api.dispatch(logoutUser())
        }
    }
    return result
}
export const apiSlice = createApi({
    reducerPath:"appApi",
    baseQuery: baseQueryWithReauth,
    tagTypes:["Users","Leagues", "Teams","City"],
    endpoints:build=>({})
})