import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import CreditCardManagement from "./Components/User/CreditCardManagement";
import HomePage from "./Components/HomePage/HomePage";
import ProfileComponent from "./Components/User/ProfileComponent";
import PublicUserProfileComponent from "./Components/User/PublicUserProfileComponent";
import {Route, Routes, Link, useNavigate, useLocation} from "react-router-dom"
import {
    Layout,
    Menu,
    Avatar,
    Typography,
    Col,
    Row,
    notification,
    ConfigProvider,
    theme,
    Dropdown,
    Button,
    Space
} from 'antd';

import {FireOutlined, LoginOutlined, UserOutlined, LogoutOutlined, DownOutlined,CreditCardOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";

let App = () => {


    const [api, contextHolder] = notification.useNotification();

    let navigate = useNavigate();
    let location = useLocation();
    const [buttonConfig, setButtonConfig] = useState({label: 'Sign in', icon: <LoginOutlined/>, path: '/'});


    let [login, setLogin] = useState(false);

    // for not using Layout.Header, Layout.Footer, etc...
    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        checkAll()
    }, [])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)

            if (!jsonData.activeApiKey) {
                navigate("/login")
            }
            return (jsonData.activeApiKey)
        } else {
            setLogin(false)
            navigate("/login")
            return (false)
        }
    }

    let checkUserAccess = async (isActive) => {
        let href = location.pathname;
        if (!isActive && !["/", "/login", "/register"].includes(href)) {
            navigate("/login")
        }
        if (isActive && ["/login", "/register"].includes(href)) {
            navigate("/products")
        }
    }

    let disconnect = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        setLogin(false)
        navigate("/login")
    }



    const { Title, Paragraph } = Typography;

    useEffect(() => {
        switch (location.pathname) {
            case '/login':
                setButtonConfig({label: 'Sign in', icon: <LoginOutlined/>, path: '/register'});
                break;
            case '/register':
                setButtonConfig({label: 'Login', icon: <UserOutlined/>, path: '/login'});
                break;
            default:
                setButtonConfig({label: 'Sign in', icon: <LoginOutlined/>, path: '/'});
        }
    }, [location]);


    return (
        <ConfigProvider theme={
            {
                "token": {
                    "colorPrimary": "#00b387",
                    "colorInfo": "#00b387",
                    "wireframe": false,
                    
                },
                
                
            }
        }>

            <Layout className="layout" style={{minHeight: "100vh"}}>
                {contextHolder}
                <Header style={{backgroundColor: "#ffffff"}}>
                    <Row>
                        <Col xs={18} sm={19} md={20} lg={21} xl={20}>
                            {!login &&
                                <Menu mode="horizontal" items={[
                                    {key: "logo", label:<Link to="/"> <img src="/logo.png" width="40" height="40"/></Link>},

                                ]}>
                                </Menu>
                            }

                            {login &&
                                <Menu mode="horizontal" items={[
                                    {key: "logo", label:<Link to="/"> <img src="/logo.png" width="40" height="40"/></Link>},
                                    {key: "menuProducts", label: <Link to="/products">Products</Link>},
                                    {key: "menuMyProduct", label: <Link to="/products/own">My Products</Link>},
                                    {key: "menuCreateProduct", label: <Link to="/products/create">Sell</Link>}
                                ]}>
                                </Menu>
                            }
                        </Col>
                        <Col xs={6} sm={5} md={4} lg={3} xl={4}
                             style={{display: 'flex', flexDirection: 'row-reverse', alignItems: 'center'}}>
                            {login ? (
                                <>
                                    <Dropdown
                                        menu={{
                                            items: [{
                                                key: "profile",
                                                label: <Link to="/profile">Profile</Link>,
                                                icon: <UserOutlined/>
                                            }, 
                                                {
                                                    key: "menuDisconnect",
                                                    icon: <LogoutOutlined/>,
                                                    label: <Link to="#" onClick={disconnect}>Disconnect</Link>
                                                },

                                            ]
                                        }}
                                        placement="bottom"
                                        arrow={{
                                            pointAtCenter: true
                                        }}
                                    >
                                        <Button type='text' style={{
                                            verticalAlign: 'middle',  border: 'none', backgroundColor: '#ffffff', cursor: 'pointer'
                                        }}> <Avatar size="small" style={{marginRight:5}}>
                                            {localStorage.getItem("email").charAt(0).toUpperCase()}
                                        </Avatar> {localStorage.getItem("email")} <DownOutlined/></Button>
                                    </Dropdown>
                                </>

                            ) : (
                                <Link to={buttonConfig.path}>
                                    <Button icon={buttonConfig.icon}>
                                        {buttonConfig.label}
                                    </Button>
                                </Link>
                            )}
                        </Col>
                    </Row>
                </Header>
                <Content >
                    <div className="site-layout-content">
                        <Routes>
                            <Route path="/" element={
                                <HomePage />
                            }/>
                            <Route path="/register" element={
                                <CreateUserComponent setLogin={setLogin} openNotification={openNotification}/>
                            }/>
                            <Route path="/login" element={
                                <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                            }/>
                            <Route path="/products" element={
                                <ListProductsComponent/>
                            }/>
                            <Route path="/products/edit/:id" element={
                                <EditProductComponent/>
                            }/>
                            <Route path="/products/:id" element={
                                <DetailsProductComponent  openNotification={openNotification}/>
                            }/>
                            <Route path="/products/create" element={
                                <CreateProductComponent openNotification={openNotification}/>
                            }></Route>
                            <Route path="/products/own" element={
                                <ListMyProductsComponent/>
                            }></Route>
                            <Route path="/payment" element={
                                <CreditCardManagement/>
                            }></Route>
                            <Route path="/profile" element={
                                <ProfileComponent  openNotification={openNotification}/>
                            }/>
                            <Route path="/seller/:id" element={
                                <PublicUserProfileComponent setLogin={setLogin} openNotification={openNotification}/>
                            }/>
                        </Routes>
                    </div>
                </Content>


                <Footer style={{ background: '#fff', padding: '50px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Title level={5}>Wallapep</Title>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>About</li>
                                <li>Careers</li>

                            </ul>
                        </Col>
                        <Col span={8}>
                            <Title level={5}>Support</Title>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Merchant support</li>
                                <li>Help center</li>

                            </ul>
                        </Col>
                        <Col span={8}>
                            <Title level={5}>Products</Title>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Shop</li>
                                <li>Shop Pay</li>

                            </ul>
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </ConfigProvider>
    )
}

export default App;