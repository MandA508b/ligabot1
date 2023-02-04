import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {setSelectedLeague} from "../redux/leagues/leaguesSlice";
import {useGetLeagueByIdMutation} from "../redux/leagues/leaguesApiSlice";
import {useFindTeamsByLeagueIdMutation} from "../redux/teams/teamsApiSlice";
import {useGetByLeagueIdMutation} from "../redux/channel/channelApiSlice";

const LeagueRow = ({league, isSelected}) => {
    const dispatch = useDispatch()
    const handleSelectLeague = (id) => dispatch(setSelectedLeague(id))
    const [findTeamsByLeagueId] = useFindTeamsByLeagueIdMutation()
    const [getByLeagueId] = useGetByLeagueIdMutation()
    const [teams, setTeams] = useState('')
    const [channelId,setChannelId] = useState('')
    useEffect(() => {
        const getTeams = async () => {
            let teams = ''
            const res = await findTeamsByLeagueId({leagueId: league._id})
            res.data.teams.forEach((team, i) => teams += i ? ', ' + team.name : '' + team.name)
            setTeams(teams)
        }

        getTeams()

    }, [])
    return (
        <TableRow>
            <TableCell> <Checkbox checked={isSelected} onClick={() => handleSelectLeague(league._id)}/></TableCell>
            <TableCell align="center">{league.name}</TableCell>
            <TableCell align="center">{league.level}</TableCell>
            <TableCell align="center">{league.status ? "Опублікований" : 'Не Опублікований'}</TableCell>
            <TableCell align="center">{teams}</TableCell>
        </TableRow>
    );
};

export default LeagueRow;