import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import  {Spin, TimePicker} from 'antd';
import { apiWrapper } from "../utils/api";
import {
    PieChart
} from "components";

import {Switch} from "@mui/material";


const Home = () => {

    const [checked, setChecked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [febestCount, setFebestCount] = useState(0);
    const [autoplusCount, setAutoplusCount] = useState(0);
    const [value, setValue] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));

    React.useEffect(() => {
        setIsLoading(true);
        apiWrapper('home', null)
            .then(res => res.json())
            .then(  ({febestCount, autoplusCount, serverOn, runTime}) => {
                setValue(dayjs(runTime, 'HH:mm:ss'));
                setChecked(serverOn);
                setFebestCount(febestCount);
                setAutoplusCount(autoplusCount);
                setIsLoading(false);
            })
            .catch( error => setIsError(true));
    }, []);

    const updateSetting = async (key : string, keyValue : string) => {
        return apiWrapper('home/updateSetting',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key,
                keyValue,
                verify: "854638322910-n081u1mlec3rr34oqs6d1g8tssdnkgfq",
            })
        })
    }

    const switchHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);

        console.log(!event.target.checked)
        const response = await updateSetting('systemOnOff', event.target.checked? 'true': 'false');

        // after updating the database, update the state

        if (response.status === 200) {
            setChecked(!event.target.checked)
        } else {
            return Promise.reject();
        }
        setIsLoading(false);
    };

    const onChange = async (time: Dayjs | null, timeString: string) => {

        setIsLoading(true);

        const response = await updateSetting('runTime', timeString);

        // after updating the database, update the state
        if (response.status === 200) {
            setValue(time)
        } else {
            return Promise.reject();
        }

        setIsLoading(false);
    };

    if (isError) return <Typography>Something went wrong!</Typography>;

    return (
        <Spin spinning={isLoading}>
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
                    direction={{xs: "column", lg: "row"}}
                    gap={4}
                >
                    <Box
                        p={4}
                        flex={1}
                        bgcolor="#fcfcfc"
                        id="chart"
                        display="flex"
                        flexDirection="row"
                        borderRadius="15px"
                    >
                        <Stack width="50%">
                            <Typography fontSize={18} fontWeight={600} color="#11142d">
                                System Enable
                            </Typography>

                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <Switch color="primary" checked={checked} onChange={switchHandler}/>
                            </Stack>
                        </Stack>

                        <Stack width="50%">
                            <Typography fontSize={18} fontWeight={600} color="#11142d">
                                Specific Run Time of Daily Job
                            </Typography>
                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <TimePicker allowClear={false} use12Hours={false} value={value} format="HH:mm:ss" onChange={onChange}/>;
                            </Stack>
                        </Stack>

                    </Box>

                </Stack>

            </Box>
        </Spin>
    );
};

export default Home;
