import {apiSlice} from "../apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: build => ({

        fetchAllUsers: build.query({
            query: () => '/user/getAllUsers',
            providesTags:["Users"]
        }),
        updateUsers: build.mutation({
            query: body => ({
                url: '/user/updateUsers',
                method:"PUT",
                body
            }),
            invalidatesTags:["Users"]
    })
})
})

export const {useFetchAllUsersQuery, useUpdateUsersMutation} = usersApiSlice