import { useState, useEffect } from "react";
import { Table, Space, Spin } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString } from "../../Utils/UtilsDates";

let ListPublicTransactionsComponent = ({ userId, userType }) => {
    let [transactions, setTransactions] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserTransactions();
    }, [userId, userType]);

    let getUserTransactions = async () => {
        try {
            setLoading(true);
            let endpoint = userType === "seller" ? "/transactions/public?sellerId=" : "/transactions/public?buyerId=";
            let response = await fetch(
                process.env.REACT_APP_BACKEND_BASE_URL + endpoint + userId,
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
                console.log("jsonData: ", jsonData);
                setTransactions(jsonData);
            } else {
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
            title: "Product Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => <Link to={`/products/${record.productId}`}>{record.title}</Link>
        },
        {
            title: "Date of delivery",
            dataIndex: "startDate",
            key: "date",
            render: (text,record) => <span>{formatDate(record.startDate)} - { formatDate(record.endDate)}</span>
        },
        {
            title: "Details",
            key: "details",
            render: (text, record) => <Link to={`/transaction/${record.id}`}>View Details</Link>
        }
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div >
            <Table   
                    scroll={{ x: 1000 }} columns={columns} dataSource={transactions} />
        </div>
    );
}

export default ListPublicTransactionsComponent;
