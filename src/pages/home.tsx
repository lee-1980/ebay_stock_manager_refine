import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { useState } from 'react';

import {
    PieChart
} from "components";
import {Switch} from "@mui/material";


const Home = () => {

    const [checked, setChecked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [febestCount, setFebestCount] = useState(0);
    const [autoplusCount, setAutoplusCount] = useState(0);

    React.useEffect(() => {

        fetch("http://localhost:8080/api/v1/home")
            .then(res => res.json())
            .then(  ({febestCount, autoplusCount, serverOn}) => {
                setChecked(serverOn);
                setFebestCount(febestCount);
                setAutoplusCount(autoplusCount);
            })
            .catch( error => setIsError(true));

    }, []);



    const switchHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        const response = await fetch(
            "http://localhost:8080/api/v1/home/serverOnAndOff",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serverOn: !event.target.checked,
                    verify: "854638322910-n081u1mlec3rr34oqs6d1g8tssdnkgfq",
                }),
            },
        );

        if (response.status === 200) {
            setChecked(!event.target.checked)
        } else {
            return Promise.reject();
        }
    };

    if (isError) return <Typography>Something went wrong!</Typography>;

    return (
        <Box>
            <Typography fontSize={25} fontWeight={700} color="#11142D">
                Dashboard
            </Typography>

            <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
                <PieChart
                    title="Febest Australia"
                    value={febestCount}
                    series={[febestCount, autoplusCount]}
                    colors={["#275be8", "#c4e8ef"]}
                />
                <PieChart
                    title="AutoPlusParts"
                    value={autoplusCount}
                    series={[autoplusCount, febestCount]}
                    colors={["#275be8", "#c4e8ef"]}
                />

            </Box>

            <Stack
                mt="25px"
                width="100%"
                direction={{ xs: "column", lg: "row" }}
                gap={4}
            >
                <Box
                    p={4}
                    flex={1}
                    bgcolor="#fcfcfc"
                    id="chart"
                    display="flex"
                    flexDirection="column"
                    borderRadius="15px"
                >
                    <Typography fontSize={18} fontWeight={600} color="#11142d">
                        System Power Off | On
                    </Typography>

                    <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                        <Switch color="primary" checked={checked} onChange={switchHandler}  />
                    </Stack>

                </Box>
            </Stack>

        </Box>
    );
};

export default Home;
