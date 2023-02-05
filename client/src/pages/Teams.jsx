/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
    useCreateTeamMutation,
    useDeleteTeamMutation,
    useFetchAllTeamsQuery,
    useUpdateTeamMutation
} from "../redux/teams/teamsApiSlice";
import {
    Button,
    ListItem, MenuItem, Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    selectCurrentTeams,
    selectedTeamsId,
    setAllSelectedTeams,
    setTeams
} from "../redux/teams/teamsSlice";
import Checkbox from "@mui/material/Checkbox";
import TeamRow from "../components/TeamRow";
import {useFetchAllTrueLeaguesQuery} from "../redux/leagues/leaguesApiSlice";
import {selectCurrentLeagues, setLeagues} from "../redux/leagues/leaguesSlice";

function refreshPage() {
    window.location.reload(false);
}

const Teams = () => {
    const [name, setName] = useState("")
    const [newName, setNewName] = useState("")


    const {data, isSuccess, isLoading} = useFetchAllTeamsQuery()
    const {data: leaguesData, isSuccess: isLeaguesSuccess, isLoading: isLeaguesLoading} = useFetchAllTrueLeaguesQuery()
    const dispatch = useDispatch()
    const teams = useSelector(selectCurrentTeams)
    const selectedTeams = useSelector(selectedTeamsId)
    const [leagues,setLeagues] = useState([])
    const [leagueId, setLeagueId] = useState('')
    const selectAllTeams = () => dispatch(setAllSelectedTeams())
    useEffect(() => {
        if (isSuccess) {
            dispatch(setTeams(data.teams))
            setLeagueId(data.teams[0]?._id || 'none')
        }

    }, [data])
    useEffect(() => {
        if (isLeaguesSuccess) {
            setLeagues(leaguesData.leagues)
            console.log(leaguesData.leagues)
        }
    })
    const [updateTeam] = useUpdateTeamMutation()
    const [deleteTeam] = useDeleteTeamMutation()
    const [createTeam] = useCreateTeamMutation()
    const handlePublish = async (status) => {
        selectedTeams.forEach(async id => {
            const team = teams.find(team => team._id === id)
            await updateTeam({teamId: team._id, data: {...team, status}}).unwrap()
        })
    }
    const handleDelete = async () => {
        selectedTeams.forEach(async id => {
            const team = teams.find(team => team._id === id)
            await deleteTeam({teamId: team._id}).unwrap()
        })
    }
    const handleCreate = async () => {
        console.log(leagueId, name)
        if (!!name.length || !!leagueId.length) await createTeam({name, leagueId})
    }
    const handleChangeLeague = async (e) => {
        selectedTeams.forEach(async id => {
            const team = teams.find(team => team._id === id)
            await updateTeam({teamId: team._id, data: {...team, leagueId: e.target.value}})
            refreshPage()
        })
    }
    const handleRename = async () => {
        if (!!newName.length) {
            selectedTeams.forEach(async id => {
                const team = teams.find(teams => teams._id === id)
                const res = await updateTeam({teamId: team._id, data: {...team, name: newName}}).unwrap()
                console.log(res)
            })
        }
    }

    if (!isSuccess || isLoading || !isLeaguesSuccess || isLeaguesLoading) return <Typography
        textAlign={'center'}>Loading</Typography>

    return (
        <Stack sx={{width: '100vw', height: '100vh'}} display={'flex'} alignItems={'center'} padding={2}>
            {
                !selectedTeams.length ? null :
                    <Stack display={'flex'} alignItems={'flex-end'} flexDirection={'row'}
                           justifyContent={'space-between'}>
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Select New League</Typography>
                                <Select sx={{width: "120px"}}
                                        onChange={e => handleChangeLeague(e)}>
                                    {
                                        leagues?.map(league =>
                                            <MenuItem key={league._id} value={league._id}>{league.name}</MenuItem>
                                        )
                                    }
                                </Select>

                            </Stack>
                        </ListItem>

                        <ListItem>
                            <Select defaultValue={''} sx={{width: '200px'}}
                                    onChange={(e) => handlePublish(e.target.value)}>
                                <MenuItem value={false}>
                                    Не Опублікований
                                </MenuItem>
                                <MenuItem value={true}>
                                    Опублікований
                                </MenuItem>
                            </Select>
                        </ListItem>
                        <ListItem>
                            <Stack display={'flex'} flexDirection={'row'} gap={1}>
                                <TextField sx={{width: 140}} value={newName} onChange={e => setNewName(e.target.value)}
                                           label='New Name'/>
                                <Button variant={'contained'} onClick={handleRename}>Rename</Button>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Button sx={{height: 54}} color={'error'} variant={'contained'}
                                    onClick={handleDelete}>Delete</Button>
                        </ListItem>


                    </Stack>
            }
            <TableContainer sx={{
                maxWidth: 992,
                borderRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;'
            }}>
                <Table sx={{minWidth: 150}} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell> <Checkbox checked={selectedTeams?.length === teams?.length}
                                                  onClick={() => selectAllTeams()}/></TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">League</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {

                            teams.map(team => <TeamRow team={team} isSelected={selectedTeams.includes(team._id)}
                                                       key={team?.name}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack display={'flex'} gap={1} flexDirection={'row'} margin={1} alignItems={'flex-end'}>
                <TextField label={'Name'} onChange={e => setName(e.target.value)}/>
                <Stack>
                    <Typography fontSize={10} color={'grey'}>Select League</Typography>
                    <Select sx={{width: "120px"}} defaultValue={leagueId} value={leagueId}
                            onChange={e => setLeagueId(e.target.value)}>
                        {
                            leagues?.map(league =>
                                <MenuItem key={league._id} value={league._id}>{league.name}</MenuItem>
                            )
                        }
                    </Select>

                </Stack>

                <Button sx={{height: '78%'}} variant={'contained'} onClick={handleCreate}>Create</Button>
            </Stack>
        </Stack>
    );
};

export default Teams;