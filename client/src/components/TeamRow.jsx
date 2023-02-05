/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {setSelectedTeam} from "../redux/teams/teamsSlice";
import {useGetLeagueByIdMutation} from "../redux/leagues/leaguesApiSlice";

const TeamRow = ({team, isSelected}) => {
    const dispatch = useDispatch()
    const handleSelectTeam = (id) => dispatch(setSelectedTeam(id))
    const [name, setName] = useState('')

    const [getLeagueById] = useGetLeagueByIdMutation()

    useEffect(()=>{
        const getName = async () =>{
            const leagueName = await getLeagueById({leagueId:team.leagueId})
            setName(leagueName.data.league.name)
            console.log(leagueName)
        }
        getName()
    },[])
    return (
        <TableRow>
            <TableCell> <Checkbox checked={isSelected} onClick={()=>handleSelectTeam(team._id)}/></TableCell>
            <TableCell align="center">{team.name}</TableCell>
            <TableCell align="center">{name}</TableCell>
            <TableCell align="center">{team.status ? "Опублікований" : 'Не Опублікований'}</TableCell>
        </TableRow>
    );
};

export default TeamRow;