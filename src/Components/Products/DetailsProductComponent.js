import {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Typography, Card, Descriptions, Image, Button, Col, Row, Rate,Modal,Select,Form, Flex,DatePicker } from 'antd';
import {ShoppingOutlined, HeartOutlined} from '@ant-design/icons';


const { Option } = Select;
const { Title, Text } = Typography;

const { RangePicker } = DatePicker;


let DetailsProductComponent = (props) => {

    let { openNotification} = props

    const {id} = useParams();
    let navigate = useNavigate();
    let [product, setProduct] = useState({})

    // Estado para almacenar las tarjetas disponibles
    const [creditCards, setCreditCards] = useState([]);

    // Estado para almacenar la tarjeta seleccionada
    const [selectedCreditCard, setSelectedCreditCard] = useState('');
    const[shippingDate,setShippingDate]=useState();


    // Función para manejar el cambio de tarjeta seleccionada
    const handleCreditCardChange = (value) => {
        setSelectedCreditCard(value);
        localStorage.setItem('selectedCreditCard', value);
    };





    const getCreditCard = useCallback(async (creditCardId) => {
        try {

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
                // Manejar respuesta no exitosa (como 404, 500, etc.)
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        } catch (error) {
            // Manejar errores de red o problemas al ejecutar fetch
            console.error("Error al obtener productos: ", error);
        }
    }, []);


    useEffect(() => {
        // Llama al método getCreditCard para obtener las tarjetas disponibles
        getCreditCard();

        // Recuperar la tarjeta seleccionada del localStorage (si existe)
        const storedCreditCard = localStorage.getItem('selectedCreditCard');

        if (storedCreditCard) {
            
            setSelectedCreditCard(storedCreditCard);
        }
    }, [getCreditCard]);
    const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);

    const showPurchaseModal = () => {
        setIsPurchaseModalVisible(true);
    };

    const hidePurchaseModal = () => {
        setIsPurchaseModalVisible(false);
    };


    useEffect(() => {
        getProduct(id);
    }, [id]);

    const [isProductBought, setIsProductBought] = useState();

    useEffect(() => {
        if (product.buyerName && product.buyerId != null) {

            setIsProductBought(true);
        }
    } , [product])
    let checkImageURL = async (image_name) => {
        let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${image_name}`;
        if (await checkURL(urlImage)) {
            return urlImage;
        }
        return "/imageMockup.png"; // Fallback image if none found
    };
    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            console.log(response.ok)
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    const onDateChange = (date, dateString) => {
        console.log(date, dateString);
        setShippingDate(dateString);
    }
    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1); // getMonth() returns 0-11
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    };



    let buyProduct = async () => {

        if(selectedCreditCard ===null || selectedCreditCard === undefined || selectedCreditCard ==="")
        {

            return;
        }
        let _shippingDateStart = formatDate(new Date());
        let _shippingDateEnd = formatDate(new Date());
        if( !shippingDate || shippingDate[0] ===undefined || shippingDate[1] === undefined )
        {
            _shippingDateStart = formatDate(new Date());
            _shippingDateEnd =  formatDate(new Date());
        }else{
            _shippingDateStart = shippingDate[0];
            _shippingDateEnd = shippingDate[1];
        }


        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: id,
                    buyerPaymentId: selectedCreditCard,
                    startDate: _shippingDateStart,
                    endDate:_shippingDateEnd
                })
            });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows == 1) {
                openNotification("top", "You bought the product!", "success");
                setIsProductBought(true); // Actualiza el estado a true
                navigate("/products");
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            openNotification("top",serverErrors, "error")
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let getProduct = async (id) => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            jsonData.image = await checkImageURL(jsonData.image);
            setProduct(jsonData); 
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let clickReturn = () => {
        navigate("/products")
    }

    const {Text} = Typography;

    let labelProductPrice = product.price < 10000 ? "Oferta" : "No-Oferta";


    return (
        <div style={{padding: "20px 50px", display: "flex", justifyContent: "center"}}>
            <Card style={{maxWidth: "1000px"}}>
                <Row gutter={24}>
                    <Col span={24}>

                        <Row justify="space-between">
                            <Col style={{fontWeight: "400"}}>

                                <Link to="/">Inicio</Link> / <Link to="">{product.category}</Link> / <Text
                                style={{color: "gray"}}>{product.title}</Text>
                            </Col>
                            <Col>

                                <Button shape="circle" icon={<HeartOutlined/>}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} style={{marginTop: 20}}>
                        <Row gutter={24} justify="center">
                            <Col lg={12} md={24}>

                                <Image style={{borderRadius: 10}}
                                       width="100%"
                                       src={product.image || "/imageMockup.png"}
                                />
                            </Col>
                            <Col lg={12} md={24}>

                                <Row>
                                    <Col span={24}>

                                        <Row align="stretch" style={{display: "flex", flexDirection: "column", gap: 5}}>
                                            <Col style={{display: "flex", alignItems: "center", gap:5}}>
                                                <Image style={{borderRadius: "100%", border:"solid",borderWidth:"2px",borderColor:"#e0e0e0",  objectFit: "cover",}}
                                                       width="32px"
                                                       height="32px"
                                                       src={"/logo.png"}
                                                       preview={false}
                                                />
                                                <Button type={"link"} style={{fontSize: "1.1rem", fontWeight: 500}} href={"/seller/"+product.sellerId}>
                                                  {product.sellerName} {product.sellerSurname ? product.sellerSurname.charAt(0) + "." : ""}
                                                </Button>
                                            </Col>
                                            <Col>

                                                <Rate disabled defaultValue={5}/>
                                                <Text>(0)</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{marginTop: 20}}>

                                        <Title level={1} style={{fontWeight: "bold"}}>{product.price} €</Title>
                                        <Title level={4}>{product.title}</Title>
                                    </Col>
                                    <Col span={24} style={{marginTop: 20}}>

                                        <Text>{product.description}</Text>
                                    </Col>
                                    <Col span={24} style={{marginTop: 20}}>


                                        <Button
                                            onClick={showPurchaseModal}
                                            type="primary"
                                            shape="round"
                                            icon={<ShoppingOutlined/>}
                                            size="large"
                                            disabled={isProductBought} // Deshabilita el botón si isProductBought es true
                                        >
                                            Buy
                                        </Button>


                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
            {/* Modal de compra */}
            <Modal
                title="Purchase Product"
                visible={isPurchaseModalVisible}
                onCancel={hidePurchaseModal} // Cerrar el modal al hacer clic en Cancelar
                footer={null} // Ocultar el pie de página del modal
            >

                    <Form
                        layout="vertical"
                        style={{ maxWidth: 600,marginTop:"1em",width:"100%",justifyContent:"center",alignItems:"center" }}
                    >
                        <Select
                            style={{ width: '100%' }}
                            value={selectedCreditCard}
                            onChange={handleCreditCardChange}
                        >
                            {creditCards.map(card => (
                                <Option key={card.id} value={card.id}>
                                    {card.alias}
                                </Option>
                            ))}
                        </Select>
                        <Form.Item label="Date of delivery" name="dateRange" style={{ marginTop: "1em" }}>
                            <RangePicker onChange={onDateChange} />
                        </Form.Item>
                        <Flex vertical gap="small" style={{ width: '100%' }}>

                            <Button
                                onClick={buyProduct}
                                type="primary"
                                shape="round"
                                icon={<ShoppingOutlined />}
                                size="large"
                                style={{ width: "100%" }} 
                            >
                                Buy
                            </Button>
                        </Flex>
                    </Form>

            </Modal>
        </div>
    )
}

export default DetailsProductComponent;