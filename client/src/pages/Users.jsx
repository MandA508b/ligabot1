import {
    ListItem, Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography, MenuItem
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {getSelectedUsers, selectCurrentUsers, setAllSelectedUsers, setAllUsers} from "../redux/users/usersSlice";
import Checkbox from '@mui/material/Checkbox';
import UserRow from "../components/UserRow";
import {useFetchAllUsersQuery, useUpdateUsersMutation} from "../redux/users/usersApiSlice";
import React, {useEffect, useState} from "react";
import {useFetchAllTrueTeamsQuery} from "../redux/teams/teamsApiSlice";
import {selectCurrentTeams, setTeams} from "../redux/teams/teamsSlice";
import {selectCurrentLeagues, setLeagues} from "../redux/leagues/leaguesSlice";
import {useFetchAllLeaguesQuery} from "../redux/leagues/leaguesApiSlice";
function refreshPage() {
    window.location.reload(false);
}
function Users() {


    const {data:teamData, isSuccess:isTeamSuccess, isLoading:isTeamLoading} = useFetchAllTrueTeamsQuery()
    const [teams, setTeams] = useState([])
    const leagues = useSelector(selectCurrentLeagues)

    useEffect(() => {
        if (isTeamSuccess) {
            setTeams(teamData.teams)
            console.log(teamData.teams)
        }

    }, [teamData])
    const {data, isLoading, isSuccess} = useFetchAllUsersQuery()
    const [updateUsers] = useUpdateUsersMutation()
    useEffect(() => {
        if (isSuccess) {
            dispatch(setAllUsers(data))
            console.log(data)
            users.forEach(i => console.log(i._id))
        }
    }, [data])
    const dispatch = useDispatch()
    const users = useSelector(selectCurrentUsers)
    const selectedUsers = useSelector(getSelectedUsers)
    const selectAllUsers = () => dispatch(setAllSelectedUsers())
    const handlePublish = async (status) => {
        let userData = []
        selectedUsers.forEach(id => {
            const user = users.find(user => user._id === id)
            userData.push({userId: user._id, updateData: {...user, status}})
        })
        await updateUsers({userData})
        console.log(userData)
    }
    const handleChangeRole = async (role) => {
        let userData = []
        selectedUsers.forEach(id => {
            const user = users.find(user => user._id === id)
            userData.push({userId: user._id, updateData: {...user, role}})
        })
        await updateUsers({userData})
        console.log(userData)
    }
    const handleChangeTeam =async (e) =>{
        let userData = []
        selectedUsers.forEach(id => {
            const user = users.find(user => user._id === id)
            userData.push({userId: user._id, updateData: {...user, teamId:e.target.value}})
        })
        await updateUsers({userData})
        refreshPage()
    }
   
    const handleBlock = async (e) => {
        let userData = []
        selectedUsers.forEach(id => {
            const user = users.find(user => user._id === id)
            userData.push({userId: user._id, updateData: {...user, isBlocked:e.target.value}})
        })
        await updateUsers({userData})
    }
    if (!isSuccess || isLoading) return <Typography textAlign={'center'}>Loading</Typography>
    return (
        <Stack style={{height: '100vh', width: '100vw'}} display={'flex'} alignItems={'center'} padding={2}>
            {
                !selectedUsers.length  && teams?.length ? null :
                    <Stack display={'flex'} alignItems={'center'} flexDirection={'row'}>
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Block User</Typography>
                                <Select sx={{width: '200px'}} defaultValue={''}
                                        onChange={handleBlock}>
                                    <MenuItem value={false}>
                                        Розблокувати
                                    </MenuItem>
                                    <MenuItem value={true}>
                                        Заблокувати
                                    </MenuItem>
                                </Select>
                            </Stack>


                        </ListItem>
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Status</Typography>
                                <Select defaultValue={false} sx={{width: '200px'}}
                                        onChange={(e) => handlePublish(e.target.value)}>
                                    <MenuItem value={false}>
                                        Не Опублікований
                                    </MenuItem>
                                    <MenuItem value={true}>
                                        Опублікований
                                    </MenuItem>
                                </Select>
                            </Stack>


                        </ListItem>
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Role</Typography>
                                <Select defaultValue={'User'} sx={{width: '150px'}}
                                        onChange={(e) => handleChangeRole(e.target.value)}>
                                    <MenuItem value={'Admin'}>
                                        Адмін
                                    </MenuItem>
                                    <MenuItem value={'User'}>
                                        Користувач
                                    </MenuItem>
                                </Select>
                            </Stack>

                        </ListItem>
                        
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Select New Team</Typography>
                                <Select sx={{width:"120px"}}
                                        onChange={e=>handleChangeTeam(e)}>
                                    {
                                        teams?.map(team=>
                                            <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
                                        )
                                    }
                                </Select>

                            </Stack>
                        </ListItem>
                    </Stack>
            }

            <TableContainer sx={{
                maxWidth: 992,
                borderRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;'
            }}>
                <Table sx={{minWidth: 650}} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell> <Checkbox checked={selectedUsers.length === users.length}
                                                  onClick={() => selectAllUsers()}/></TableCell>
                            <TableCell align="center">name</TableCell>
                            <TableCell align="center">NickName</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">Team</TableCell>
                            <TableCell align="center">League</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {
                            users.map(user => <UserRow data={user} isSelected={selectedUsers.includes(user._id)}
                                                       key={user?.username}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}

export default Users;
