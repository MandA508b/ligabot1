import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import {apiSlice} from "./apiSlice";
import usersReducer from './users/usersSlice'
import leaguesReducer from './leagues/leaguesSlice'
import cityReducer from './city/citySlice'
import teamReducer from './teams/teamsSlice'
import channelReducer from './channel/channelSlice'
import advertisementReducer from './advertisement/advertisementSlice'
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: usersReducer,
        auth: authReducer,
        leagues: leaguesReducer,
        teams:teamReducer,
        city:cityReducer,
        channel:channelReducer,
        advertisement:advertisementReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    //devTools: true
})