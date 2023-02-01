import {apiSlice} from "../apiSlice";

export const cityApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllCity: build.query({
            query: () => '/city/findAll',
            providesTags:["City"]
        }),
        createCity: build.mutation({
            query:body=>({
                url:'/city/create',
                method:"POST",
                body
            }),
            invalidatesTags:["City"]
        }),
        updateCity: build.mutation({
            query:body=>({
                url:'/city/redact',
                method:"PUT",
                body
            }),
            invalidatesTags:["City"]
        }),
        deleteCity: build.mutation({
            query:body=>({
                url:'/city/delete',
                method:'DELETE',
                body
            }),
            invalidatesTags:["City"]
        }),
        
    })
})

export const {useFetchAllCityQuery, useCreateCityMutation,useUpdateCityMutation, useDeleteCityMutation} = cityApiSlice