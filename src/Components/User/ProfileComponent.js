import {useEffect, useState, useMemo, useCallback} from 'react';
import {Modal,Space,Layout, Menu, Card, Row, Col, Avatar, Button, FloatButton,notification,Rate,   Spin} from 'antd';


import {Breadcrumb, theme} from 'antd';
import CreditCard from './CreditCard';
import EditCreditCardForm from './EditCreditCardForm';
import CreditCardForm from './CreditCardForm';
import ListMyTransactionsComponent from './ListMyTransactionsComponent';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
    PlusCircleOutlined,
    CreditCardOutlined,
    ProfileOutlined,
    TransactionOutlined,
    UserSwitchOutlined,
    CommentOutlined,
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';

const {Sider, Content, Header, Footer} = Layout;


const items2 = [
    {
        key: 'summary',
        icon: <UserSwitchOutlined/>,
        label: 'My account',
    },
    {
        key: 'profile',
        icon: <UserSwitchOutlined/>,
        label: 'Profile',
        children: [
            {key: 'edit-profile', label: 'Edit Profile', icon: <ProfileOutlined/>},
            {key: 'other-options', label: 'Other options', icon: <EllipsisOutlined/>},
        ],
    },
    {
        key: 'transactions',
        icon: <TransactionOutlined/>,
        label: 'Transactions',
    },
    {
        key: 'credit-cards',
        icon: <CreditCardOutlined/>,
        label: 'Credit Cards',
        children: [
            {key: 'list-cards', label: 'List Cards'},
            {key: 'add-new-cd', label: 'Add New'},
        ],
    },
];
const close = () => {
    console.log(
        'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
};

const ProfileComponent = (props) => {

    let {openNotification} = props;
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const [profile, setProfile] = useState({});

    const fetchProfileData = async () => {
        try {

            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/users/own`,
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );

            if (response.ok) {
                let jsonData = await response.json();
                console.log("profile: ", jsonData);
                setProfile({...jsonData, key: jsonData.id});
            } else {
                // Manejar respuesta no exitosa
                console.error("Error al obtener información del perfil");
            }
        } catch (error) {
            console.error("Error al obtener información del perfil: ", error);
        }
    };

    const openNotification2 = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => api.destroy()}>
                    Destroy All
                </Button>
                <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                    Confirm
                </Button>
            </Space>
        );
        api.open({
            message: 'Notification Title',
            description:
                'Cancel delete this card?',
            btn,
            key,
            onClose: close,
        });
    };

    const [creditCards, setCreditCards] = useState([]);


    const [isEditing, setIsEditing] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    const [isAddingCreditCard, setIsAddingCreditCard] = useState(false);
    const [AddingCreditCard, setAddingCreditCard] = useState(null);

    const [isListMyTransactions, setIsListMyTransactions] = useState(false);
    const [listMyTransactions, setListMyTransactions] = useState(null);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const handleEditClick = useCallback((creditCard) => {
       
        setIsEditing(true);
        setEditingCard(creditCard);
    }, []);

    const handleDeleteClick = useCallback(() => {
        
        setEditingCard(null);
        getCreditCard();
    }, []);

    const handleAddCreditCardClick = useCallback((creditCard) => {
        
        setIsAddingCreditCard(true);
        setAddingCreditCard(creditCard);
    }, []);

    const handleEditFormClose = useCallback(() => {
        setIsEditing(false);
        setEditingCard(null);
        getCreditCard();
    }, []);
    const handleAddCreditCard = useCallback(() => {
        setIsAddingCreditCard(false);
        setAddingCreditCard(null);
        getCreditCard();
    }, []);






     
    useEffect(() => {
        fetchProfileData();
        getCreditCard();
    }, []);

    const getCreditCard = useCallback(async (creditCardId) => {
        try {
            setLoading(true);
            let response = await fetch(
                process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards",
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );
            
            if (response.ok) {
                let creditCard = await response.json();
                setCreditCards(creditCard);

            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        } catch (error) {
            console.error("Error al obtener productos: ", error);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return (

        <>

            <Layout style={{minHeight: '100vh'}}>
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb
                        items={[
                            {
                                title: 'Home',
                                href: '/',
                            },
                            {
                                title: 'Profile',
                            },
                        ]}
                        style={{margin: '16px 0'}}
                    />

                    <Layout style={{padding: '24px 0', background: colorBgContainer}} gutter={24}>
                        <Sider style={{background: colorBgContainer,maxWidth:200}}
                               breakpoint="md"
                               collapsedWidth="0"
                               onBreakpoint={(broken) => {
                                   console.log(broken);
                               }}
                               onCollapse={(collapsed, type) => {
                                   console.log(collapsed, type);
                               }}>
                            <div className="profile-header" style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",padding:10,gap:10}}>
                                <Avatar size={100} src={"/logo.png"} />
                                <h2>{profile.name}</h2>
                                <Rate disabled defaultValue={profile.rating} />
                                <p>Location: {profile.country}</p>
                                <Button type="primary"  ><EditOutlined />Update</Button>
                            </div>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['summary']}
                                style={{height: '100%',}}
                                items={items2}
                            />
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}} md={24} md={20}>



                            {isEditing ? (

                                <Modal
                                title=""
                                centered
                                open={isEditing}
                            onOk={() => handleEditFormClose(false)}
                            onCancel={() => handleEditFormClose(false)}
                                footer={null}
                        >
                            <EditCreditCardForm
                                creditCard={editingCard}
                                onClose={handleEditFormClose}
                                openNotification={openNotification}
                            />
                        </Modal>

                            ) : isAddingCreditCard ? (

                                    <Modal
                                        title=""
                                        centered
                                        open={isAddingCreditCard}
                                        onOk={() => handleAddCreditCard(false)}
                                        onCancel={() => handleAddCreditCard(false)}
                                        footer={null}
                                    >
                                        <CreditCardForm
                                            creditCard={isAddingCreditCard}
                                            onClose={handleAddCreditCard}
                                            openNotification={openNotification}
                                        />
                                    </Modal>

                                ): (
                                <div style={{padding: 24, background: '#fff'}}>

                                    <Button type="primary" onClick={handleAddCreditCardClick} ><CreditCardOutlined/>Add New Credit Card</Button>
                                    {loading ? (
                                        <Spin size="large" />
                                    ) : (
                                        <Row gutter={16}>
                                            {creditCards.map((creditCard) => (
                                                <Col key={creditCard.id} xs={24} sm={24} md={12} xl={8} xxl={6} style={{ marginTop: 30 }}>
                                                    <CreditCard
                                                        id={creditCard.id}
                                                        number={creditCard.number}
                                                        alias={creditCard.alias}
                                                        expirationDate={creditCard.expirationDate} // Cambiado de cvc a expirationDate
                                                        openNotification={openNotification}
                                                        wasDeleted={handleDeleteClick}
                                                        onEditClick={() => handleEditClick(creditCard)}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    )}

                                </div>
                            )}

                            <ListMyTransactionsComponent openNotification={openNotification}/>
                            {contextHolder}

                        </Content>
                    </Layout>
                </Content>

            </Layout>

            <FloatButton.Group
                trigger={"hover" || "click"}
                type="primary"
                style={{right: 40}}
                icon={<PlusCircleOutlined/>}
            >
                <FloatButton href="/products/create"/>
                <FloatButton onClick={handleAddCreditCardClick} icon={<CreditCardOutlined/>}/>
            </FloatButton.Group>
        </>
    );
};

export default ProfileComponent;
