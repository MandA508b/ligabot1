import {createSlice} from "@reduxjs/toolkit"

const cityState = createSlice({
    name: "city",
    initialState: {
        data: [],
        selectedCityId: []
    },
    reducers: {
        setCity: (state, action)=>{
            state.data=action.payload
        },
        setAllSelectedCity: (state, action) => {
            if (state.selectedCityId.length === state.data.length) {
                state.selectedCityId = []
            } else {
                state.selectedCityId = state.data.map(city => city._id)
            }
        },
        setSelectedCity: (state, action) => {
            if (state.selectedCityId.includes(action.payload)) {
                state.selectedCityId = state.selectedCityId.filter(city => city !== action.payload)
            } else {
                state.selectedCityId.push(action.payload)

            }
        },
        updateCity: (state, action) => {
            state.selectedCityId.forEach(cityId => {
                console.log(state.data.find(city => city._id === cityId))
            })
        }
    }
})

export const {setCity,setAllSelectedCity, setSelectedCity, updateCity} = cityState.actions
export const selectCurrentCity = state=>state.city.data
export const selectedCityId = state=>state.city.selectedCityId
export default cityState.reducer