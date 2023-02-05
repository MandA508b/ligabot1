/* eslint-disable */
import React from 'react';
import {useDispatch} from "react-redux";
import {setSelectedAdvertisement} from "../redux/advertisement/advertisementSlice";
import {TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";



const AdvertisementRow = ({advertisement, isSelected}) => {
    const dispatch = useDispatch()

    const handleSelectAdvertisement = (id) => {
        dispatch(setSelectedAdvertisement(id))
    }
    return (
        <TableRow>
            <TableCell> <Checkbox checked={isSelected} onClick={()=>handleSelectAdvertisement(advertisement._id)}/></TableCell>
            <TableCell align="center">{advertisement.userId}</TableCell>
            <TableCell align="center">{advertisement.status ? "Опублікований" : 'Не Опублікований'}</TableCell>
            <TableCell align="center">{advertisement.type.toUpperCase()}</TableCell>
            <TableCell align="center">{advertisement.total}$</TableCell>
            <TableCell align="center">{advertisement.date.split('.')[0].replace("T"," ")}</TableCell>
            <TableCell align="center">{advertisement.part}</TableCell>
            <TableCell align="center">{advertisement.rate}%</TableCell>
            <TableCell align="center">{advertisement.extraInfo}</TableCell>
        </TableRow>
    );
};

export default AdvertisementRow;