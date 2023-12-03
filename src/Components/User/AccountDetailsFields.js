import React from 'react';
import {Form, Input, Col, Row, Typography, Descriptions} from 'antd';
import useValidation from '../../hooks/useFormValidation';

import {getValidateStatus} from '../../Utils/UtilsValidations';
// Definir las reglas de validación

 

const AccountDetailsFields = ({  formData, handleChange, formErrors, touchedFields, handleFieldTouched }) => {

    
    return (
        <>
            <Descriptions title="Full name"/>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label=""
                        hasFeedback
                        validateStatus={getValidateStatus(formData, formErrors,touchedFields,"name")}
                        help={touchedFields.name && formErrors.name ? formErrors.name.msg : null}
                    >
                        <Input
                            placeholder="Name"
                            value={formData.name || ''}
                            onChange={(e) => {
                                handleChange('name', e.target.value);
                                handleFieldTouched('name');
                            }}
                        />
                    </Form.Item>


                </Col>
                <Col span={12}>
                    <Form.Item label=""
                               hasFeedback
                               validateStatus={getValidateStatus(formData, formErrors,touchedFields,"surname")}
                               help={touchedFields.surname && formErrors.surname ? formErrors.surname.msg : null}

                    >
                        <Input
                            placeholder="Last name"
                            value={formData.surname || ''}
                            onChange={(e) => {
                                handleChange('surname', e.target.value);
                                handleFieldTouched('surname');
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>


            <Descriptions title="Email"/>
            <Form.Item
                label=""
                hasFeedback
                validateStatus={getValidateStatus(formData, formErrors,touchedFields,"email")}
                help={touchedFields.email && formErrors.email ? formErrors.email.msg : null}
            >
                <Input
                    placeholder="Your email"
                    value={formData.email || ''}
                    onChange={(e) => {
                        handleChange('email', e.target.value);
                        handleFieldTouched('email');
                    }}
                />
            </Form.Item>

            <Form.Item
                label=""
                hasFeedback
                validateStatus={getValidateStatus(formData, formErrors,touchedFields,"password")}
                help={touchedFields.password && formErrors.password ? formErrors.password.msg : null}
            >
                <Input.Password
                    placeholder="Your password"
                    value={formData.password || ''}
                    onChange={(e) => {
                        handleChange('password', e.target.value);
                        handleFieldTouched('password');
                    }}
                />
            </Form.Item>

        </>
    );
};

export default AccountDetailsFields;
