import {useState, useEffect } from "react";
import { Table, Space } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString} from "../../Utils/UtilsDates";

let ListMyProductsComponent = () => {
    let [products, setProducts] = useState([])

    useEffect(() => {
        getMyProducts();
    }, [])

    let deleteProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            if ( jsonData.deleted){
                let productsAftherDelete = products.filter(p => p.id != id)
                setProducts(productsAftherDelete)
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let getMyProducts = async () => {
        try {
            let response = await fetch(
                process.env.REACT_APP_BACKEND_BASE_URL+"/products/own/",
                {
                    method: "GET",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    },
                }
            );

            if (response.ok) {
                let jsonData = await response.json();
                jsonData = jsonData.map(product => ({ ...product, key: product.id }));
                setProducts(jsonData);
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
    };


    let columns = [
        {
            title: "Id",
            dataIndex: "id",
        },
        {
            title: "Seller Id",
            dataIndex: "sellerId"
        },
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text, record) => {
                const date = new Date(record.date);
                const dia = String(date.getDate()).padStart(2, '0');
                const mes = String(date.getMonth() + 1).padStart(2, '0');
                const anio = date.getFullYear();
                return <span>{`${dia}/${mes}/${anio}`}</span>;
            }
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (product) =>
               <Link to={"/user/"+product.buyerId}>{ product.buyerEmail }</Link>
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (id) =>
                <Space.Compact direction="vertical">
                    <Link to={"/products/edit/"+id}>Edit</Link>
                    <Link to={"#"} onClick={() => deleteProduct(id)}>Delete</Link>
                </Space.Compact>
        },
    ]

    return (
        <div style={{padding: "20px 50px"}}>
        <Table columns={columns} dataSource={products}></Table>
        </div>
    )
}

export default ListMyProductsComponent;