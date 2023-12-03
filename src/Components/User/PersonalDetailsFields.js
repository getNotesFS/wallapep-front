import React from 'react';
import { Form, Input, Col, Row, Typography,Descriptions, Select } from 'antd';
import { modifyStatePropertyWithStep } from '../../Utils/UtilsState';

import CustomDatePicker from '../CustomFields/CustomDatePicker';
import CountrySelector from '../CustomFields/CountrySelector';

import {requiredValidator, rangeValidator, emailValidator,getValidateStatus, validateBirthday, birthadyValidator,validateBirthdayCurrentValue} from '../../Utils/UtilsValidations';

import useValidation from '../../hooks/useFormValidation';

const { Option } = Select;

const PersonalDetailsFields = ({formData, handleChange, formErrors, touchedFields, handleFieldTouched }) => {



    return (
        <>
            <Descriptions title="Birthday"/>

            <Form.Item
                label=""
                hasFeedback
                
                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "birthday")}
                help={touchedFields.birthday && formErrors.birthday ? formErrors.birthday.msg : null}
            >
                <CustomDatePicker
                    value={formData.birthday || { day: '', month: '', year: '' }}
                    onChange={(value) => {
                        handleChange('birthday', value);
                        handleFieldTouched('birthday');
                    } }
                    validate={value => validateBirthdayCurrentValue(value, "")}
                />
            </Form.Item>



            <Descriptions title="Document Identy"/>
            <Row gutter={24} >
                <Col span={8}>
                    <Form.Item
                        label=""
                        hasFeedback
                        validateStatus={getValidateStatus(formData, formErrors, touchedFields, "documentIdentity")}
                        help={touchedFields.documentIdentity && formErrors.documentIdentity ? formErrors.documentIdentity.msg : null}
                    >
                        <Select
                            value={formData.documentIdentity || 'Select a document'}
                            onChange={(value) => {
                                handleChange('documentIdentity', value);
                                handleFieldTouched('documentIdentity');
                            }}
                        >
                            <Option value="DNI">DNI</Option>
                            <Option value="NIE">NIE</Option>
                            <Option value="PASSPORT">PASSPORT</Option>
                        </Select>
                    </Form.Item>


                </Col>
                <Col span={12}>
                    <Form.Item
                        label=""
                        hasFeedback
                        validateStatus={getValidateStatus(formData, formErrors, touchedFields, "documentNumber")}
                        help={touchedFields.documentNumber && formErrors.documentNumber ? formErrors.documentNumber.msg : null}
                    >
                        <Input
                            placeholder="X99XXXXXX"
                            value={formData.documentNumber || ''}
                            maxLength={9}
                            onChange={(e) => {
                                handleChange('documentNumber', e.target.value);
                                handleFieldTouched('documentNumber');
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>






            <Descriptions title="Address"/>
            <Form.Item
                label=""
                hasFeedback
                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "address")}
                help={touchedFields.address && formErrors.address ? formErrors.address.msg : null}
            >
                <Input
                    placeholder="C/ Example, 1"
                    value={formData.address || ''}
                    maxLength={100}
                    onChange={(e) => {
                        handleChange('address', e.target.value);
                        handleFieldTouched('address');
                    }}
                />
            </Form.Item>


            <Row gutter={24}>
                <Col span={12}>


                    <Form.Item
                        label=""
                        hasFeedback
                        validateStatus={getValidateStatus(formData, formErrors, touchedFields, "country")}
                        help={touchedFields.country && formErrors.country ? formErrors.country.msg : null}
                    >
                        <CountrySelector
                            value={formData.country || 'Select a country'}
                            onChange={(value) => {
                                handleChange('country', value);
                                handleFieldTouched('country');
                            }}

                        />
                    </Form.Item>



                </Col>
                <Col span={12}>

                    <Form.Item
                        label=""
                        hasFeedback
                        validateStatus={getValidateStatus(formData, formErrors, touchedFields, "postalCode")}
                        help={touchedFields.postalCode && formErrors.postalCode ? formErrors.postalCode.msg : null}
                    >
                        <Input
                            placeholder="Postal Code"
                            value={formData.postalCode || ''}
                            maxLength={6}
                            onChange={(e) => {
                                handleChange('postalCode', e.target.value);
                                handleFieldTouched('postalCode');
                            }}
                        />
                    </Form.Item>

                </Col>
            </Row>
        </>
    );
};

export default PersonalDetailsFields;
