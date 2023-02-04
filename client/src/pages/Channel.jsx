import React, {useEffect, useState} from 'react';
import {
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useFetchAllChannelQuery,
    useUpdateChannelMutation
} from "../redux/channel/channelApiSlice";
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
    selectCurrentChannel,
    selectedChannelId,
    setAllSelectedChannel,
    setChannel
} from "../redux/channel/channelSlice";
import Checkbox from "@mui/material/Checkbox";
import ChannelRow from "../components/ChannelRow";
import {useFetchAllTrueLeaguesQuery} from "../redux/leagues/leaguesApiSlice";
import {selectCurrentLeagues, setLeagues} from "../redux/leagues/leaguesSlice";

function refreshPage() {
    window.location.reload(false);
}

const Channel = () => {
    const [channelId, setChannelId] = useState("")
    const [url,setUrl] = useState('')
    const [number, setNumber] = useState(1)
    const {data: leaguesData, isSuccess: isLeaguesSuccess, isLoading: isLeaguesLoading} = useFetchAllTrueLeaguesQuery()
    const [leagues,setLeagues] = useState([])
    const [leagueId, setLeagueId] = useState('')
    useEffect(() => {
        if (isLeaguesSuccess) {
            setLeagues(leaguesData.leagues)
        }
    })
    const {data, isSuccess, isLoading} = useFetchAllChannelQuery()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setChannel(data.channels))
        }
    }, [data])
    const channels = useSelector(selectCurrentChannel)
    const selectedChannel = useSelector(selectedChannelId)
    const selectAllChannel = () => dispatch(setAllSelectedChannel())


    const [updateChannel] = useUpdateChannelMutation()
    const [deleteChannel] = useDeleteChannelMutation()
    const [createChannel] = useCreateChannelMutation()

    const handleDelete = async () => {
        selectedChannel.forEach(async id => {
            const channel = channels.find(channel => channel._id === id)
            console.log({channelId: channel._id})
            await deleteChannel({channelId: channel._id}).unwrap()
        })
    }
    const handleChangeLeague = async (e) => {
        selectedChannel.forEach(async id => {
            const channel = channels.find(channel => channel._id === id)
            console.log({channelId: channel._id, data: {...channel, leagueId: e.target.value}})
            const res = await updateChannel({channelId: channel._id, data: {...channel, leagueId: e.target.value}})
            refreshPage()
            console.log(res)
        })
    }
    const handleCreate = async () => {
        console.log({URL: url, channelId, number, leagueId})
        if (!!url.length && !!channelId.length  && !!leagueId.length) {
            await createChannel({URL: url, channelId, number, leagueId})
            console.log(true)
        }
    }


    if (!isSuccess || isLoading || isLeaguesLoading || !isLeaguesSuccess)
        return <Typography textAlign={'center'}>Loading</Typography>

    return (
        <Stack sx={{width: '100vw', height: '100vh'}} display={'flex'} alignItems={'center'} padding={2}>
            {
                !selectedChannel.length ? null :
                    <Stack display={'flex'} alignItems={'flex-end'} flexDirection={'row'}
                           justifyContent={'space-between'}>
                        <ListItem>
                            <Button sx={{height: 54}} color={'error'} variant={'contained'}
                                    onClick={handleDelete}>Delete</Button>
                        </ListItem>
                        <ListItem>
                            <Stack>
                                <Typography fontSize={10} color={'grey'}>Select New League</Typography>
                                <Select sx={{width: "120px"}} onChange={handleChangeLeague} defaultValue={''}>
                                    {
                                        leagues?.map(league =>
                                            <MenuItem key={league._id} value={league._id}>{league.name}</MenuItem>
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
                <Table sx={{minWidth: 150}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Checkbox checked={selectedChannel?.length === channels?.length}
                                                  onClick={() => selectAllChannel()}/></TableCell>
                            <TableCell align="center">Channel ID</TableCell>
                            <TableCell align="center">Number</TableCell>
                            <TableCell align="center">League</TableCell>
                            <TableCell align="center">URL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            channels.map(channel => <ChannelRow channel={channel}
                                                              isSelected={selectedChannel.includes(channel._id)}
                                                              key={channel?._id}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack display={'flex'} gap={1} flexDirection={'row'} margin={1} alignItems={'flex-end'}>
                <ListItem>
                    <Stack>
                        <Typography fontSize={10} color={'grey'}>Select New League</Typography>
                        <Select sx={{width: "120px"}} onChange={e=> setLeagueId(e.target.value)} defaultValue={''}>
                            {
                                leagues?.map(league =>
                                    <MenuItem key={league._id} value={league._id}>{league.name}</MenuItem>
                                )
                            }
                        </Select>

                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack>
                        <Typography fontSize={10} color={'grey'}>Channel URL</Typography>
                        <TextField sx={{width: 140}} value={url} onChange={e => setUrl(e.target.value)}/>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack>
                        <Typography fontSize={10} color={'grey'}>Channel ID</Typography>
                        <TextField sx={{width: 140}} value={channelId} onChange={e => setChannelId(e.target.value)}/>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack>
                        <Typography fontSize={10} color={'grey'}>Number</Typography>
                        <TextField type={'number'} sx={{width: 140}} value={number} onChange={e => setNumber(e.target.value)}/>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Button variant={'contained'} onClick={handleCreate} height={'80%'}>
                        Create
                    </Button>
                </ListItem>

            </Stack>
        </Stack>
    );
};

export default Channel;