import { useState, useEffect } from "react";
import { Table, Space, Spin } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString } from "../../Utils/UtilsDates";

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyTransactions();
    }, []);

    let getMyTransactions = async () => {
        try {
            setLoading(true);
            let response = await fetch(
                process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/own",
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );
            if (response.ok) {
                let jsonData = await response.json();
                jsonData = jsonData.map(tx => ({ ...tx, key: tx.id }));

                setTransactions(jsonData);
            } else {
                // Manejar respuesta no exitosa
                console.error("Error al obtener transacciones");
            }
        } catch (error) {
            console.error("Error al obtener transacciones: ", error);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };
    let columns = [
        {
            title: "Transaction ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Seller",
            dataIndex: "sellerId",
            key: "sellerId",
            render: (text, record) => <Link to={`/seller/${record.sellerId}`}>{record.sellerName}</Link>
        },
        {
            title: "Buyer",
            dataIndex: "buyerId",
            key: "buyerId",
            render: (text, record) => <Link to={`/seller/${record.buyerId}`}>{record.buyerName}</Link>
        },
        {
            title: "Product Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => <Link to={`/products/${record.productId}`}>{record.title}</Link>,
            responsive: ['lg'],
        },
        {
            title: "Details",
            key: "details",
            render: (text, record) => <Link to={`/products/${record.id}`}>View Details</Link>
        }
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (

            <Table
                expandable={{
                    expandedRowRender: record => (
                        <div>
                            <p style={{ margin: 0 }}>{record.description}</p>
                            <p style={{ margin: 0 }}>
                                <strong>Date of Delivery:</strong> {formatDate(record.startDate)} - { formatDate(record.endDate)}

                            </p>

                        </div>
                    ),
                    rowExpandable: record => record.description !== '',
                }}
                scroll={{ x: 1000 }}

                columns={columns} dataSource={transactions} />

    );
}

export default ListMyTransactionsComponent;
