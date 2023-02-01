import {createSlice} from "@reduxjs/toolkit"

const authState = createSlice({
    name:"auth",
    initialState:{user:null,token:null},
    reducers:{
        setCredentials: (state, action)=>{
            const {user, accessToken} = action.payload
            state.user = user
            state.token = accessToken
            localStorage.setItem("token", accessToken)
        },
        logoutUser: (state, action)=>{
            state.user = null
            state.token = null
            localStorage.removeItem('token')
        }
    }
})

export const selectCurrentUser = state => state.user.user
export const selectCurrentToken = state => state.user.token
export const {setCredentials, logoutUser} = authState.actions
export default authState.reducer