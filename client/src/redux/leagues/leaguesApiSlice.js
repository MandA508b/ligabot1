import {apiSlice} from "../apiSlice";

export const leaguesApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllLeagues: build.query({
            query: () => '/leagues/findAll',
            providesTags:["Leagues"]
        }),
        createLeague: build.mutation({
            query:body=>({
                url:'/leagues/create',
                method:"POST",
                body
            }),
            invalidatesTags:["Leagues"]
        }),
        updateLeague: build.mutation({
            query:body=>({
                url:'/leagues/redact',
                method:"PUT",
                body
            }),
            invalidatesTags:["Leagues"]
        }),
        deleteLeague: build.mutation({
            query:body=>({
                url:'/leagues/delete',
                method:'DELETE',
                body
            }),
            invalidatesTags:["Leagues"]
        }),
        getLeagueById: build.mutation({
            query:body=>({
                url:'/leagues/getLeagueById',
                method:"POST",
                body
            })
        })
    })
})

export const {useFetchAllLeaguesQuery, useCreateLeagueMutation,useUpdateLeagueMutation, useDeleteLeagueMutation,useGetLeagueByIdMutation} = leaguesApiSlice