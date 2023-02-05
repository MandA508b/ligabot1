/* eslint-disable */
import React from 'react';
import {useDispatch} from "react-redux";
import {setSelectedCity} from "../redux/city/citySlice";
import {TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";



const CityRow = ({city, isSelected}) => {
    const dispatch = useDispatch()

    const handleSelectCity = (id) => {
        dispatch(setSelectedCity(id))
    }
    return (
        <TableRow>
            <TableCell> <Checkbox checked={isSelected} onClick={()=>handleSelectCity(city._id)}/></TableCell>
            <TableCell align="center">{city.name}</TableCell>
            <TableCell align="center">{city.status ? "Опублікований" : 'Не Опублікований'}</TableCell>
        </TableRow>
    );
};

export default CityRow;