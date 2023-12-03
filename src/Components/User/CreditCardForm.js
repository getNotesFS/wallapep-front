import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

import {modifyStateProperty} from "../../Utils/UtilsState";
import {Upload, Button, Row, Col, Card, Form, Input, Select, Image, message} from 'antd';
import {InboxOutlined, DollarOutlined} from '@ant-design/icons';

import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../Reducers/reducerCountSlice";
import category_options from "../../data/categories";
import {
    requiredValidator,
    rangeValidator,
    isFormValid,
    allowSubmitForm,
    setServerErrors,
    setServerErrorsByField,
    joinAllServerErrorMessages,
    getValidateStatus,
    priceValidator
} from '../../Utils/UtilsValidations';

import useValidation from '../../hooks/useFormValidation';


const {Option} = Select;


const expirationDateValidator = (value) => {

    const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const dateString = value;

    if (regex.test(dateString)) {
        return null;
    } else {
        return {msg: "La fecha no es válida."};
    }

    return null;
};

const validators = {
    alias: [requiredValidator(), value => rangeValidator(value, 5, 50, "Alias must be max 50 characters")],
    expirationDate: [ expirationDateValidator, requiredValidator()],
    code: [requiredValidator(), value => rangeValidator(value, 3, 3, "Code must be max 3 characters")],
    number: [requiredValidator(), value => rangeValidator(value, 16, 16, "Number must be max 16 characters")],
};
let CreditCardForm = (props2) => {

    const [form] = Form.useForm();

    let {openNotification, creditCard,onClose} = props2;

    let requiredInForm = ["number", "expirationDate", "code", "alias"];

    const initialFormData = {
        number: '',
        expirationDate: '',
        code: '',
        alias: '',

    };

    const onCancelEdit = () => {
        onClose(false);
    }

    const {
        formData,
        setFormData,
        handleChange,
        formErrors,
        setFormErrors,
        touchedFields,
        setTouchedFields
    } = useValidation(initialFormData, validators);


    const [expirationDate, setExpirationDate] = useState('');

    const handleExpirationDate = (e) => {
        const inputText = e.target.value;

        // Eliminar cualquier carácter que no sea número ni "/".
        const cleanedText = inputText.replace(/[^0-9/]/g, '');

        // Limitar la longitud máxima a 5 caracteres.
        const formattedText = cleanedText.slice(0, 5);

        // Aplicar la máscara MM/AA.
        let formattedDate = '';
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 2 && formattedText.charAt(i) !== '/') {
                formattedDate += `/${formattedText.charAt(i)}`;
            } else {
                formattedDate += formattedText.charAt(i);

            }
        }

        setExpirationDate(formattedDate);
    };



    const onSearch = (val) => {
        console.log('search:', val);
    };


    const resetForm = () => {
        form.resetFields(); // Resetear campos del formulario de Ant Design
        setFormData(initialFormData); // Resetear el estado del formulario
        setFormErrors({}); // Resetear los errores del formulario
        setTouchedFields({}); // Resetear los campos tocados

    };


    const clickCreateCreditCard = async () => {
        createCreditCard(formData);
    }

    // Función para crear una tarjeta de crédito utilizando fetch
    const createCreditCard = async (creditCardData) => {
        
        try {
            // Hacer la solicitud POST al endpoint de la API utilizando fetch

            let response = await fetch(
                process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json ",
                        "apikey": localStorage.getItem("apiKey")
                    },
                    body: JSON.stringify(creditCardData)
                })

            

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Tarjeta creada con éxito:', data);
            onClose(false);
            openNotification("top", "Tarjeta creada con éxito", "success");
            
            // Manejo adicional, como actualizar el estado o mostrar un mensaje al usuario
        } catch (error) {
            console.error('Error al crear la tarjeta de crédito:', error);
            // Manejo de errores, como mostrar un mensaje al usuario
        }
    };


    const handleFieldTouched = (field) => {
        setTouchedFields(prev => ({
            ...prev,
            [field]: true
        }));
    };




    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        // Lógica para determinar si el formulario es válido
        const isValid = isFormValid(formData, formErrors, requiredInForm);
        
        setFormValid(isValid);
    }, [formData, formErrors]);


    return (
        <Card title="Create credit card" style={{maxWidth: "500px", width:"100%", height: "100%",marginTop:20}}>


            <Form size={"large"} form={form} layout="vertical">
                <Form.Item
                    label=""
                    hasFeedback
                    validateStatus={getValidateStatus(formData, formErrors, touchedFields, "alias")}
                    help={touchedFields.alias && formErrors.alias ? formErrors.alias.msg : null}
                >
                    <Input
                        size="large"
                        type="text"
                        placeholder="Alias"
                        value={formData.alias || ''}
                        onChange={(e) => {
                            handleChange('alias', e.target.value);
                            handleFieldTouched('alias');
                        }}
                    />

                </Form.Item>
                <Form.Item
                    label=""
                    hasFeedback

                    validateStatus={getValidateStatus(formData, formErrors, touchedFields, "number")}
                    help={touchedFields.number && formErrors.number ? formErrors.number.msg : null}
                >
                    <Input
                        size="large"
                        type="number"
                        max={16}
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={formData.number || ''}
                        onChange={(e) => {
                            handleChange('number', e.target.value);
                            handleFieldTouched('number');
                        }}
                    />
                </Form.Item>

                <Row gutter={16} >
                    <Col xs={8}>
                        <Form.Item
                            label=""
                            hasFeedback
                            validateStatus={getValidateStatus(formData, formErrors, touchedFields, "expirationDate")}
                            help={touchedFields.expirationDate && formErrors.expirationDate ? formErrors.expirationDate.msg : null}
                        >
                            <Input
                                size="large"
                                type="text" // Change the type to "text"
                                placeholder="MM/YY"
                                value={expirationDate || ''}
                                onChange={(e) => {
                                    handleExpirationDate(e);
                                    handleChange('expirationDate', e.target.value);
                                    handleFieldTouched('expirationDate');
                                }}
                            />

                        </Form.Item>


                    </Col>

                    <Col xs={8}>

                        <Form.Item
                            label=""
                            hasFeedback
                            validateStatus={getValidateStatus(formData, formErrors, touchedFields, "code")}
                            help={touchedFields.code && formErrors.code ? formErrors.code.msg : null}
                        >
                            <Input

                                size="large"
                                type="number"
                                min={0}
                                max={3}

                                placeholder="CVC - XXX"
                                value={formData.code || ''}
                                onChange={(e) => {
                                    handleChange('code', e.target.value);
                                    handleFieldTouched('code');
                                }}
                            />

                        </Form.Item>
                    </Col>


                </Row>


                <Button type="primary" block disabled={!formValid} onClick={clickCreateCreditCard}>
                    Add New Card
                </Button>
            </Form>
        </Card>
    )
}

export default CreditCardForm;