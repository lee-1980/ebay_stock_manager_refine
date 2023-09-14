import React from "react";
import { useForm, Create } from "@refinedev/antd";
import { Form, Input } from "antd";

import { IPost } from "../../interfaces";

const AutoplusCreate = () => {
    const { formProps, saveButtonProps } = useForm<IPost>();


    return (
        <Create saveButtonProps={saveButtonProps}>
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
            </Form>
        </Create>
    );
};

export default AutoplusCreate;