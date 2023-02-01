import {createSlice} from "@reduxjs/toolkit"

const teamsState = createSlice({
    name: "teams",
    initialState: {
        data: [],
        selectedTeamsId: []
    },
    reducers: {
        setTeams: (state, action)=>{
            state.data=action.payload
        },
        setAllSelectedTeams: (state, action) => {
            if (state.selectedTeamsId.length === state.data.length) {
                state.selectedTeamsId = []
            } else {
                state.selectedTeamsId = state.data.map(team => team._id)
            }
        },
        setSelectedTeam: (state, action) => {
            if (state.selectedTeamsId.includes(action.payload)) {
                state.selectedTeamsId = state.selectedTeamsId.filter(team => team !== action.payload)
            } else {
                state.selectedTeamsId.push(action.payload)

            }
        },
        updateTeam: (state, action) => {
            state.selectedTeamsId.forEach(teamId => {
                console.log(state.data.find(team => team._id === teamId))
            })
        }
    }
})

export const {setTeams,setAllSelectedTeams, setSelectedTeam, updateTeam} = teamsState.actions
export const selectCurrentTeams = state=>state.teams.data
export const selectedTeamsId = state=>state.teams.selectedTeamsId
export default teamsState.reducer