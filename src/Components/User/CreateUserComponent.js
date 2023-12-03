import {useState, useRef, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {Card, Col, Row, Form, Input, Button, Typography, Select, Descriptions, Steps, Divider} from "antd";
import {RightOutlined, LeftOutlined} from '@ant-design/icons';
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
    IdcardOutlined,
    HomeOutlined
} from '@ant-design/icons';


import CountrySelector from '../CustomFields/CountrySelector';
import CustomDatePicker from '../CustomFields/CustomDatePicker';
import PersonalDetailsFields from './PersonalDetailsFields';
import AccountDetailsFields from './AccountDetailsFields';


import {
    requiredValidator,
    rangeValidator,
    emailValidator,
    isFormValid,
    allowSubmitForm,
    setServerErrors,
    setServerErrorsByField,
    joinAllServerErrorMessages
} from '../../Utils/UtilsValidations';

import useValidation from '../../hooks/useFormValidation';

const {Step} = Steps;


const validators = {
    name: [requiredValidator()],
    surname: [requiredValidator()],
    email: [
        requiredValidator(),
        value => emailValidator(value, "Please provide a valid email address")
    ],
    password: [
        requiredValidator(),
        value => rangeValidator(value, 5, 20, "Password must be between 5 and 20 characters")
    ],
    documentIdentity: [requiredValidator()],
    documentNumber: [
        requiredValidator(),
        value => rangeValidator(value, 0, 10, "Document Identity must be max 9 characters"),
    ],
    address: [requiredValidator(),
        value => rangeValidator(value, 0, 100, "Address must be max 100 characters")],
    country: [requiredValidator()],
    postalCode: [requiredValidator(),
        value => rangeValidator(value, 5, 6, "Postal Code must be max 6 characters")],
    birthday: [requiredValidator()],


};
let CreateUserComponent = (props) => {
    const [form] = Form.useForm();

    let requiredInForm = ["email", "password", "name", "surname", "address", "country", "postalCode", "birthday", "documentIdentity", "documentNumber"];

    const initialFormData = {
        name: '',
        surname: '',
        email: '',
        password: '',
        documentIdentity: '',
        address: '',
        country: '',
        postalCode: '',
        birthday: ''
    };

    const {
        formData,
        setFormData,
        handleChange,
        formErrors,
        setFormErrors,
        touchedFields,
        setTouchedFields
    } = useValidation(initialFormData, validators);

    const [current, setCurrent] = useState(0);

    let {setLogin, openNotification} = props;

    let navigate = useNavigate();
    const handleFieldTouched = (field) => {
        setTouchedFields(prev => ({
            ...prev,
            [field]: true
        }));
    };


    const formatBirthday = (birthday) => {
        return birthday && birthday.day && birthday.month && birthday.year
            ? `${birthday.year}-${birthday.month}-${birthday.day}`
            : null;
    };

    const clickRegister = async () => {
        

        if (!isFormValid(formData, formErrors, requiredInForm)) {
      
            return;
        }

        let dataToSend = {...formData, birthday: formatBirthday(formData.birthday)};

        try {
            let registerResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend)
            });

            if (!registerResponse.ok) {
                let errorBody = await registerResponse.json();
                setServerErrors(errorBody.errors, setFormErrors);
                openNotification("top", joinAllServerErrorMessages(errorBody.errors), "error");
                return;
            }

            // Si el registro es exitoso, procede con el login
            await performLogin(formData.email, formData.password);
        } catch (error) {
            console.error("Error en la petición: ", error);
            openNotification("top", "Error during registration", "error");
        }
    };

    const performLogin = async (email, password) => {
        let loginResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        if (!loginResponse.ok) {
            console.error("Error en el inicio de sesión");
            openNotification("top", "Login failed", "error");
            return;
        }

        let responseBody = await loginResponse.json();
        localStorage.setItem("apiKey", responseBody.apiKey);
        localStorage.setItem("email", responseBody.email);
        setLogin(true);
        openNotification("top", "Register successful", "success");
        navigate('/products');
    };


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onChange = (value: number) => {
        console.log('onChange:', value);
        setCurrent(value);
    };


    // Contenido de los pasos
    const steps = [
        {
            title: 'Create account',
            content: (

                <AccountDetailsFields
                    formData={formData}
                    handleChange={handleChange}
                    formErrors={formErrors}
                    touchedFields={touchedFields}
                    handleFieldTouched={handleFieldTouched}
                />


            ),
        },
        {
            title: 'Personal information',
            content: (
                <PersonalDetailsFields
                    formData={formData}
                    handleChange={handleChange}
                    handleFieldTouched={handleFieldTouched}
                    formErrors={formErrors}
                    touchedFields={touchedFields}
                />


            ),
        },
    ];
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        // Lógica para determinar si el formulario es válido
        const isValid = isFormValid(formData, formErrors, requiredInForm);
     

        setFormValid(isValid);
    }, [formData, formErrors]);

    return (
        <div style={{padding: "20px 50px"}}>
            <Row align="middle" justify="center" style={{minHeight: "70vh"}}>

                <Col xs={24} sm={24} md={18} lg={16} xl={12} xxl={10}>
                    <Card title="" style={{padding: "2rem 1rem"}} headStyle={{borderBottom: 0, width: "100%"}}>
                        <Row>
                            <Col span={24} style={{textAlign: "left", marginBottom: 40}}>
                                <Typography.Title level={1}>Create a Wallapep account</Typography.Title>
                                <Typography.Text type="secondary">One last step before starting your
                                    adventure.</Typography.Text>

                            </Col>
                        </Row>


                        <Form size={"large"}>


                            <Steps current={current} onChange={onChange}>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title}/>
                                ))}
                            </Steps>

                            <Divider/>

                            <div className="steps-content" style={{marginTop: 30}}>{steps[current].content}</div>

                            <div className="steps-action">
                                <Row style={{marginTop: 12}}>

                                    {current > 0 && (

                                        isFormValid(formData, formErrors, requiredInForm) ?
                                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                                <LeftOutlined/>Previous
                                            </Button> :
                                            <Button type="primary" style={{margin: '0 8px'}} onClick={() => prev()}>
                                                <LeftOutlined/>Previous
                                            </Button>
                                    )}

                                    {current < steps.length - 1 && (
                                        <Button type="primary" onClick={() => next()}>
                                            Next <RightOutlined/>
                                        </Button>
                                    )}

                                </Row>


                            </div>


                            <Row style={{marginTop: 20, padding: ".5rem"}}>
                                {current === steps.length - 1 && (

                                    <Button type="primary" block disabled={!formValid} onClick={clickRegister}>
                                        Create Wallapep account
                                    </Button>
                                )}
                                <Divider style={{marginTop: 10, color: 'gray'}}>or</Divider>
                                <Form.Item style={{textAlign: "center", width: "100%", marginTop: 0}}>
                                    Already have a Wallapep account? <a href="/login">Log In </a>
                                </Form.Item>
                            </Row>


                        </Form>


                    </Card>
                </Col>
            </Row>
        </div>
    );

}

export default CreateUserComponent;