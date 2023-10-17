import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { useState, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import  {Spin, TimePicker, DatePicker} from 'antd';
import { apiWrapper } from "../utils/api";
import io from "socket.io-client";
import {
    PieChart
} from "components";

import {Button, Switch} from "@mui/material";

let socket;

const Home = () => {
    const ref = useRef();
    const [checked, setChecked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [febestCount, setFebestCount] = useState(0);
    const [autoplusCount, setAutoplusCount] = useState(0);
    const [orderTimer, setOrderTimer] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));
    const [stockMessage, setStockMessage] = useState<string>('Real Time Notification, Don\'t refresh the page while the system is running once click the Force Sync button');
    const [orderMessage, setOrderMessage] = useState<string>('Real Time Notification, Don\'t refresh the page while the system is running once click the Force Sync button');
    const [stockTimer, setStockTimer] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));
    const [stockATimer, setStockATimer] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));
    const [stockATimerChecked, setStockATimerChecked] = useState(false);
    const [stockBTimer, setStockBTimer] = useState<Dayjs | null>(dayjs('00:00:01', 'HH:mm:ss'));
    const [stockBTimerChecked, setStockBTimerChecked] = useState(false);
    const [lastSync, setLastSync] = useState<Dayjs | null>(dayjs('1970-01-01 00:00:01', 'YYYY-MM-DD HH:mm:ss'));

    React.useEffect(() => {
        setIsLoading(true);

        apiWrapper('home', null)
            .then(res => res.json())
            .then(  ({febestCount, autoplusCount, serverOn, runTime, lastSyncTime, StockTime, StockATime, StockBTime, stockAOn, stockBOn}) => {
                setLastSync(dayjs(lastSyncTime, 'YYYY-MM-DD HH:mm:ss'));
                setOrderTimer(dayjs(runTime, 'HH:mm:ss'));
                setStockTimer(dayjs(StockTime, 'HH:mm:ss'));
                setStockATimer(dayjs(StockATime, 'HH:mm:ss'));
                setStockBTimer(dayjs(StockBTime, 'HH:mm:ss'));
                setChecked(serverOn);
                setStockATimerChecked(stockAOn);
                setStockBTimerChecked(stockBOn);
                setFebestCount(febestCount);
                setAutoplusCount(autoplusCount);
                setIsLoading(false);
            })
            .catch( error => setIsError(true));

        socket = io('http://localhost:8000');

        socket.on( 'stockMessage', (message : string) => {
            setStockMessage(message);
        })
        socket.on( 'orderMessage', (message : string) => {
            setOrderMessage(message);
        });
        socket.on( 'lastAPICallTime', (lastSyncTime : string) => {
            setLastSync(dayjs(lastSyncTime, 'YYYY-MM-DD HH:mm:ss'));
        });

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
        let response;

        if(event.target.id && event.target.id === 'stockA') {
            response = await updateSetting('stockTimeAOnOff', event.target.checked? 'true': 'false');
            if (response.status === 200) {
                setStockATimerChecked(!event.target.checked)
            } else {
                return Promise.reject();
            }
        }
        else if (event.target.id && event.target.id === 'stockB') {
            response = await updateSetting('stockTimeBOnOff', event.target.checked? 'true': 'false');
            if (response.status === 200) {
                setStockBTimerChecked(!event.target.checked)
            } else {
                return Promise.reject();
            }
        }
        else{
            response = await updateSetting('systemOnOff', event.target.checked? 'true': 'false');
            // after updating the database, update the state

            if (response.status === 200) {
                setChecked(!event.target.checked)
            } else {
                return Promise.reject();
            }
        }

        setIsLoading(false);
    };

    const onOrderTimeChange = async (time: Dayjs | null, timeString: string) => {
        setIsLoading(true);

        const response = await updateSetting('runTime', timeString);
        // after updating the database, update the state
        if (response.status === 200) {
            setOrderTimer(time)
        } else {
            return Promise.reject();
        }
        setIsLoading(false);
    };

    const onStockTimeChange = async (time: Dayjs | null, timeString: string, id: string) => {
        setIsLoading(true);
        let response;
        console.log(id, "event");

        if(id === 's_timea') {
            response = await updateSetting('stockTimeA', timeString);
            // after updating the database, update the state
            if (response.status === 200) {
                setStockATimer(time)
            } else {
                return Promise.reject();
            }
        }
        else if( id === 's_timeb') {
            response = await updateSetting('stockTimeB', timeString);
            // after updating the database, update the state
            if (response.status === 200) {
                setStockBTimer(time)
            } else {
                return Promise.reject();
            }
        }
        else{
            response = await updateSetting('stockTime', timeString);
            // after updating the database, update the state
            if (response.status === 200) {
                setStockTimer(time)
            } else {
                return Promise.reject();
            }
        }

        setIsLoading(false);
    }

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
                                Cron Job Timer (Posting Orders from ebay to DataPel).
                            </Typography>
                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <TimePicker allowClear={false} use12Hours={false} value={orderTimer} format="HH:mm:ss" onChange={onOrderTimeChange}/>
                                <Button variant="contained" color="primary" onClick={() => onOrderTimeChange(dayjs().add(5, 'second'), dayjs().add(5, 'second').format('HH:mm:ss'))}>Force Run in 5 seconds</Button>
                            </Stack>
                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <p style={{ color: "#fff" , backgroundColor: "#7c7eff", borderRadius: "5px", padding: "10px 15px", border: "2px double #cbb1ff"}}>
                                {orderMessage}
                                </p>
                            </Stack>

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
                                <p style={{ color: "#fff" , backgroundColor: "#1677ff", borderRadius: "5px", padding: "10px 15px"}}>This value must not be later than the current time. This value is updated regularly when the "posting orders to datapel" job runs.</p>
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
                                Cron Job Timer (Stock Sync).
                            </Typography>

                            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                <p style={{ color: "#fff" , backgroundColor: "#7c7eff", borderRadius: "5px", padding: "10px 15px", border: "2px double #cbb1ff"}}>
                                    {stockMessage}
                                </p>
                            </Stack>

                            <Box p={1} m={1} component="fieldset" border={"2px solid #7c7eff"} borderRadius="5px">
                                <legend style={{color: "#7c7eff", fontWeight: "600"}}>Main Stock Sync</legend>
                                <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                                    <TimePicker id={"s_time"} allowClear={false} use12Hours={false} value={stockTimer}
                                                format="HH:mm:ss" onChange={(date, dateString) => onStockTimeChange(date, dateString, "s_time")}/>
                                    <Button variant="contained" color="primary"
                                            onClick={() => onStockTimeChange(dayjs().add(5, 'second'), dayjs().add(5, 'second').format('HH:mm:ss'), "s_time")}>Force
                                        Run in 5 seconds</Button>
                                </Stack>
                            </Box>

                            <p style={{ color: "#fff" , backgroundColor: "#1677ff", borderRadius: "5px", padding: "8px 14px"}}>It is recommended to stagger stock change runners by a time difference of more than 4 hours.</p>

                            <Stack direction="row" gap={4} >
                                <Box p={1} m={1} component="fieldset" border={"2px solid #7c7eff"} borderRadius="5px">
                                    <legend style={{color: "#7c7eff", fontWeight: "600"}}>
                                        Stock Sync A
                                        <Switch id={"stockA"} color="primary"  checked={stockATimerChecked} onChange={switchHandler}/>
                                    </legend>
                                    <Stack my="20px" direction="row" gap={4} flexWrap="wrap" style={{opacity: stockATimerChecked?"1":"0.2"}}>
                                        <TimePicker id={"s_timea"} allowClear={false} use12Hours={false} value={stockATimer}
                                                    format="HH:mm:ss" onChange={(date, dateString) => onStockTimeChange(date, dateString, "s_timea")}/>
                                    </Stack>
                                </Box>

                                <Box p={1} m={1} component="fieldset" border={"2px solid #7c7eff"} borderRadius="5px">
                                    <legend style={{color: "#7c7eff", fontWeight: "600"}}>
                                        Stock Sync B
                                        <Switch id={"stockB"} color="primary" checked={stockBTimerChecked} onChange={switchHandler}/>
                                    </legend>
                                    <Stack my="20px" direction="row" gap={4} flexWrap="wrap" style={{opacity: stockBTimerChecked?"1":"0.2"}}>
                                        <TimePicker id={"s_timeb"} allowClear={false} use12Hours={false} value={stockBTimer}
                                                    format="HH:mm:ss" onChange={(date, dateString) => onStockTimeChange(date, dateString, "s_timeb")}/>
                                    </Stack>
                                </Box>
                            </Stack>

                        </Stack>
                    </Box>
                </Stack>

            </Box>
        </Spin>
    );
};

export default Home;
