import {createSlice} from "@reduxjs/toolkit"

const advertisementState = createSlice({
    name: "advertisement",
    initialState: {
        data: [],
        selectedAdvertisementId: []
    },
    reducers: {
        setAdvertisement: (state, action)=>{
            state.data=action.payload
        },
        setAllSelectedAdvertisement: (state, action) => {
            if (state.selectedAdvertisementId.length === state.data.length) {
                state.selectedAdvertisementId = []
            } else {
                state.selectedAdvertisementId = state.data.map(advertisement => advertisement._id)
            }
        },
        setSelectedAdvertisement: (state, action) => {
            if (state.selectedAdvertisementId.includes(action.payload)) {
                state.selectedAdvertisementId = state.selectedAdvertisementId.filter(advertisement => advertisement !== action.payload)
            } else {
                state.selectedAdvertisementId.push(action.payload)

            }
        }
    }
})

export const {setAdvertisement,setAllSelectedAdvertisement, setSelectedAdvertisement} = advertisementState.actions
export const selectCurrentAdvertisement = state=>state.advertisement.data
export const selectedAdvertisementId = state=>state.advertisement.selectedAdvertisementId
export default advertisementState.reducer