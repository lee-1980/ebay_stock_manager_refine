import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { useState, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import  {Spin, TimePicker, DatePicker} from 'antd';
import { apiWrapper } from "../utils/api";
import {
    PieChart
} from "components";

import {Button, Switch} from "@mui/material";


const Home = () => {
    const ref = useRef();
    const [checked, setChecked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [febestCount, setFebestCount] = useState(0);
    const [autoplusCount, setAutoplusCount] = useState(0);
    const [value, setValue] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));
    const [lastSync, setLastSync] = useState<Dayjs | null>(dayjs('1970-01-01 00:00:01', 'YYYY-MM-DD HH:mm:ss'));

    React.useEffect(() => {
        setIsLoading(true);
        apiWrapper('home', null)
            .then(res => res.json())
            .then(  ({febestCount, autoplusCount, serverOn, runTime, lastSyncTime}) => {
                setLastSync(dayjs(lastSyncTime, 'YYYY-MM-DD HH:mm:ss'));
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

    const onChangeDateTime = async (time: Dayjs | null, timeString: string) => {
        setIsLoading(true);

        const response = await updateSetting('lastAPICallTime', timeString);
        // after updating the database, update the state
        if (response.status === 200) {
            setLastSync(time)
        } else {
            return Promise.reject();
        }
        setIsLoading(false);
    }

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
                        width="33%"
                        bgcolor="#fcfcfc"
                        id="chart"
                        display="flex"
                        flexDirection="row"
                        borderRadius="15px"
                    >
                        <Stack >
                            <Typography fontSize={18} fontWeight={600} color="#11142d">
                                System Enablement
                            </Typography>

                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <Switch color="primary" checked={checked} onChange={switchHandler}/>
                                <p style={{ color: "#fff" , backgroundColor: "#1677ff", borderRadius: "5px", padding: "10px 15px"}}>Enable or Disable the Daily Job. When disabled, the Daily Job will not be run.</p>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box
                        p={4}
                        flex={1}
                        width="33%"
                        bgcolor="#fcfcfc"
                        id="chart"
                        display="flex"
                        flexDirection="row"
                        borderRadius="15px"
                    >
                        <Stack>
                            <Typography fontSize={18} fontWeight={600} color="#11142d">
                                Cron Job Time.
                            </Typography>
                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <TimePicker allowClear={false} use12Hours={false} value={value} format="HH:mm:ss" onChange={onChange}/>
                                <Button variant="contained" color="primary" onClick={() => onChange(dayjs().add(5, 'second'), dayjs().add(5, 'second').format('HH:mm:ss'))}>Force Run in 5 seconds</Button>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box
                        p={4}
                        flex={1}
                        width="33%"
                        bgcolor="#fcfcfc"
                        id="chart"
                        display="flex"
                        flexDirection="row"
                        borderRadius="15px"
                    >
                        <Stack>
                            <Typography fontSize={18} fontWeight={600} color="#11142d">
                                Last eBay Order Sync Time
                            </Typography>
                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={lastSync}
                                    onChange={onChangeDateTime}
                                    showTime={{ use12Hours: false }}
                                    allowClear={false}
                                />
                                <p style={{ color: "#fff" , backgroundColor: "#1677ff", borderRadius: "5px", padding: "10px 15px"}}>This value must not be later than the current time. This value is updated regularly when the daily job runs.</p>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>

            </Box>
        </Spin>
    );
};

export default Home;
