import {apiSlice} from "../apiSlice";

export const advertisementApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllAdvertisement: build.query({
            query: () => '/advertisement/findAll',
            providesTags:["Advertisement"]
        }),
        createAdvertisement: build.mutation({
            query:body=>({
                url:'/advertisement/create',
                method:"POST",
                body
            }),
            invalidatesTags:["Advertisement"]
        }),
        updateAdvertisement: build.mutation({
            query:body=>({
                url:'/advertisement/redact',
                method:"PUT",
                body
            }),
            invalidatesTags:["Advertisement"]
        }),
        deleteAdvertisement: build.mutation({
            query:body=>({
                url:'/advertisement/delete',
                method:'DELETE',
                body
            }),
            invalidatesTags:["Advertisement"]
        }),

    })
})

export const {useFetchAllAdvertisementQuery, useCreateAdvertisementMutation,useUpdateAdvertisementMutation, useDeleteAdvertisementMutation} = advertisementApiSlice