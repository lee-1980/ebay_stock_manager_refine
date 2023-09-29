import React from "react";
import {
    useTable,
    useImport,
    EditButton,
    DeleteButton,
    CreateButton,
    List,
    ImportButton,
    BooleanField
} from "@refinedev/antd";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Space, Table, Modal } from "antd";
import Button from "@mui/material/Button";
import { IPost, IPostFile } from "../../interfaces";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useMemo } from "react";

import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {apiWrapper} from "../../utils/api";

const OrderList = () => {


    const { tableProps, tableQueryResult: { data, isLoading, isError, refetch } , filters,  setFilters,} = useTable<IPost>();


    const allFebests = data?.data ?? [];

    const currentFilterValues = useMemo(() => {

        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : [],
        );

        return {
            item_number:
                logicalFilters.find((item) => item.field === "item_number")?.value ||
                ""
        };
    }, [filters]);

    const handleDelete = () => {
        Modal.confirm({
            title: "Are you sure? you want to delete All records?",
            onOk: async () => {
                let response = await apiWrapper("orders/deleteAll", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        verify: "854638322910-n081u1mlec3rr34oqs6d1g8tssdnkgfq",
                    }),
                });

                if (response.status === 200) {
                    await refetch();
                } else {
                    return Promise.reject();
                }
            }
        })
    }


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Stack direction="column" width="100%">

                    <Typography fontSize={25} fontWeight={700} color="#FFF">
                        {!allFebests.length
                            ? "There are no properties"
                            : "All Febests"}
                    </Typography>

                    <Box
                        mb={2}
                        mt={3}
                        display="flex"
                        width="84%"
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >
                        <Box
                            display="flex"
                            gap={2}
                            flexWrap="wrap"
                            mb={{ xs: "20px", sm: 0 }}
                        >
                            <TextField
                                variant="outlined"
                                color="info"
                                placeholder="Search by Item Number"
                                value={currentFilterValues.item_number}
                                onChange={(e) => {
                                    setFilters([
                                        {
                                            field: "item_number",
                                            operator: "contains",
                                            value: e.currentTarget.value
                                                ? e.currentTarget.value
                                                : undefined,
                                        },
                                    ]);
                                }}
                            />
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <List
                title={""}
                headerButtons={
                    <Space>
                        <Button
                            onClick={handleDelete}
                            startIcon={<DeleteOutline />}
                            sx={{
                                flex: "unset",
                                width: "fit-content",
                                color: "#ff3b3b",
                                textTransform: "capitalize",
                                border: "1px solid #ff3b3b",
                                height: "32px",
                            }}
                        >
                            Delete All
                        </Button>
                    </Space>
                }
                wrapperProps={{
                    style: {
                        backgroundColor: "white",
                        padding : "10px"
                    },
                }}

            >
                <Table {...tableProps} rowKey="item_number">
                    <Table.Column dataIndex="orderId" title="Item Number" />
                    <Table.Column dataIndex="store" title="Custom Label(SKU)" />
                    <Table.Column dataIndex="date" title="Febest SKU" />
                    <Table.Column<IPost>
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


export default OrderList;