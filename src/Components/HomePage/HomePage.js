import { useState, useEffect, useRef } from "react";
import styles from "../../style.css";
import { Link } from "react-router-dom";
import { Card, Col, Row, Typography, Button, FloatButton, Carousel } from 'antd';
import {
    ShopOutlined,
    LeftOutlined,
    RightOutlined,
    LaptopOutlined,
    SkinOutlined,
    HomeOutlined,
    DribbbleOutlined,
    GiftOutlined,
    BookOutlined,
    AudioOutlined,
    CompassOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
// Arrow components
const CustomLeftArrow = ({ onClick }) => (
    <Button onClick={onClick}>
        <LeftOutlined />
    </Button>
);

const CustomRightArrow = ({ onClick }) => (
    <Button onClick={onClick}>
        <RightOutlined />
    </Button>
);


let HomePage = () => {
    let [categories, setCategories] = useState({});
    let [products, setProducts] = useState([])
    const carouselRef = useRef(null);
    const nodeRef = useRef(null);
    const [categoriesSectionList, setCategoriesSectionList] = useState([
        { name: 'Electronics', icon: <LaptopOutlined />, count: 0 },
        { name: 'Clothes', icon: <SkinOutlined />, count: 0 },
        { name: 'Home', icon: <HomeOutlined />, count: 0 },
        { name: 'Sports', icon: <DribbbleOutlined />, count: 0 },
        { name: 'Toys', icon: <GiftOutlined />, count: 0 },
        { name: 'Books', icon: <BookOutlined />, count: 0 },
        { name: 'Audio', icon: <AudioOutlined />, count: 0 },
        { name: 'Camping', icon: <CompassOutlined />, count: 0 },
    ]);
    useEffect(() => {
        // Fetch products and category counts when the component mounts
        getProducts();
        getCounts(); // Ensure this is called within useEffect
    }, []);

    const updateCategoryCounts = (categoriesList, countsData) => {
        return categoriesList.map(category => {
            // Find the matching count object by category name
            const match = countsData.find(count => count.category.toLowerCase() === category.name.toLowerCase());
            // Add the count to the category object, default to 0 if not found
        
            return { ...category, count: match ? match.num_products : 0 };
        });
    };
    const CategoryCard = ({ category }) => (
        <Col xs={12} sm={8} md={6} lg={4}>
            <Card >
                <div style={{ textAlign: 'center', fontSize: '24px' }}>
                    {category.icon}
                </div>
                <Card.Meta title={category.name} style={{ textAlign: 'center' }} />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Text type="secondary">({category.count}) products</Text>
                </div>
            </Card>
        </Col>
    );

    const CategoriesSection = () => (
        <Row gutter={[16, 16]} justify="center">
            {categoriesSectionList.map(category => (
                <CategoryCard key={category.name} category={category} />
            ))}
        </Row>
    );



    let checkImageURL = async (image_name) => {
        let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${image_name}`;
        if (await checkURL(urlImage)) {
            return urlImage;
        }
        return "/imageMockup.png"; // Fallback image if none found
    };


    const getCounts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/categories/count`, {
                headers: {
                    "apikey": localStorage.getItem("apiKey") // If your API requires an API key
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Call the function to update categories with counts
            let updatedCategories = updateCategoryCounts(categoriesSectionList, data);

            // Update state with the new category counts
            setCategoriesSectionList(updatedCategories); // This will trigger a re-render


        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };

    let getProducts = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            let promisesForImages = jsonData.map(async product => {
                product.image = await checkImageURL(product.image);
                return product;
            });

            let productsWithImage = await Promise.all(promisesForImages);
            setProducts(productsWithImage); // Set the products state here


            let groupedByCategory = productsWithImage.reduce((acc, product) => {
                acc[product.category] = acc[product.category] || [];
                acc[product.category].push(product);
                return acc;
            }, {});
            getCounts();
            setCategories(groupedByCategory);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    };
    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            console.log(response.ok)
            return response.ok; // Returns true if the status is in the 200-299 range.
        } catch (error) {
            return false; // URL does not exist or there was an error.
        }
    }


    const chunkSize = 4;
    const slides = Array(Math.ceil(products.length / chunkSize))
        .fill()
        .map((_, index) => index * chunkSize)
        .map(begin => products.slice(begin, begin + chunkSize));



    const goToNext = () => {
        carouselRef.current.next();
    };

    const goToPrev = () => {
        carouselRef.current.prev();
    };

    return (
        <div>

            <div style={{
                background: 'url(/login_image.webp) no-repeat center center',
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                backgroundSize: 'cover',
                padding: '50px',
                color: 'white',
                textAlign: 'center',
                minHeight: 600,
                height: "70vh",
                position: 'relative', // Needed to position the overlay
            }}>

                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                }}></div>


                <div style={{ position: 'relative', zIndex: 2 }}>
                    <Title level={1} style={{ color: 'white', fontSize: 50 }}>Discover a World of Local Treasures</Title>
                    <Title level={5} style={{ color: 'white', textAlign: "left", maxWidth: 800 }}>
                        Welcome to MarketPlace, the local spot for quick buys and sells. Declutter your space or snag a
                        bargain, all within your neighborhood. Join, list, and shop—it's community commerce made easy.
                        Start your local adventure now!</Title>

                </div>
                <div style={{
                    position: 'relative',
                    marginTop: 30,
                    zIndex: 2
                }}>
                    <Button type="primary" size="large" shape="round" href="/products/create">Start selling <ShopOutlined /></Button>
                    <Button type="dashed" size="large" shape="round" href="/products/own" ghost style={{ marginLeft: '15px' }}>Manage my
                        products</Button>
                </div>
            </div>

            <div style={{ padding: "20px 50px", marginTop: 40 }}>
                <CategoriesSection categories={categoriesSectionList} />

            </div>

            <div style={{ padding: "20px 50px", marginTop: 40 }}>
                <div style={{ marginTop: 40 }}>
                    <Title level={2}>Latest Products</Title>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: "flex", flexDireection: "row", gap: 10, marginBottom: 20 }}>
                            <CustomLeftArrow onClick={goToPrev} />
                            <CustomRightArrow onClick={goToNext} />
                        </div>
                        <Carousel ref={carouselRef} nodeRef={nodeRef} autoplay>


                            {slides.map((slide, index) => (
                                <div key={index}>
                                    <Row gutter={[16, 16]}>
                                        {slide.map(product => (
                                            <Col key={product.id} span={6}   xs={24} sm={12} md={8} lg={6}style={{ padding: 10 }}>
                                                <Link to={"/products/" + product.id}>
                                                    <Card
                                                        hoverable
                                                        cover={<img alt={product.title} src={product.image}  style={{ minHeight: '300px', maxHeight:"300px", objectFit:"cover", objectPosition:"center" }}/>}
                                                    >
                                                        <Card.Meta title={product.title}
                                                            description={`$${product.price}`} />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}
                        </Carousel>

                    </div>
                </div>


            </div>

            <div style={{ padding: "20px 50px" }}>
                <div style={{ marginTop: 20 }}>
                    <Row align="middle" style={{ padding: '50px', backgroundColor: '#f7f7f7', }}>
                        <Col xs={24} sm={12} md={16} style={{ padding: 20 }}>
                            <Title level={2}>A World of Possibilities</Title>
                            <Title level={5} style={{ maxWidth: "80%" }}>
                                Explore our diverse range of products and find everything you need, from everyday essentials to rare collectibles. Make the most of our seamless shopping experience.
                            </Title>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card

                                cover={<img alt="Example" src="/section-1.jpg"  style={{ minHeight: '300px', maxHeight:"300px", objectFit:"cover", objectPosition:"center" }}/>}
                                bordered={false}
                            >
                                <Title level={4}>Discover items that inspire, excite, and enhance your lifestyle.</Title>
                            </Card>
                        </Col>
                    </Row>
                </div>


                {Object.keys(categories).map(category => (
                    <div key={category} style={{ marginTop: 40,marginBottom:100 }}>
                        <Title level={4} >{category}</Title>

                        <Row gutter={[16, 16]} style={{ display: "flex", justifyContent: "center",marginTop:40,marginBottom:20 }}>
                            {categories[category].map(product => (
                                <Col key={product.id} span={6} xs={24} sm={12} md={8} lg={6}>
                                    <Link to={`/products/${product.id}`}>
                                        <Card hoverable cover={<img alt={product.title} src={product.image}  style={{ minHeight: '300px', maxHeight:"300px", objectFit:"cover", objectPosition:"center" }}/>}>
                                            <Card.Meta title={product.title} description={`$${product.price}`} />
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>

                    </div>
                ))}
            </div>
            <Row style={{ background: '#385ef9', color: 'white', padding: '50px', textAlign: 'center', minHeight: 400 }} align="middle" justify="center">
                <Col>
                    <Title style={{ color: 'white' }}>Grow your business here</Title>
                    <Paragraph style={{ color: 'white' }}>
                        Whether you want to sell products down the street or around the world, we have all the tools you need.
                    </Paragraph>
                    <Button className="custom-hover" type="dashed" ghost size="large" href="/products/create">Start to sell now</Button>
                </Col>
            </Row>

            <FloatButton.BackTop />

        </div>

    );
};

export default HomePage;
