import {apiSlice} from "../apiSlice";

export const channelApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllChannel: build.query({
            query: () => '/channel/findAll',
            providesTags:["Channel"]
        }),
        createChannel: build.mutation({
            query:body=>({
                url:'/channel/create',
                method:"POST",
                body
            }),
            invalidatesTags:["Channel"]
        }),
        updateChannel: build.mutation({
            query:body=>({
                url:'/channel/redact',
                method:"PUT",
                body
            }),
            invalidatesTags:["Channel"]
        }),
        deleteChannel: build.mutation({
            query:body=>({
                url:'/channel/delete',
                method:'DELETE',
                body
            }),
            invalidatesTags:["Channel"]
        }),
        getByLeagueId: build.mutation({
            query:body=>({
                url:'/channel/getByLeagueId',
                method:"PUT",
                body
            }),
            invalidatesTags:["Channel"]
        }),

    })
})

export const {useFetchAllChannelQuery, useCreateChannelMutation,useUpdateChannelMutation, useDeleteChannelMutation,useGetByLeagueIdMutation} = channelApiSlice