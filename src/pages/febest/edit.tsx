import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import {Checkbox, Form, Input, Select} from "antd";

import { IPost } from "../../interfaces";

const FebestEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IPost>();

    const postData = queryResult?.data?.data;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Item Number"
                    name="item_number"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Custom Label(SKU)"
                    name="csku"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Febest SKU"
                    name="fsku"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Is Custom SKU"
                    name="combined"
                    valuePropName = "checked"
                >
                    <Checkbox />
                </Form.Item>
            </Form>
        </Edit>
    );
};
export default FebestEdit;
