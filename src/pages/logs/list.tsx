import React from "react";
import {
    useTable,
    DeleteButton,
    List,
} from "@refinedev/antd";

import Box from "@mui/material/Box";
import { Space, Table } from "antd";

import { ILog } from "../../interfaces";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const LogList = () => {

    const { tableProps, tableQueryResult: { data, isLoading, isError }} = useTable<ILog>();

    const allLogs = data?.data ?? [];

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Stack direction="column" width="100%">

                    <Typography fontSize={25} fontWeight={700} color="#FFF">
                        {!allLogs.length
                            ? "There are no Logs"
                            : "All Logs"}
                    </Typography>

                </Stack>
            </Box>

        <List
            title={""}
            wrapperProps={{
                style: {
                    backgroundColor: "white",
                    padding : "10px"
                },
            }}

        >
            <Table {...tableProps} rowKey="_id">
                <Table.Column dataIndex="type" title="Type" width={"10%"}/>
                <Table.Column dataIndex="description" title="Description" />
                <Table.Column dataIndex="date" title="Date" width={"25%"}/>
                <Table.Column<ILog>
                    width={"10%"}
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record._id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>

        </Box>
    );
};


export default LogList;