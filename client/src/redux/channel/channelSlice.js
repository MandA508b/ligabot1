import {createSlice} from "@reduxjs/toolkit"

const channelState = createSlice({
    name: "channel",
    initialState: {
        data: [],
        selectedChannelId: []
    },
    reducers: {
        setChannel: (state, action)=>{
            state.data=action.payload
        },
        setAllSelectedChannel: (state, action) => {
            if (state.selectedChannelId.length === state.data.length) {
                state.selectedChannelId = []
            } else {
                state.selectedChannelId = state.data.map(channel => channel._id)
            }
        },
        setSelectedChannel: (state, action) => {
            if (state.selectedChannelId.includes(action.payload)) {
                state.selectedChannelId = state.selectedChannelId.filter(channel => channel !== action.payload)
            } else {
                state.selectedChannelId.push(action.payload)

            }
        },
        updateChannel: (state, action) => {
            state.selectedChannelId.forEach(channelId => {
                console.log(state.data.find(channel => channel._id === channelId))
            })
        }
    }
})

export const {setChannel,setAllSelectedChannel, setSelectedChannel, updateChannel} = channelState.actions
export const selectCurrentChannel = state=>state.channel.data
export const selectedChannelId = state=>state.channel.selectedChannelId
export default channelState.reducer