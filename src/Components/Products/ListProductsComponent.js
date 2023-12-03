import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Card, Col, Row } from 'antd';
import ProductSearch from "./ProductSearch";

let ListProductsComponent = () => {

    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState(false);




    let getProducts = async () => {
        setLoading(true);
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products",
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
                if(product.buyerEmail === null && product.buyerEmail !== localStorageEmail){
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
            //console.log(response.ok)
            return response.ok; // Returns true if the status is in the 200-299 range.
        } catch (error) {
            return false; // URL does not exist or there was an error.
        }
    }


    useEffect(() => {
        getProducts();
    }, [])

    return (
        <div style={{ padding: "20px 50px" }}>
            <h2>Products</h2>
            {loading ? <p>Loading products...</p> : <ProductSearch initialProducts={products} />}
        </div>
    )
}

export default ListProductsComponent;