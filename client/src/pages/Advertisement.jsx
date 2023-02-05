/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
    useCreateAdvertisementMutation,
    useDeleteAdvertisementMutation,
    useFetchAllAdvertisementQuery,
    useUpdateAdvertisementMutation
} from "../redux/advertisement/advertisementApiSlice";
import {
    Button,
    ListItem, MenuItem, Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextareaAutosize, TextField, Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    selectCurrentAdvertisement,
    selectedAdvertisementId,
    setAllSelectedAdvertisement,
    setAdvertisement
} from "../redux/advertisement/advertisementSlice";
import Checkbox from "@mui/material/Checkbox";
import AdvertisementRow from "../components/AdvertisementRow";

function refreshPage() {
    window.location.reload(false);
}

const Advertisement = () => {
    const [extraInfo, setExtraInfo] = useState("")


    const {data, isSuccess, isLoading} = useFetchAllAdvertisementQuery()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            console.log(data)
            dispatch(setAdvertisement(data.cities))
        }
    }, [data])
    const advertisements = useSelector(selectCurrentAdvertisement)

    const selectedAdvertisement = useSelector(selectedAdvertisementId)
    const selectAllAdvertisement = () => dispatch(setAllSelectedAdvertisement())


    const [updateAdvertisement] = useUpdateAdvertisementMutation()
    const [deleteAdvertisement] = useDeleteAdvertisementMutation()
    const handleChangeTextarea = async (e) => {
        selectedAdvertisement.forEach(async id => {
            const advertisement = advertisements.find(advertisement => advertisement._id === id)
            await updateAdvertisement({advertisementId: advertisement._id, data: {...advertisement, extraInfo}}).unwrap()
        })
    }
    const handleDeleteAdvertisement = async ()=>{
        selectedAdvertisement.forEach(async id => {
            const advertisementId = advertisements.find(advertisement => advertisement._id === id)?._id
            await deleteAdvertisement({advertisementId}).unwrap()
        })
    }


    if (!isSuccess || isLoading) {
        console.log(advertisements)
        return <Typography textAlign={'center'}>Loading</Typography>
    }

    return (
        <Stack sx={{width: '100vw', height: '100vh'}} display={'flex'} alignItems={'center'} padding={2} gap={2}>
            {
                !selectedAdvertisement.length ? null :
                    <Stack display={'flex'} alignItems={'flex-end'} flexDirection={'row'}
                           justifyContent={'space-between'}  gap={1} width={'70vw'} >

                        <Button color={'error'} variant={'contained'} sx={{cursor:'pointer',height:'80%'}} onClick={handleDeleteAdvertisement}>Delete</Button>
                        <Stack display={'flex'} alignItems={'center'} flexDirection={'row'}></Stack>
                        <Stack width={'100%'}>
                            <Typography fontSize={10} color={'grey'}>Extra Info</Typography>
                            <TextField onChange={e=>setExtraInfo(e.target.value)} value={extraInfo} sx={{background:"#f5f5f5"}} multiline rows={2} fullWidth />
                        </Stack>
                        <Button onClick={handleChangeTextarea} variant={'contained'} sx={{height:'80%'}}>{`Change Extra Info`}</Button>
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
                            <TableCell> <Checkbox checked={selectedAdvertisement?.length === advertisements?.length}
                                                  onClick={() => selectAllAdvertisement()}/></TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Amount</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Part</TableCell>
                            <TableCell align="center">Rate</TableCell>
                            <TableCell align="center">Extra Info</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {
                            advertisements?.map(advertisement => <AdvertisementRow advertisement={advertisement} isSelected={selectedAdvertisement.includes(advertisement._id)}
                                                        key={advertisement?._id}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default Advertisement;