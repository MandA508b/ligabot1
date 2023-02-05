/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
    useCreateCityMutation,
    useDeleteCityMutation,
    useFetchAllCityQuery,
    useUpdateCityMutation
} from "../redux/city/cityApiSlice";
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
    selectCurrentCity,
    selectedCityId,
    setAllSelectedCity,
    setCity
} from "../redux/city/citySlice";
import Checkbox from "@mui/material/Checkbox";
import CityRow from "../components/CityRow";

function refreshPage() {
    window.location.reload(false);
}

const City = () => {
    const [name, setName] = useState("")
    const [newName, setNewName] = useState("")


    const {data, isSuccess, isLoading} = useFetchAllCityQuery()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            console.log(data)
            dispatch(setCity(data.cities))
        }
    }, [data])
    const cities = useSelector(selectCurrentCity)
    const selectedCity = useSelector(selectedCityId)
    const selectAllCity = () => dispatch(setAllSelectedCity())


    const [updateCity] = useUpdateCityMutation()
    const [deleteCity] = useDeleteCityMutation()
    const [createCity] = useCreateCityMutation()
    const handlePublish = async (status) => {
        selectedCity.forEach(async id => {
            const city = cities.find(city => city._id === id)
            await updateCity({cityId: city._id, data: {...city, status}}).unwrap()
        })
    }
    const handleDelete = async () => {
        selectedCity.forEach(async id => {
            const city = cities.find(city => city._id === id)
            console.log({cityId: city._id})
            await deleteCity({cityId: city._id}).unwrap()
        })
    }
    const handleCreate = async () => {
        console.log(name)
        if (!!name.length) await createCity({name})
    }
    const handleRename = async () => {
        if (!!newName.length) {
            console.log(selectedCity)
            selectedCity.forEach(async id => {
                const city = cities.find(city => city._id === id)
                console.log({cityId: city._id, data: {...city, name: newName}})
                const res = await updateCity({cityId: city._id, data: {...city, name: newName}}).unwrap()
                console.log(res)
            })
        }
    }

    if (!isSuccess || isLoading) return <Typography
        textAlign={'center'}>Loading</Typography>

    return (
        <Stack sx={{width: '100vw', height: '100vh'}} display={'flex'} alignItems={'center'} padding={2}>
            {
                !selectedCity.length ? null :
                    <Stack display={'flex'} alignItems={'flex-end'} flexDirection={'row'}
                           justifyContent={'space-between'}>


                        <ListItem>
                            <Stack>
                            <Typography fontSize={10} color={'grey'}>Status</Typography>
                            <Select defaultValue={''} sx={{width: '200px'}}
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
                            <TableCell> <Checkbox checked={selectedCity?.length === cities?.length}
                                                  onClick={() => selectAllCity()}/></TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {
                            cities.map(city => <CityRow city={city} isSelected={selectedCity.includes(city._id)}
                                                        key={city?.name}/>)

                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack display={'flex'} gap={1} flexDirection={'row'} margin={1} alignItems={'flex-end'}>
                <TextField label={'Name'} onChange={e => setName(e.target.value)}/>


                <Button sx={{height: '78%'}} variant={'contained'} onClick={handleCreate}>Create</Button>
            </Stack>
        </Stack>
    );
};

export default City;