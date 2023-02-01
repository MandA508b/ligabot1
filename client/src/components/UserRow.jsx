import React, {useEffect, useState} from 'react';
import {TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {useDispatch} from "react-redux";
import {setSelectedUser} from "../redux/users/usersSlice";
import {useFindTeamByIdMutation} from "../redux/teams/teamsApiSlice";
import {useGetLeagueByIdMutation} from "../redux/leagues/leaguesApiSlice";

const UserRow = ({data, isSelected}) => {
    const dispatch = useDispatch()
    const handleSelectUser = (id) => dispatch(setSelectedUser(id))
    const [team, setTeam] = useState('-')
    const [league, setLeague] = useState('-')
    const [findTeamById] = useFindTeamByIdMutation()
    const [findLeagueById] = useGetLeagueByIdMutation()
    useEffect(()=>{
        const getTeam = async ()=>{
            if(data.teamId!=='0'){
                console.log(data.teamId)
                const res = await findTeamById({id:data.teamId})
                setTeam(res.data.teams.name)
                console.log(res)
            }

        }
        const getLeague = async ()=>{
            console.log(data.leagueId)
            if(data.leagueId!=='0'){
                console.log(data.teamId)
                const res = await findLeagueById({leagueId:data.leagueId})
                setLeague(res.data.league.name)
                console.log(res.data)
            }

        }
        getLeague()
        getTeam()
    },[])
    return (
        <TableRow sx={{background: data.isBlocked ? 'grey':'inherit'}}>
            <TableCell> <Checkbox checked={isSelected} onClick={()=>handleSelectUser(data._id)}/></TableCell>
            <TableCell align="center">{data.name}</TableCell>
            <TableCell align="center">{data.username}</TableCell>
            <TableCell align="center">{data.registrationDate?.split(".")[0].replace("T",' ')}</TableCell>
            <TableCell align="center">{data.status ? "Опублікований" : 'Не Опублікований'}</TableCell>
            <TableCell align="center">{data.role}</TableCell>
            <TableCell align="center">{team}</TableCell>
            <TableCell align="center">{league}</TableCell>
        </TableRow>
    );
};

export default UserRow;