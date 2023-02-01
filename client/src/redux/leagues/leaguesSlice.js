import {createSlice} from "@reduxjs/toolkit"

const leaguesState = createSlice({
    name: "leagues",
    initialState: {
        data: [],
        selectedLeaguesId: []
    },
    reducers: {
        setLeagues: (state, action) => {
            state.data = action.payload
        },
        setAllSelectedLeagues: (state, action) => {
            if (state.selectedLeaguesId.length === state.data.length) {
                state.selectedLeaguesId = []
            } else {
                state.selectedLeaguesId = state.data.map(league => league._id)
            }
        },
        setSelectedLeague: (state, action) => {
            if (state.selectedLeaguesId.includes(action.payload)) {
                state.selectedLeaguesId = state.selectedLeaguesId.filter(league => league !== action.payload)
            } else {
                state.selectedLeaguesId.push(action.payload)

            }
        },
        updateLeague: (state, action) => {
            state.selectedLeaguesId.forEach(leagueId => {
                console.log(state.data.find(league => league._id === leagueId))
            })
        }
    }
})

export const {setLeagues, setAllSelectedLeagues, setSelectedLeague, updateLeague} = leaguesState.actions
export const selectCurrentLeagues = state => state.leagues.data
export const selectedLeaguesId = state => state.leagues.selectedLeaguesId
export default leaguesState.reducer