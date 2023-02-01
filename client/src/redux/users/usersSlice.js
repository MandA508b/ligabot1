import {createSlice} from "@reduxjs/toolkit"

const usersState = createSlice({
    name: "users",
    initialState: {
        data: [],
        selectedUsersId: []
    },
    reducers: {
        setAllUsers: (state, action) => {
            state.data = action.payload
            console.log(state.data)
        },
        setAllSelectedUsers: (state, action) => {
            if(state.selectedUsersId.length===state.data.length){
                state.selectedUsersId = []
            }else{
                state.selectedUsersId = state.data.map(user => user._id)
            }
        },
        setSelectedUser: (state, action) => {
            if (state.selectedUsersId.includes(action.payload)) {
                state.selectedUsersId = state.selectedUsersId.filter(user => user !== action.payload)
            } else {
                state.selectedUsersId.push(action.payload)

            }
        },
        updateUser:(state,action)=>{
            state.selectedUsersId.forEach(userId=>{
                console.log(state.data.find(user=>user._id === userId))
            })
        }
    }
})

export const selectCurrentUsers = state => state.users.data
export const getSelectedUsers = state => state.users.selectedUsersId
export const {
    setAllUsers, setAllSelectedUsers,
    setSelectedUser
} = usersState.actions
export default usersState.reducer