import React, { useState } from 'react';
import { Form, Checkbox, DatePicker, Button,Flex } from 'antd';
import { ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

const PurchaseFormComponent = () => {
    return (
        <div style={{ marginTop: "2em" }}>
            <Form
                 layout="vertical"
                style={{ maxWidth: 600,width:"100%",justifyContent:"center",alignItems:"center" }}
            >

                <Form.Item label="RangePicker" name="dateRange">
                    <RangePicker />
                </Form.Item>
                <Flex vertical gap="small" style={{ width: '100%' }}>

                    <Button
                        type="primary"
                        shape="round"
                        icon={<ShoppingOutlined />}
                        size="large"
                        style={{ width: "100%" }} // Establecer el ancho del botón al 100%
                    >
                        Buy
                    </Button>
                </Flex>
            </Form>
        </div>
    );
};

export default PurchaseFormComponent;
