import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Card, List, Avatar, Button, Rate, Tabs, Spin, Row, Col, Layout, Breadcrumb, theme} from 'antd';

import ProductSearch from '../Products/ProductSearch';
import ListPublicTransactionsComponent from './ListPublicTransactionsComponent';

const {TabPane} = Tabs;
const {Sider, Content, Header, Footer} = Layout;

const PublicUserProfileComponent = (props) => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const {openNotification} = props;
    const {id} = useParams();
    const [profile, setProfile] = useState(null);
    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState(false);
    let userType = "seller";

    if (profile && profile.email === localStorage.getItem("email")) {

        userType = "buyer";
    }


    useEffect(() => {

        fetchProfileData();
        getProducts();
    }, [id]);


    const fetchProfileData = async () => {
        try {
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`,
                {
                    method: "GET",
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
        } finally {
            //setLoading(false);
        }
    };


    let getProducts = async () => {
        setLoading(true);

        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products?sellerId=${id}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();

            let promisesForImages = jsonData.map(async p => {
                let urlImage = process.env.REACT_APP_BACKEND_BASE_URL + "/images/" + p.image;
                let existsImage = await checkURL(urlImage);
                if (existsImage)
                    p.image = urlImage
                else
                    p.image = "/imageMockup.png"
                return p
            })

            let productsWithImage = await Promise.all(promisesForImages)


            // Supongamos que tienes un email almacenado en localStorage
            const localStorageEmail = localStorage.getItem("email");


            // Inicializa tmp_products como un array vacío
            let tmp_products = [];

            // Filtra los productos
            let filteredProducts = productsWithImage.filter(product => {
                if (product.buyerEmail === null && product.buyerEmail !== localStorageEmail) {
                    tmp_products.push(product);
                }
                // Verificar si el buyerEmail es null o no es igual al email de localStorage
                return product.buyerEmail === null && product.buyerEmail !== localStorageEmail;
            });


            setProducts(tmp_products)

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
        setLoading(false);

    }


    let checkURL = async (url) => {
        try {
            let response = await fetch(url);

            return response.ok;
        } catch (error) {
            return false;
        }
    }


    const tabsItems = [
        {
            label: 'Products For Sale',
            key: '1',
            children: (
                <div style={{padding: "20px 50px"}}>
                    {loading ? <p>Loading products...</p> : <ProductSearch initialProducts={products} sellerId={id}/>}
                </div>
            ),
        },
        {
            label: 'Transactions',
            key: '2',
            children: (
                <div>
                    <ListPublicTransactionsComponent userId={id} userType={userType}/>
                </div>
            ),
        },
    ];

    return (
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
                {profile && (


                    <Layout style={{padding: '24px 0', background: colorBgContainer}}>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <div style={{padding: "20px 50px"}}>
                            </div>
                                {(loading) && (

                                    <Spin size="large"/>
                                )
                                }
                                <Row>

                                    <Col span={24}>

                                        <div className="profile-header" style={{display:"flex",flexDirection:"row", alignItems:"center"}}>
                                            <Avatar size={100} src={"/logo.png"}/>

                                           <div style={{marginLeft:"20px",display:"flex",flexDirection:"column",gap:10}}>
                                               <h2>{profile.name}</h2>
                                               <Rate disabled defaultValue={profile.rating}/>
                                               <p>Location: {profile.country}</p>
                                             </div>


                                        </div>
                                        <Tabs defaultActiveKey="1" items={tabsItems}/>
                                    </Col>


                                </Row>
                        </Content>

                    </Layout>
                )}
            </Content>

        </Layout>
    );
};

export default PublicUserProfileComponent;
