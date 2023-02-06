/* eslint-disable */
import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Outlet, useLocation} from "react-router";
import {useDispatch} from "react-redux";
import {logoutUser} from "../redux/auth/authSlice";

const pages = ["users", "teams", 'leagues','city','advertisements','channel']
const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout =()=> {
        dispatch(logoutUser())
        navigate('/login')
    }
    const location = useLocation()

    return (
        <>
            <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}
                   justifyContent={"center"} gap={10} width={'100vw'}>
                {
                    pages.map(page =>
                        <Link to={`/${page}`} key={page}>
                            <Typography fontSize={22} textTransform={'capitalize'}
                                        sx={{textDecoration: location.pathname === '/' + page ? "underline" : 'none'}}>
                                {page==='advertisements' ? 'posts' : page}
                            </Typography></Link>
                    )
                }
                <Button onClick={handleLogout}>Вийти</Button>


            </Stack>
            <Outlet/>
        </>

    );
};

export default Layout;