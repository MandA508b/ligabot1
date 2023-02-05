/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
    useCreateLeagueMutation,
    useDeleteLeagueMutation,
    useFetchAllLeaguesQuery,
    useUpdateLeagueMutation
} from "../redux/leagues/leaguesApiSlice";
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
    selectCurrentLeagues,
    selectedLeaguesId,
    setAllSelectedLeagues,
    setLeagues
} from "../redux/leagues/leaguesSlice";
import Checkbox from "@mui/material/Checkbox";
import LeagueRow from "../components/LeagueRow";

const Leagues = () => {
    const [name, setName] = useState("")
    const [level, setLevel] = useState("")
    const [newLevel, setNewLevel] = useState("")
    const [newName, setNewName] = useState('')
    const {data, isSuccess, isLoading} = useFetchAllLeaguesQuery()
    const dispatch = useDispatch()
    const leagues = useSelector(selectCurrentLeagues)
    const selectedLeagues = useSelector(selectedLeaguesId)
    const selectAllLeagues = () => dispatch(setAllSelectedLeagues())
    useEffect(() => {
        if (isSuccess) {
            console.log(data)
            dispatch(setLeagues(data.leagues))
            console.log(data.leagues)
        }

    }, [data])
    const [updateLeague] = useUpdateLeagueMutation()
    const [deleteLeague] = useDeleteLeagueMutation()
    const [createLeague] = useCreateLeagueMutation()
    const handlePublish = async (status) => {
        selectedLeagues.forEach(async id => {
            const league = leagues.find(league => league._id === id)
            const res = await updateLeague({leagueId: league._id, data: {...league, status}}).unwrap()
            console.log(res)
        })
    }
    const handleDelete = async () => {
        selectedLeagues.forEach(async id => {
            const league = leagues.find(league => league._id === id)
            const res = await deleteLeague({leagueId: league._id}).unwrap()
            console.log(res)
        })
    }
    const handleCreate = async () => {
        if (!!name.length && !!level.length) await createLeague({name, level})
    }
    const handleChangeLevel = async () => {
        if (!!newLevel.length) {
            selectedLeagues.forEach(async id => {
                const league = leagues.find(league => league._id === id)
                console.log({leagueId: league._id, data: {...league, level: newLevel}})
                const res = await updateLeague({leagueId: league._id, data: {...league, level: newLevel}}).unwrap()
                console.log(res)
            })
        }
    }

    const handleRename = async ()=>{
        if(!!newName.length){
            selectedLeagues.forEach(async id => {
                const league = leagues.find(league => league._id === id)
                const res = await updateLeague({leagueId: league._id, data: {...league, name:newName}}).unwrap()
                console.log(res)
            })
        }
    }
    if (!isSuccess || isLoading) return <Typography textAlign={'center'}>Loading</Typography>

    return (
        <Stack sx={{width: '100vw', height: '100vh'}} display={'flex'} alignItems={'center'} padding={2}>
            {
                !selectedLeagues.length ? null :
                    <Stack display={'flex'} alignItems={'center'} flexDirection={'row'} justifyContent={'space-between'} >
                        <ListItem>
                            <Select defaultValue={false} sx={{width: '200px'}}
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
                                <TextField fullWidth onChange={e => setNewLevel(e.target.value)} label={'New Level'}/>
                                <Button variant={'contained'} onClick={handleChangeLevel}>Change</Button>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Stack display={'flex'} flexDirection={'row'}  gap={1}>
                                <TextField fullWidth value={newName} onChange={e=>setNewName(e.target.value)} label='New Name'/>
                                <Button variant={'contained'} onClick={handleRename}>Rename</Button>
                            </Stack>

                        </ListItem>

                        <ListItem>
                            <Button variant={'contained'} color={'error'} onClick={handleDelete}>Delete</Button>
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
                            <TableCell> <Checkbox checked={selectedLeagues?.length === leagues?.length}
                                                  onClick={() => selectAllLeagues()}/></TableCell>
                            <TableCell variant={'head'} size={'small'} align="center">Name</TableCell>
                            <TableCell variant={'head'} size={'small'} align="center">Level</TableCell>
                            <TableCell variant={'head'} size={'small'} align="center">Status</TableCell>
                            <TableCell variant={'head'} size={'small'} align="center">Teams</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {

                            leagues.map(league => <LeagueRow league={league} isSelected={selectedLeagues.includes(league._id)}
                                                       key={league?.name}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack display={'flex'} gap={1} flexDirection={'row'} margin={1}>
                <TextField label={'Name'} onChange={e => setName(e.target.value)}/>
                <TextField label={'Level'} onChange={e => setLevel(e.target.value)}/>

                <Button variant={'contained'} onClick={handleCreate}>Create</Button>
            </Stack>
        </Stack>
    );
};

export default Leagues;