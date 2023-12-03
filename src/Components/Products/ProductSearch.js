import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Row, Col, Card, Pagination, Typography, Select, Empty} from 'antd';
import {Link} from 'react-router-dom';
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
    CompassOutlined,
    ReloadOutlined
} from '@ant-design/icons';

const {Text} = Typography;
const {Option} = Select;
const categories = [
    'All', // Agrega "All" como opción por defecto
    'Electronics',
    'Clothes',
    'Home',
    'Sports',
    'Toys',
    'Books',
    'Camping',
    'Audio',
];
const categoriesIcons = {
    All: <ShopOutlined/>,
    Electronics: <LaptopOutlined/>,
    Clothes: <SkinOutlined/>,
    Home: <HomeOutlined/>,
    Sports: <DribbbleOutlined/>,
    Toys: <GiftOutlined/>,
    Books: <BookOutlined/>,
    Camping: <CompassOutlined/>,
    Audio: <AudioOutlined/>,
};
let totalByCategory = {
    Electronics: 0,
    Clothes: 0,
    Home: 0,
    Sports: 0,
    Toys: 0,
    Books: 0,
    Camping: 0,
    Audio: 0,
}

const ProductSearch = ({initialProducts,sellerId}) => {
    const [form] = Form.useForm();
    const [sortKey, setSortKey] = useState('recent'); // Estado para la clave de ordenación
    const [sortDirection, setSortDirection] = useState('asc'); // Estado para la dirección de ordenación
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [search, setSearch] = useState({
        categories: ['All'],
        title: '',
        minPrice: '',
        maxPrice: '',
    });
    const [products, setProducts] = useState([]);


    const handleSortChange = (value) => {
        const [newSortKey, newSortDirection] = value.split('-');
        setSortKey(newSortKey);
        setSortDirection(newSortDirection);
        filterAndSortProducts(newSortKey, newSortDirection);
    };

    const handleSearchChange = (key, value) => {
        setSearch((prev) => ({...prev, [key]: value}));
    };

    const handleResetFilters = () => {
        form.resetFields(); // Resetear campos del formulario de Ant Design
        setSearch({
            categories: ['All'],
            title: '',
            minPrice: '',
            maxPrice: '',
        });
        setSortKey('recent');
        setSortDirection('asc');
        setCurrentPage(1);
        setPageSize(10);
    };



    const handleCategoryChange = (category) => {
        setSearch((prevSearch) => {
            let updatedCategories = [];

            if (category === 'All') {
                updatedCategories = prevSearch.categories.includes('All') ? [] : ['All'];
            } else {
                if (prevSearch.categories.includes('All')) {
                    updatedCategories = prevSearch.categories.filter((cat) => cat !== 'All');
                } else {
                    updatedCategories = [...prevSearch.categories];
                }

                if (updatedCategories.includes(category)) {
                    updatedCategories = updatedCategories.filter((cat) => cat !== category);
                } else {
                    updatedCategories.push(category);
                }
            }

            return {...prevSearch, categories: updatedCategories};
        });
    };

    const filterAndSortProducts = (sortKey, sortDirection) => {
        let result = initialProducts.filter((product) => {
            const matchCategories =
                search.categories.includes('All') ||
                search.categories.includes(product.category);
            const matchTitle = product.title
                .toLowerCase()
                .includes(search.title.toLowerCase());
            const matchPrice =
                product.price >= (search.minPrice || 0) &&
                product.price <= (search.maxPrice || Infinity);
            const notPurchased = !product.purchased;
            return matchCategories && matchTitle && matchPrice && notPurchased;
        });

        result.sort((a, b) => {
            if (sortKey === 'price') {
                return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (sortKey === 'recent') {
                return sortDirection === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            }
        });

        setTotalProducts(result.length);
        const offset = (currentPage - 1) * pageSize;
        result = result.slice(offset, offset + pageSize);
        setProducts(result);
    };

    const [categoriesCount, setCategoriesCount] = useState({});
    const getCounts = async () => {
        try {
            let url_string = ``;
            if(sellerId === undefined || sellerId === null)
            {
                url_string = `${process.env.REACT_APP_BACKEND_BASE_URL}/products/categories/count`;

            }else{
                url_string = `${process.env.REACT_APP_BACKEND_BASE_URL}/products/categories/count?sellerId=${sellerId}`;
            }
            const response = await fetch(url_string, {
                headers: {
                    "apikey": localStorage.getItem("apiKey") // If your API requires an API key
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Inicializamos un objeto para almacenar la cuenta de productos por categoría
            let categoriesCount = {
                All: 0, // Agregamos 'All' como categoría con un recuento inicial de 0
            };

            let totalProductsAll = 0; // Inicializamos el recuento total de productos
            // Iteramos sobre los datos para contar los productos por categoría
            data.forEach((item) => {
                // Incrementamos la cuenta de la categoría actual
                if (categoriesCount[item.category] === undefined) {
                    categoriesCount[item.category] = item.num_products;
                    totalProductsAll += item.num_products;
                } else {
                    categoriesCount[item.category] += item.num_products;

                }
            });

            // Actualizamos el estado de totalByCategory con los resultados
            totalByCategory = { ...categoriesCount };
            categoriesCount['All']  = totalProductsAll;
            totalByCategory = categoriesCount;
          
            setCategoriesCount(totalByCategory);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getCounts();
        filterAndSortProducts(sortKey, sortDirection);
    }, [currentPage, pageSize, search, sortKey, sortDirection]);


    return (
        <>
            <Form form={form} size={"large"}>
                <Row gutter={24} style={{marginBottom: 20,justifyContent:"start",flexDirection:"column"}}>
                   <Col
                        span={6}>
                       <Typography.Title level={4} strong>Filter:</Typography.Title>

                   </Col>
                    <Col span={6}>
                        <Button onClick={handleResetFilters} type={"dashed"}> <ReloadOutlined/> Reset Filters
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}
                     style={{backgroundColor: "white", borderRadius: 5, padding: "20px 10px", alignItems: "center"}}>

                    <Col sm={24} md={10} span={12}>


                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    icon={categoriesIcons[category]}
                                    type={
                                        search.categories.includes(category) ? 'primary' : 'default'
                                    }
                                    onClick={() => handleCategoryChange(category)}
                                    style={{margin: '5px'}}
                                >
                                    {category} ({categoriesCount[category] || 0})
                                </Button>
                            ))}

                    </Col>
                    <Col sm={24} md={6}span={6} >
                        <Form.Item name="title">
                            <Input
                                placeholder="Search by title"
                                onChange={(e) => handleSearchChange('title', e.target.value)}
                            />
                        </Form.Item>

                    </Col>
                    <Col sm={12} md={4} span={3}>
                        <Form.Item name="minPrice">
                            <Input
                                placeholder="Min price"
                                type="number"
                                onChange={(e) => handleSearchChange('minPrice', Number(e.target.value))}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={12} md={4} span={3}>
                        <Form.Item name="maxPrice">
                            <Input
                                placeholder="Max price"
                                type="number"
                                onChange={(e) => handleSearchChange('maxPrice', Number(e.target.value))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>


            {products.length > 0 ? (
                <>
                    <Row style={{marginBottom: 20, marginTop: 20}}>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Select

                                defaultValue={`recent-${sortDirection}`}
                                style={{width: 170}}
                                onChange={handleSortChange}
                            >
                                <Option value="price-asc">Price (Low to High)</Option>
                                <Option value="price-desc">Price (High to Low)</Option>
                                <Option value="recent-asc">Most Recent</Option>
                                <Option value="recent-desc">Oldest</Option>
                            </Select>
                        </Col>
                    </Row>


                    <Row gutter={24}>
                        {products.map((product) => (
                            <Col key={product.id} span={6} style={{marginTop: 30}} span={6} xs={24} sm={12} md={8}
                                 lg={6}>
                                <Link to={`/products/${product.id}`}>
                                    <Card
                                        cover={<img alt={product.title} src={product.image} style={{
                                            minHeight: '300px',
                                            maxHeight: "300px",
                                            objectFit: "cover",
                                            objectPosition: "center"
                                        }}/>}

                                    >
                                        <Card.Meta
                                            title={product.title}
                                            description={`$${product.price}`}
                                        />
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>

                    {products.length > pageSize || totalProducts > 0 ? (
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            total={totalProducts}
                            showSizeChanger
                            onShowSizeChange={(current, size) => setPageSize(size)}
                            style={{textAlign: 'center', margin: '20px 0'}}
                        />
                    ) : null}
                </>
            ) : (
                <div style={{textAlign: 'center', margin: '20px 0'}}>
                    <Empty/>
                    <Typography.Title level={4}>No products found</Typography.Title>
                    <Typography.Paragraph>
                        Try adjusting your search or filter settings.
                    </Typography.Paragraph>
                </div>
            )}
        </>
    );
};

export default ProductSearch;
