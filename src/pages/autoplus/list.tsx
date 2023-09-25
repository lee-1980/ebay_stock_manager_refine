
import {
    useTable,
    useImport,
    EditButton,
    DeleteButton,
    List,
    ImportButton, CreateButton, BooleanField
} from "@refinedev/antd";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Space, Table } from "antd";

import { IPost, IPostFile } from "../../interfaces";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useMemo } from "react";

const AutoplusList = () => {

    const { tableProps, tableQueryResult: { data, isLoading, isError } , filters,  setFilters,} = useTable<IPost>();

    const TrueIcon = () => <span>✅</span>;

    const FalseIcon = () => <span>❌</span>;

    const [total, setTotal] = React.useState(0);
    const [processed, setProcessed] = React.useState(0);
    const [isImportLoading, setisImportLoading ] = React.useState(false);

    const importProps = useImport<IPostFile>({
        mapData: (item) => {
            return {
                item_number: item.item_number,
                csku: item.csku,
                fsku: item.fsku,
                combined: false
            };
        },
        onProgress: ({ totalAmount, processedAmount }) => {
            if(processedAmount < totalAmount) setisImportLoading(true);
            setProcessed(processedAmount);
            setTotal(totalAmount);
        },
        batchSize   : 100,
    });

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

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Stack direction="column" width="100%">

                    <Typography fontSize={25} fontWeight={700} color="#FFF">
                        {!allFebests.length
                            ? "There are no properties"
                            : "All Autopluss"}
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
                        <span>{ isImportLoading?`${processed}/${total}`:''}</span>
                        <ImportButton {...importProps} />

                        <CreateButton />
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
                    <Table.Column dataIndex="item_number" title="Item Number" />
                    <Table.Column dataIndex="csku" title="Custom Label(SKU)" />
                    <Table.Column dataIndex="fsku" title="Febest SKU" />
                    <Table.Column dataIndex="combined"
                                  title="Is Custom SKU?"
                                  render={(value) => (
                                      <BooleanField
                                          value={value}
                                          trueIcon={<TrueIcon />}
                                          falseIcon={<FalseIcon />}
                                          valueLabelTrue="True"
                                          valueLabelFalse="False"
                                      />
                                  )}
                    />
                    <Table.Column<IPost>
                        title="Actions"
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
                                <EditButton
                                    hideText
                                    size="small"
                                    recordItemId={record._id}
                                />
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


export default AutoplusList;