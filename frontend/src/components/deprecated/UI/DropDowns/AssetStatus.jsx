import React, { useState, useEffect } from "react";
import { Axios } from '@/utils/Axios';
import { Autocomplete, TextField } from "@mui/material";

export default function AssetStatus({ token, handleChange, value }) {
    const [assetStatus, setAssetStatus] = useState(value);
    const [assetStatusList, setAssetStatusList] = useState([]);

    /**
     *  Fetch all users with the role technician (1) from the database and store it on technicianList state
     */
    const getAssetStatus = async () => {
        try {
            const response = await Axios({
                method: "GET",
                url: `/api/assetStatusData/`,

            });

            const data = await response.data;
            setAssetStatusList(data.filter(data => data.name !== "Decommissioned"));
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }
    }

    // Handles the Changing of State
    const handleTicketChange = (_, newValue) => {
        setAssetStatus(newValue);
        handleChange({ status: newValue ? newValue.asset_status_id : null });
    };

    // Render Value
    useEffect(() => {
        setAssetStatus(value);
    }, [value]);

    // Render Dropdown
    useEffect(() => {
        getAssetStatus();
    }, []);

    return (
        <>
            <Autocomplete
                name="assetStatus"
                id="grouped-ticketType"
                options={assetStatusList}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => `${option.name}`}
                noOptionsText={"No Results Found"}
                // Might want to copy over and alter the renderOrder property from other autocompletes
                renderInput={(params) => (
                    <TextField required {...params} label="Status" />
                )}
                // value={technician}
                onChange={handleTicketChange}
                value={assetStatusList.find((data) => data.asset_status_id === assetStatus) || null}
            />
        </>
    );
}
