import {apiSlice} from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: build=>({
        login: build.mutation({
            query: credentials=>({
                url:'/admin/login',
                method:'POST',
                body:{...credentials}
            })
        }),
        registration: build.mutation({
            query: credentials=>({
                url: "/admin/registration",
                method:"POST",
                body:{...credentials}
            }),
            invalidatesTags:['User']
        }),
        logout: build.mutation({
            query:()=> ({
                url:'/admin/logout',
                method:'POST'
            })
        })
    })
})

export const {useLoginMutation, useLogoutMutation, useRegistrationMutation} = authApiSlice