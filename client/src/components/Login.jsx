import React, {useState} from 'react';
import {Button, Stack, TextField, Typography} from "@mui/material";
import {useLoginMutation, useRegistrationMutation} from "../redux/auth/authApiSlice";
import {useDispatch} from "react-redux";
import {setCredentials} from "../redux/auth/authSlice";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch()
    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const [registration] = useRegistrationMutation()
    const [handleLogin] = useLoginMutation()
    const navigate = useNavigate()
    const handleSubmitLogin = async () => {
        if (login.length && pass.length) {
            try {
                const data = await handleLogin({login, password: pass}).unwrap()
                dispatch(setCredentials(data))


                navigate('/users')
            } catch (e) {
                console.log(e)
                alert('Сталась помилка(')
            }
        }
    }
    const handleSubmitRegistration = async () => {
        if (login.length && pass.length) {
            try {
                const data = await registration({login, password: pass})
                dispatch(setCredentials(data))
                alert('Ви успішно зареєстровані! Ввійдіть у свій аккаут.')
            } catch (e) {
                console.log(e)
                alert('Сталась помилка(')
            }
        }

    }
    return (
        <Stack margin={'100px auto'} padding={2} gap={1} display="flex" width={'fit-content'} flexDirection='row'
               alignItems='center' bgcolor="#fff"
               borderRadius={2}>
            <TextField size='small' value={login} label="Login" onChange={e => setLogin(e.target.value)}/>
            <TextField size='small' value={pass} label='Password' onChange={e => setPass(e.target.value)}/>
            <Button color='success' variant='contained' onClick={handleSubmitLogin}>
                Вхід
            </Button>
            <Button color='success' variant='contained' onClick={handleSubmitRegistration}>
                Реєстрація
            </Button>
        </Stack>
    );
};

export default Login;