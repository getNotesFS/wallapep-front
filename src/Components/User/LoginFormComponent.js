import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Card, Col, Row, Form, Input, Button, Typography, Divider} from "antd";
import {useNavigate} from 'react-router-dom';
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../Utils/UtilsValidations"

let LoginFormComponent = (props) => {
    let {setLogin, openNotification} = props
    let navigate = useNavigate();
    const [form] = Form.useForm();
    // validación
    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    let clickLogin = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json "},
                body: JSON.stringify(formData)
            })
        
        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
            }
           
            setLogin(true)
            openNotification("top", "Login successfull", "success")
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )

        }
    }

    return (
        <div style={{padding: "20px 50px"}}>
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>

        <Col xs={24} sm={24} md={18} lg={16} xl={12} xxl={10}>
            <Card title="" style={{padding: "2rem 1rem"}} headStyle={{borderBottom: 0, width: "100%"}}>
                <Row>
                    <Col span={24} style={{textAlign: "left", marginBottom: 40}}>
                        <Typography.Title level={1}>Log In</Typography.Title>
                        <Typography.Text type="secondary">Continue to Wallapep</Typography.Text>

                    </Col>
                </Row>
                <Form size={"large"}>


                <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputEmail(
                                       formData, "email", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input placeholder="your email"
                               onChange={(i) => {
                                   modifyStateProperty(formData, setFormData,
                                       "email", i.currentTarget.value)
                               }}/>
                        {formErrors?.email?.msg &&
                            <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>


                    <Form.Item label=""
                               validateStatus={
                                   validateFormDataInputRequired(
                                       formData, "password", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input.Password
                            placeholder="your password"
                            onChange={(i) => {
                                modifyStateProperty(formData, setFormData,
                                    "password", i.currentTarget.value)
                            }}/>
                        {formErrors?.password?.msg &&
                            <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>


                    <Row style={{marginTop: 20, padding: ".5rem"}}>
                        { allowSubmitForm(formData,formErrors,requiredInForm) ?
                            <Button type="primary" onClick={clickLogin} block >Continue with email</Button> :
                            <Button type="primary" block disabled>Continue with email</Button>
                        }
                        <Divider style={{ marginTop:30, color:'gray'}}>or</Divider>
                        <Form.Item style={{textAlign: "center", width: "100%", marginTop:0}}>
                            New in Wallapep?<a href="/register"> Get started </a>
                        </Form.Item>
                    </Row>


                </Form>
                </Card>
            </Col>
        </Row>
        </div>
    )
}

export default LoginFormComponent;