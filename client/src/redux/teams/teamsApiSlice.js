import {apiSlice} from "../apiSlice";

export const teamsApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllTeams: build.query({
            query: () => '/teams/findAll',
            providesTags:["Teams"]
        }),
        fetchAllTrueTeams: build.query({
            query: () => '/teams/findAllStatusTrue',
            providesTags:["Teams"]
        }),
        createTeam: build.mutation({
            query:body=>({
                url:'/teams/create',
                method:"POST",
                body
            }),
            invalidatesTags:["Teams"]
        }),
        updateTeam: build.mutation({
            query:body=>({
                url:'/teams/redact',
                method:"PUT",
                body
            }),
            invalidatesTags:["Teams"]
        }),
        deleteTeam: build.mutation({
            query:body=>({
                url:'/teams/delete',
                method:'DELETE',
                body
            }),
            invalidatesTags:["Teams"]
        }),
        findTeamsByLeagueId: build.mutation({
            query:body=>({
                url:'/teams/findTeamsByLeagueId',
                method:"POST",
                body
            })
        }),
        findTeamById:build.mutation({
            query: body=> ({
                url:'/teams/findTeamById',
                method:'POST',
                body
            })
        })
    })
})

export const {useFetchAllTeamsQuery ,useFetchAllTrueTeamsQuery, useCreateTeamMutation,useUpdateTeamMutation, useDeleteTeamMutation, useFindTeamsByLeagueIdMutation, useFindTeamByIdMutation} = teamsApiSlice